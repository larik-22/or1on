import {Hono} from "hono";
import { createErrorResponse } from "../errors/error.js";
import { z } from 'zod';
import dotenv from "dotenv";
import {EntityManager} from "@mikro-orm/core";
import {getAllUsers, getUserById, createUser, deleteUser} from "../controllers/userController.js";
import { isAdmin } from "../middleware/isAdmin.js";

dotenv.config();

const users = new Hono();

const userSchema = z.object({
    email: z.string(),
    password: z.string().min(6),
    is_admin: z.boolean().optional().default(false)
})

/**
 * Handles fetching all users.
 *
 * @param isAdmin - Middleware so only admins can use.
 * @param ctx - The Hono context object.
 * @returns A response the list of users or an error message
 */
users.get('/', isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const users = getAllUsers(em);

        return ctx.json({users}, 200);
    }catch (error){
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles fetching a user by id.
 *
 * @param isAdmin - Middleware so only admins can use.
 * @param ctx - The Hono context object.
 * @returns A response with the user or an error message.
 */
users.get('/:id', isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const { id } = ctx.req.param();
        const user = await getUserById(em, id);

        if (!user){
            return ctx.json({message: 'User not found'}, 404);
        }

        return ctx.json({user}, 200);
    }catch (error){
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles creating a user.
 *
 * @param ctx - The Hono context object.
 * @returns A response with a success or error message.
 */
users.post('/', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const body = await ctx.req.json();

        const user = userSchema.safeParse(body);
        if (!user.success){
            return ctx.json({message: 'Invalid data'}, 400)
        }

        await createUser(em, user.data);

        return ctx.json({message: 'User created successfully'}, 201)
    }catch (error){
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles deleting a user.
 *
 * @param ctx - The Hono context object.
 * @returns A response with a success or error message.
 */
users.delete('/:id', isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtpayload') as EntityManager;
        const { id } = ctx.req.param();

        await deleteUser(em, id);

        return ctx.json({message: 'User deleted successfully'}, 200)
    }catch (error){
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

export default users;