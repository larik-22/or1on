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

dotenv.config();

const highlights = new Hono();

const highlightSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    latitude:z.number().nullable(),
    longitude:z.number().nullable(),
    is_approved: z.boolean().default(false)
})

/**
 * Handles fetching all highlights.
 *
 * @param ctx - The Hono context object.
 * @returns A response the list of highlights or an error message.
 */
highlights.get('/', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const highlights = getAllHighlights(em);

        return ctx.json({highlights}, 200)
    }catch (error){
        logger.error('Error while fetching highlights', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles fetching a highlight by id.
 *
 * @param ctx - The Hono context object.
 * @returns A response with the highlight or an error message.
 */
highlights.get('/:id', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const { id } = ctx.req.param();
        const highlight = getHighlightById(em, parseInt(id));

        if (!highlight){
            return ctx.json({message: 'Highlight not found'}, 404);
        }

        return ctx.json({highlight}, 200)
    }catch (error){
        logger.error('Error while fetching highlight', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles creating a highlight.
 *
 * @param ctx - The Hono context object.
 * @param isLoggedIn - Middleware so only logged-in users can use.
 * @returns A response with a success or error message.
 */
highlights.post('/', isLoggedIn, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const body = await ctx.req.json();
        const highlight = highlightSchema.safeParse(body);

        if (!highlight.success){
            return ctx.json(createErrorResponse(400, 'Invalid data'), 400);
        }

        await createHighlight(em, highlight.data);

        return ctx.json({message: 'Highlight created successfully'}, 201)
    }catch (error){
        logger.error('Error while creating highlight', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles approving a highlight suggestion.
 *
 * @param ctx - The Hono context object.
 * @param isAdmin - Middleware so only admins can use.
 * @returns A response with a success or error message.
 */
highlights.put('/:id/approve', isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const {id} = ctx.req.param();

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
highlights.put('/:id', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const id = parseInt(ctx.req.param('id'))

        const highlight = await getHighlightById(em, id);

        if (!highlight){
            return ctx.json({message: `Highlight not found`}, 404);
        }

        const body = await ctx.req.json();
        const highlightData = highlightSchema.safeParse(body)
        if (!highlightData.success){
            return ctx.json({message: `Invalid query parameter`}, 400);
        }

        await updateHighlight(em, id, highlightData.data);

        return ctx.json({message: `Highlight with ID ${id} updated`}, 200);
    }catch (error){
        logger.error('Error while updating highlight', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles deleting a highlight.
 *
 * @param ctx - The Hono context object.
 * @param isAdmin - Middleware so only admins can use.
 * @returns A response with a success or error message.
 */
highlights.delete('/:id', isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const {id} = ctx.req.param();

        await deleteHighlight(em, parseInt(id));

        return ctx.json({message: `Highlight with ID ${id} deleted`}, 200)
    }catch (error){
        logger.error('Error while deleting highlight', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

export default highlights;