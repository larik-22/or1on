import {Hono} from "hono";
import { createErrorResponse } from "../errors/error.js";
import {z} from 'zod';
import dotenv from "dotenv";
import {EntityManager} from "@mikro-orm/core";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {updateHighlight, deleteHighlight} from "../controllers/highlightController.js";
import {createHighlight, approveHighlightSuggestion} from "../controllers/highlightController.js";
import {getAllHighlights, getHighlightById} from "../controllers/highlightController.js";
import logger from "../utils/logger.js";
import {createFeedback, getFeedbackByHighlight} from "../controllers/feedbackController.js";
import type {User} from "../models/user.js";
import {getUserByEmail} from "../controllers/userController.js";
import {isUser} from "../middleware/isUser.js";
import {getHighlightsByUserToken} from "../controllers/highlightController.js";


dotenv.config();

const highlights = new Hono();

const highlightSchema = z.object({
    name: z.string(),
    description: z.string(),
    category: z.string(),
    latitude:z.number().nullable(),
    longitude:z.number().nullable(),
    is_approved: z.boolean().default(false),
    businessDescription: z.string().optional()
})

const feedbackSchema = z.object({
    rating: z.number(),
    feedbackMessage: z.string()
})

const numberIdSchema = z.object({id: z.preprocess((val) => Number(val), z.number())});

/**
 * Handles fetching all highlights.
 *
 * @param ctx - The Hono context object.
 * @returns A response the list of highlights or an error message.
 */
highlights.get('/', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const highlights = await getAllHighlights(em);

        return ctx.json({highlights}, 200)
    }catch (error){
        logger.error('Error while fetching highlights', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

highlights.get('/my-highlights', isLoggedIn, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const jwtPayload = ctx.get('jwtPayload');

        // Check if we have the user's email from JWT
        if (!jwtPayload?.email) {
            logger.warn('JWT payload missing email', { payload: jwtPayload });
            return ctx.json(
                createErrorResponse(401, 'Invalid authentication token'),
                401
            );
        }

        const highlights = await getHighlightsByUserToken(em, jwtPayload.email);

        // Return empty array if null (no user found)
        if (highlights === null) {
            logger.info('No highlights found for user', { email: jwtPayload.email });
            return ctx.json({ highlights: [] }, 200);
        }

        logger.info('Successfully retrieved highlights for user', {
            email: jwtPayload.email,
            count: highlights.length
        });

        return ctx.json({ highlights }, 200);
    } catch (error) {
        logger.error('Error while fetching highlights for user', {
            error: error,
            userEmail: ctx.get('jwtPayload')?.email
        });
        return ctx.json(createErrorResponse(500, 'Internal server error'), 500);
    }
});

/**
 * Handles fetching a highlight by id.
 *
 * @param ctx - The Hono context object.
 * @returns A response with the highlight or an error message.
 */
