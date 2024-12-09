import {Hono} from "hono";
import { createErrorResponse } from "../errors/error.js";
import { z } from 'zod';
import dotenv from "dotenv";
import {EntityManager} from "@mikro-orm/core";
import {approveFeedback, deleteFeedback} from "../controllers/feedbackController.js";
import {getFeedbackByUserId, getFeedbackByHighlight} from "../controllers/feedbackController.js";
import { isAdmin } from "../middleware/isAdmin.js";
import logger from "../utils/logger.js";

dotenv.config();

const feedbacks = new Hono();

const userIdSchema = z.object({id: z.string().uuid()});

const numberIdSchema = z.object({id: z.preprocess((val) => Number(val), z.number())});

/**
 * Fetches all feedback by highlight id.
 *
 * @param ctx - The Hono context object.
 * @returns A response the list of feedbacks or an error message.
 */
feedbacks.get('/highlight/:id', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const params = numberIdSchema.safeParse(ctx.req.param());

        if (!params.success){
            return ctx.json(createErrorResponse(400, 'Invalid highlightId parameter'), 400)
        }

        const {id} = params.data;
        const feedback = getFeedbackByHighlight(em, id);

        if(!feedback){
            return ctx.json({message: 'No feedback found'}, 404);
        }

        return ctx.json(feedback, 200);
    }catch (error){
        logger.error('Error while fetching feedbacks', { error: error });
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
        const params = userIdSchema.safeParse(ctx.req.param());

        if (!params.success){
            return ctx.json(createErrorResponse(400, 'Invalid userId parameter'), 400)
        }

        const {id} = params.data;
        const feedback = getFeedbackByUserId(em, id);

        if(!feedback){
            return ctx.json({message: 'No feedback found'}, 404);
        }

        return ctx.json(feedback, 200);
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
feedbacks.put('/:id/approve', isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const params = numberIdSchema.safeParse(ctx.req.param());

        if (!params.success){
            return ctx.json(createErrorResponse(400, 'Invalid feedbackId parameter'), 400)
        }

        const {id} = params.data;

        await approveFeedback(em, id);

        return ctx.json({message: 'Feedback approved successfully'}, 200);
    }catch (error){
        logger.error('Error while approving highlight', { error: error });
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
        const params = numberIdSchema.safeParse(ctx.req.param());

        if (!params.success){
            return ctx.json(createErrorResponse(400, 'Invalid feedbackId parameter'), 400)
        }

        const {id} = params.data;
        await deleteFeedback(em, id);

        return ctx.json({message: 'Feedback deleted successfully'}, 200);
    }catch (error){
        logger.error('Error while deleting feedback', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

export default feedbacks;