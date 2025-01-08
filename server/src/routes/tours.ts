import {Hono} from "hono";
import { createErrorResponse } from "../errors/error.js";
import { z } from 'zod';
import dotenv from "dotenv";
import { updateTour, deleteTour} from "../controllers/tourController.js";
import { getHighlightsByTour, createTour} from "../controllers/tourController.js";
import { getAllTours, getTourById} from "../controllers/tourController.js";
import {EntityManager} from "@mikro-orm/core";
import { isAdmin } from "../middleware/isAdmin.js";
import logger from "../utils/logger.js";
import {isLoggedIn} from "../middleware/isLoggedIn.js";

dotenv.config();

const tours = new Hono();

const tourSchema = z.object({
    name: z.string(),
    description: z.string().optional().nullable(),
    duration_time: z.string().optional().nullable(),
    start_hour: z.string().optional().nullable(),
    highlights: z.array(z.any()).optional(),
    category: z.string()
})

/**
 * Handles fetching all tours.
 *
 * @param ctx - The Hono context object.
 * @returns A response the list of tours or an error message.
 */
tours.get('/', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const tours = await getAllTours(em);

        return ctx.json({tours}, 200);
    }catch (error){
        logger.error('Error while fetching tours', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles fetching a tour by id.
 *
 * @param ctx - The Hono context object.
 * @returns A response with the tour or an error message.
 */
tours.get('/:id', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const { id } = ctx.req.param();
        const tour = await getTourById(em, parseInt(id));

        if (!tour){
            return ctx.json({message: 'Tour not found'}, 404)
        }

        return ctx.json({tour}, 200)
    }catch (error){
        logger.error('Error while fetching tour', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles fetching all highlights by tour id.
 *
 * @param ctx - The Hono context object.
 * @returns A response with the highlights or an error message.
 */
tours.get(':id/highlights', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const { id } = ctx.req.param();
        const highlights = await getHighlightsByTour(em, parseInt(id));

        if (!highlights){
            return ctx.json({message: 'No highlights found'}, 404);
        }

        return ctx.json({highlights}, 200)
    }catch (error){
        logger.error('Error while fetching tour highlights', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})
/**
 * Handles fetching all highlights by tour id and returns them as a GeoJSON object.
 *
 * @param ctx - The Hono context object.
 * @returns A response with the GeoJSON object or an error message.
 */
tours.get('/:id/map/highlights', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const { id } = ctx.req.param();
        const geoJSON = await getHighlightsByTour(em, parseInt(id));

        if (!geoJSON) {
            return ctx.json({ message: 'No highlights found' }, 404);
        }

        return ctx.json(geoJSON, 200);
    } catch (error) {
        logger.error('Error while fetching tour highlights', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
});

/**
 * Handles creating a tour.
 *
 * @param ctx - The Hono context object.
 * @param isAdmin - Middleware so only admin users can use.
 * @returns A response with a success or error message.
 */
tours.post('/', isLoggedIn, isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const body = await ctx.req.json();

        const tour = tourSchema.safeParse(body);
        if (!tour.success){
            return ctx.json({message: 'Invalid data'}, 400)
        }

        await createTour(em, tour.data);

        return ctx.json({message: 'Tour created successfully'}, 201)
    }catch (error){
        logger.error('Error while creating tour', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles updating a tour.
 *
 * @param ctx - The Hono context object.
 * @param isAdmin - Middleware so only admins can use.
 * @returns A response with a success or error message.
 */
tours.put('/:id', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const { id } = ctx.req.param();

        const tour = await getTourById(em, parseInt(id));
        if (!tour){
            return ctx.json({message: 'Tour not found'}, 404);
        }

        const body = await ctx.req.json();
        const tourData = tourSchema.safeParse(body);
        if (!tourData.success){
            return ctx.json({message: 'Invalid data'}, 400);
        }

        await updateTour(em, parseInt(id), tourData.data);
        return ctx.json({message: 'Tour updated successfully'}, 200);
    }catch (error){
        logger.error('Error while updating tour', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles deleting a tour.
 *
 * @param ctx - The Hono context object.
 * @param isAdmin - Middleware so only admins can use.
 * @returns A response with a success or error message.
 */
tours.delete('/:id', isLoggedIn, isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const { id } = ctx.req.param();

        await deleteTour(em, parseInt(id));
        return ctx.json({message: 'Tour deleted successfully'}, 200)
    }catch (error){
        logger.error('Error while deleting tour', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

export default tours;