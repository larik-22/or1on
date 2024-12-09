import {Hono} from "hono";
import { createErrorResponse } from "../errors/error.js";
import dotenv from "dotenv";
import {EntityManager} from "@mikro-orm/core";
import {getAllUsers, getUserById, deleteUser} from "../controllers/userController.js";
import { isAdmin } from "../middleware/isAdmin.js";
import logger from "../utils/logger.js";

dotenv.config();

const users = new Hono();

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
        logger.error('Error while fetching users', { error: error });
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
        logger.error('Error while fetching user', { error: error });
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

        const user = getUserById(em, id);

        if (!user){
            return ctx.json({message: 'User not found'}, 404)
        }

        await deleteUser(em, id);

        return ctx.json({message: 'User deleted successfully'}, 200)
    }catch (error){
        logger.error('Error while deleting user', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

export default users;