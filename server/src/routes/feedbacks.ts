import {Hono} from "hono";
import { createErrorResponse } from "../errors/error.js";
import { z } from 'zod';
import dotenv from "dotenv";
import {EntityManager} from "@mikro-orm/core";
import {approveFeedback} from "../controllers/feedbackController.js";
import { isAdmin } from "../middleware/isAdmin.js";
import logger from "../utils/logger.js";
import {isLoggedIn} from "../middleware/isLoggedIn.js";

dotenv.config();

const feedbacks = new Hono();

const numberIdSchema = z.object({id: z.preprocess((val) => Number(val), z.number())});

/**
 * Handles approving a feedback.
 *
 * @param ctx - The Hono context object.
 * @param isAdmin - Middleware so only admins can use.
 * @returns A response with a success or error message.
 */
feedbacks.put('/:id/approve', isLoggedIn, isAdmin, async (ctx) => {
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

export default feedbacks;