highlights.get('/:id', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const { id } = ctx.req.param();
        const highlight = await getHighlightById(em, parseInt(id));

        if (highlight === null){
            return ctx.json({message: 'Highlight not found'}, 404);
        }

        return ctx.json({highlight}, 200)
    }catch (error){
        logger.error('Error while fetching highlight', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Fetches all feedback by highlight id.
 *
 * @param ctx - The Hono context object.
 * @returns A response the list of feedbacks or an error message.
 */
highlights.get('/:id/feedbacks', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const params = numberIdSchema.safeParse(ctx.req.param());

        if (!params.success){
            return ctx.json(createErrorResponse(400, 'Invalid highlightId parameter'), 400)
        }

        const {id} = params.data;

        const feedbacks = await getFeedbackByHighlight(em, id);

        if (!feedbacks){
            return ctx.json({message: 'No feedbacks found'}, 404);
        }

        const formattedFeedbacks = feedbacks
            .filter(feedback => feedback.is_approved)
            .map(feedback => ({
                id: feedback.id,
                highlight: {
                    id: feedback.highlight?.id,
                    name: feedback.highlight?.name
                },
                user: {
                    id: feedback.user.id,
                    username: feedback.user.username
                },
                rating: feedback.rating,
                comment: feedback.comment
            }));

        return ctx.json(formattedFeedbacks, 200);
    }catch (error){
        logger.error('Error while fetching feedbacks', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

highlights.post('/:id/feedbacks', isLoggedIn, isUser,async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const userPayload = ctx.get('jwtPayload') as User;
        const { id } = ctx.req.param();
        const body = await ctx.req.json();

        const feedback = feedbackSchema.safeParse(body);
        if (!feedback.success){
            return ctx.json({ message: 'Invalid feedback data' }, 400);
        }

        const { rating, feedbackMessage } = feedback.data;

        const user = await getUserByEmail(em, userPayload.email);

        if (!user){
            return ctx.json({message: 'User not found'}, 404);
        }
        await createFeedback(em, parseInt(id), user, rating, feedbackMessage);

        return ctx.json({ message: 'Feedback submitted successfully' }, 201);
    } catch (error) {
        logger.error('Error while submitting feedback: ' + error);
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
});

/**
 * Handles creating a highlight.
 *
 * @param ctx - The Hono context object.
 * @param isLoggedIn - Middleware so only logged-in users can use.
 * @returns A response with a success or error message.
 */
highlights.post('/', isLoggedIn, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const body = await ctx.req.json();
        const highlight = highlightSchema.safeParse(body);
        const payload = ctx.get('jwtPayload') as User;

        if (!highlight.success) {
            return ctx.json(createErrorResponse(400, 'Invalid data'), 400);
        }

        if (payload.isAdmin || payload.verified) {
            highlight.data.is_approved = true;
        }

        // Pass the user email to createHighlight
        await createHighlight(em, highlight.data, payload.email);
        return ctx.json({message: 'Highlight created successfully'}, 201);
    } catch (error) {
        logger.error('Error while creating highlight', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
});

/**
 * Handles approving a highlight suggestion.
 *
 * @param ctx - The Hono context object.
 * @param isAdmin - Middleware so only admins can use.
 * @returns A response with a success or error message.
 */
highlights.put('/:id/approve', isLoggedIn, isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const {id} = ctx.req.param();

        if (id === null){
            return ctx.json(createErrorResponse(400, 'Invalid highlightId parameter'), 400)
        }

        await approveHighlightSuggestion(em, parseInt(id));

        return ctx.json({message: `Highlight with ID ${id} approved`}, 200)
    }catch (error){
        logger.error('Error while approving highlight', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles updating a highlight.
 *
 * @param ctx - The Hono context object.
 * @param isAdmin - Middleware so only admins can use.
 * @returns A response with a success or error message.
 */
highlights.put('/:id', isLoggedIn, isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const params = numberIdSchema.safeParse(ctx.req.param());

        if (!params.success) {
            return ctx.json(createErrorResponse(400, 'Invalid highlightId parameter'), 400);
        }

        const { id } = params.data;
        const highlight = await getHighlightById(em, id);

        if (!highlight) {
            return ctx.json({message: `Highlight not found`}, 404);
        }

        const body = await ctx.req.json();
        const highlightData = highlightSchema.safeParse(body)
        if (!highlightData.success){
            return ctx.json({message: `Invalid query parameter`}, 400);
        }

        await updateHighlight(em, id, highlightData.data);

        return ctx.json({message: `Highlight with ID ${id} updated`}, 200);
    } catch (error) {
        logger.error('Error while updating highlight', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
});

/**
 * Handles deleting a highlight.
 *
 * @param ctx - The Hono context object.
 * @param isAdmin - Middleware so only admins can use.
 * @returns A response with a success or error message.
 */
highlights.delete('/:id', isLoggedIn, isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const {id} = ctx.req.param();

        await deleteHighlight(em, parseInt(id));

        return ctx.json({message: `Highlight with ID ${id} deleted`}, 200)
    }catch (error){
        logger.error('Error while deleting highlight', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

export default highlights;