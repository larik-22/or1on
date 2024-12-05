import {Hono} from "hono";
import { createErrorResponse } from "../errors/error.js";
import { z } from 'zod';
import dotenv from "dotenv";
import { getAllTours, getTourById, getHighlightsByTour, createTour, addUserToTour, updateTour, deleteTour} from "../controllers/tourController.js";
import {EntityManager} from "@mikro-orm/core";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { isAdmin } from "../middleware/isAdmin.js";

dotenv.config();

const tours = new Hono();

const tourSchema = z.object({
    name: z.string(),
    description: z.string(),
    duration_time: z.string(),
    start_hour: z.string()
})

const userSchema = z.object({
    id: z.string()
})

/**
 * Handles fetching all tours.
 *
 * @param ctx - The Hono context object.
 * @returns A response the list of tours or an error message.
 */
tours.get('/', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const tours = getAllTours(em);

        return ctx.json({tours}, 200);
    }catch (error){
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
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const { id } = ctx.req.param();
        const tour = getTourById(em, id);

        if (!tour){
            return ctx.json({message: 'Tour not found'}, 404)
        }

        return ctx.json({tour}, 200)
    }catch (error){
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
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const { id } = ctx.req.param();
        const highlights = getHighlightsByTour(em, id);

        if (!highlights){
            return ctx.json({message: 'No highlights found'}, 404);
        }

        return ctx.json({highlights}, 200)
    }catch (error){
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles creating a tour.
 *
 * @param ctx - The Hono context object.
 * @param isAdmin - Middleware so only admin users can use.
 * @returns A response with a success or error message.
 */
tours.post('/', isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const body = await ctx.req.json();

        const tour = tourSchema.safeParse(body);
        if (!tour.success){
            return ctx.json({message: 'Invalid data'}, 400)
        }

        await createTour(em, tour.data);

        return ctx.json({message: 'Tour created successfully'}, 201)
    }catch (error){
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
tours.put('/:id', isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const { id } = ctx.req.param();
        const body = await ctx.req.json();

        const tour = tourSchema.safeParse(body);
        if (!tour.success){
            return ctx.json({message: 'Invalid date'}, 400);
        }

        await updateTour(em, id, tour.data);
        return ctx.json({message: 'Tour updated successfully'}, 200);
    }catch (error){
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
tours.delete('/:id', isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const { id } = ctx.req.param();

        await deleteTour(em, id);
        return ctx.json({message: 'Tour deleted successfully'}, 200)
    }catch (error){
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

export default tours;