import {Hono} from "hono";
import {createErrorResponse} from "../errors/error.js";
import {z} from 'zod';
import dotenv from "dotenv";
import {EntityManager} from "@mikro-orm/core";
import {
    approveFeedback, deleteFeedback, getAllFeedbacks, getFeedbackById,
    getFeedbackByUserId,
    getFeedbacksForApproval
} from "../controllers/feedbackController.js";
import {isAdmin} from "../middleware/isAdmin.js";
import logger from "../utils/logger.js";
import {isLoggedIn} from "../middleware/isLoggedIn.js";
import type {User} from "../models/user.js";

dotenv.config();

const feedbacks = new Hono();

const numberIdSchema = z.object({id: z.preprocess((val) => Number(val), z.number())});


feedbacks.get('/', isLoggedIn, isAdmin, async (ctx) => {
    try{
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const feedbacks = await getAllFeedbacks(em)

        return ctx.json({feedbacks}, 200)
    }catch (error){
        logger.error('Error while fetching feedbacks', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})



/**
 * Handles approving a feedback.
 *
 * @param ctx - The Hono context object.
 * @param isAdmin - Middleware so only admins can use.
 * @returns A response with a success or error message.
 */
feedbacks.put('/:id/approve', isLoggedIn, isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const params = numberIdSchema.safeParse(ctx.req.param());

        if (!params.success) {
            return ctx.json(createErrorResponse(400, 'Invalid feedbackId parameter'), 400);
        }

        const {id} = params.data;

        await approveFeedback(em, id);

        return ctx.json({message: 'Feedback approved successfully'}, 200);
    } catch (error) {
        logger.error('Error while approving highlight', {error});
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
});

/**
 * Handles fetching all feedbacks for approval.
 *
 * @param ctx - The Hono context object.
 * @returns A response with the list of feedbacks or an error message.
 */
feedbacks.get('/approval', isLoggedIn, isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const feedbacks = await getFeedbacksForApproval(em);

        if (!feedbacks) {
            return ctx.json({ message: 'No feedbacks found' }, 404);
        }

        const formattedFeedbacks = feedbacks.map(feedback => ({
            id: feedback.id,
            tour: feedback.tour,
            highlight: {
                id: feedback.highlight?.id,
                name: feedback.highlight?.name,
            },
            user: {
                id: feedback.user.id,
                username: feedback.user.username, // Include the username here
            },
            rating: feedback.rating,
            comment: feedback.comment,
            is_approved: feedback.is_approved,
        }));

        return ctx.json(formattedFeedbacks, 200);
    } catch (error) {
        logger.error('Error while fetching feedbacks for approval', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
});

/**
 * Handles fetching all feedbacks for a specific user.
 *
 * @param ctx - The Hono context object.
 * @returns A response with the list of feedbacks or an error message.
 */
feedbacks.get('/user/:id', isLoggedIn, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const {id} = ctx.req.param();

        if (!id) {
            return ctx.json(createErrorResponse(400, 'User ID parameter is missing'), 400);
        }

        const feedbacks = await getFeedbackByUserId(em, id);

        if (!feedbacks || feedbacks.length === 0) {
            return ctx.json({message: 'No feedbacks found for this user'}, 404);
        }

        return ctx.json({feedbacks}, 200);
    } catch (error) {
        logger.error('Error while fetching feedbacks for user', {error});
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
});

feedbacks.put('/:id', isLoggedIn, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const params = numberIdSchema.safeParse(ctx.req.param());
        const body = await ctx.req.json();

        const payload = ctx.get('jwtPayload') as User

        if (!params.success){
            return ctx.json(createErrorResponse(400, 'Invalid feedbackId parameter'), 400)
        }

        const {id} = params.data;

        const feedback = await getFeedbackById(em, id)
        if (feedback === null){
            return ctx.json(createErrorResponse(404, 'Feedback not found'), 404)
        }

        if (payload.id !== feedback.user.id && !payload.isAdmin ){
            return ctx.json(createErrorResponse(403,
                'You are not allowed to update this feedback'), 403)
        }

        await em.populate(feedback, 'user')

        feedback.comment = body.comment || feedback.comment;
        feedback.rating = body.rating || feedback.rating;

        await em.persistAndFlush(feedback);

        return ctx.json({message: 'Feedback updated successfully'}, 200);
    }catch (error){
        logger.error('Error while updating feedback', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
});

/**
 * Handles deleting a feedback.
 *
 * @param ctx - The Hono context object.
 * @returns A response with a success or error message.
 */

feedbacks.delete('/:id', isLoggedIn, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const params = numberIdSchema.safeParse(ctx.req.param());

        const payload = ctx.get('jwtPayload') as User


        if (!params.success){
            return ctx.json(createErrorResponse(400, 'Invalid feedbackId parameter'), 400)
        }

        const {id} = params.data;

        const feedback = await getFeedbackById(em, id)
        if (feedback === null){
            return ctx.json(createErrorResponse(404, 'Feedback not found'), 404)
        }

        if (payload.id !== feedback.user.id && !payload.isAdmin ){
            return ctx.json(createErrorResponse(403,
                'You are not allowed to delete this feedback'), 403)
        }

        await deleteFeedback(em, id);

        return ctx.json({message: 'Feedback deleted successfully'}, 200);
    }catch (error){
        logger.error('Error while deleting feedback', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
});


export default feedbacks;