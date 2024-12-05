import {Hono} from "hono";
import { createErrorResponse } from "../errors/error.js";
import { z } from 'zod';
import dotenv from "dotenv";
import {EntityManager} from "@mikro-orm/core";
import {getFeedbackByUserId, getFeedbackByHighlight, approveFeedback, deleteFeedback} from "../controllers/feedbackController.js";
import { isAdmin } from "../middleware/isAdmin.js";

dotenv.config();

const feedbacks = new Hono();

const idSchema = z.object({highlightId: z.string().uuid()});

/**
 * Fetches all feedback by highlight id.
 *
 * @param ctx - The Hono context object.
 * @returns A response the list of feedbacks or an error message.
 */
feedbacks.get('/highlight/:id', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const params = idSchema.safeParse(ctx.req.param());

        if (!params.success){
            return ctx.json(createErrorResponse(400, 'Invalid highlightId parameter'), 400)
        }

        const {highlightId} = params.data;
        const feedback = getFeedbackByHighlight(em, highlightId);

        if(!feedback){
            return ctx.json({message: 'No feedback found'}, 404);
        }

        return ctx.json(feedback, 200);
    }catch (error){
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Fetches all feedback by highlight id.
 *
 * @param ctx - The Hono context object.
 * @param isAdmin - Middleware so only admins can use.
 * @returns A response the list of feedbacks or an error message.
 */
feedbacks.get('/user/:id', isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const params = idSchema.safeParse(ctx.req.param());

        if (!params.success){
            return ctx.json(createErrorResponse(400, 'Invalid userId parameter'), 400)
        }

        const {userId} = params.data;
        const feedback = getFeedbackByUserId(em, userId);

        if(!feedback){
            return ctx.json({message: 'No feedback found'}, 404);
        }

        return ctx.json(feedback, 200);
    }catch (error){
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
feedbacks.put('/:id/approve', isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const params = idSchema.safeParse(ctx.req.param());

        if (!params.success){
            return ctx.json(createErrorResponse(400, 'Invalid feedbackId parameter'), 400)
        }

        const {feedbackId} = params.data;

        await approveFeedback(em, feedbackId);

        return ctx.json({message: 'Feedback approved successfully'}, 200);
    }catch (error){
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles deleting a feedback.
 *
 * @param ctx - The Hono context object.
 * @param isAdmin - Middleware so only admins can use.
 * @returns A response with a success or error message.
 */
feedbacks.delete('/:id', isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const params = idSchema.safeParse(ctx.req.param());

        if (!params.success){
            return ctx.json(createErrorResponse(400, 'Invalid feedbackId parameter'), 400)
        }

        const {feedbackId} = params.data;
        await deleteFeedback(em, feedbackId);

        return ctx.json({message: 'Feedback deleted successfully'}, 200);
    }catch (error){
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

export default feedbacks;