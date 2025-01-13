import {Hono} from "hono";
import { createErrorResponse } from "../errors/error.js";
import dotenv from "dotenv";
import {EntityManager} from "@mikro-orm/core";
import {getAllUsers,
    getUserById,
    deleteUser,
    makeUserVerified,
    getUserByEmail} from "../controllers/userController.js";
import { isAdmin } from "../middleware/isAdmin.js";
import logger from "../utils/logger.js";
import {isLoggedIn} from "../middleware/isLoggedIn.js";
import {deleteFeedback, getFeedbackByUserId} from "../controllers/feedbackController.js";
import {validate} from "uuid";
import type {User} from "../models/user.js";

dotenv.config();

const users = new Hono();

/**
 * Handles fetching all users.
 *
 * @param isAdmin - Middleware so only admins can use.
 * @param ctx - The Hono context object.
 * @returns A response the list of users or an error message
 */
users.get('/', isLoggedIn, isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const users = await getAllUsers(em);

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
users.get('/:id', isLoggedIn, isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
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
 * Fetches all feedback by highlight id.
 *
 * @param ctx - The Hono context object.
 * @returns A response the list of feedbacks or an error message.
 */
users.get('/:id/feedbacks', isLoggedIn, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const userPayload = ctx.get('jwtPayload') as User;
        const {id} = ctx.req.param();

        if (!validate(id)){
            return ctx.json(createErrorResponse(400, 'Invalid userId parameter'), 400)
        }
        const user = await getUserByEmail(em, userPayload.email)

        if (user === null){
            return ctx.json(createErrorResponse(404, 'User not found'), 404);
        }

        if (!user.isAdmin && user.email !== userPayload.email){
            return ctx.json(createErrorResponse(401, 'Unauthorized'), 401);
        }

        const feedback = await getFeedbackByUserId(em, id);

        if(feedback?.length === 0){
            return ctx.json({message: 'No feedback found'}, 404);
        }

        return ctx.json(feedback, 200);
    }catch (error){
        logger.error('Error while fetching feedbacks', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
})

/**
 * Handles deleting a user.
 *
 * @param ctx - The Hono context object.
 * @returns A response with a success or error message.
 */
users.delete('/:id', isLoggedIn, isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const { id } = ctx.req.param();

        const user = await getUserById(em, id);

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

/**
 * Handles deleting a feedback.
 *
 * @param ctx - The Hono context object.
 * @param isAdmin - Middleware so only admins can use.
 * @returns A response with a success or error message.
 */
users.delete('/:id/feedbacks/:feedbackId', isLoggedIn, isAdmin, async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;

        const {id, feedbackId} = ctx.req.param();

        const feedbackParams = parseInt(feedbackId)

        if (!feedbackParams){
            return ctx.json(createErrorResponse(400, 'Invalid feedbackId parameter'), 400)
        }

        if (!validate(id)){
            return ctx.json(createErrorResponse(400, 'Invalid userId parameter'), 400)
        }

        const user = await getUserById(em, id);
        if (!user){
            return ctx.json(createErrorResponse(404, 'User not found'), 404)
        }

        await deleteFeedback(em, feedbackParams);

        return ctx.json({message: 'Feedback deleted successfully'}, 200);
    }catch (error){
        logger.error('Error while deleting feedback', { error: error });
        return ctx.json(createErrorResponse(500, 'Internal error'), 500);
    }
});

/**
 * make a user trusted
 */
users.put('/:email/trust', isLoggedIn, isAdmin, async (ctx) => {
        try {
            const em = ctx.get('em' as 'jwtPayload') as EntityManager;
            const { email } = ctx.req.param();
            const user = await getUserByEmail(em, email);
            if(!user)
                return ctx.json({message: 'User does not exist'}, 400);
            if(user.verified)
                return ctx.json({message: 'User is already trusted'}, 400);
            await makeUserVerified(em, email);
            return ctx.json({message: 'User is now trusted'}, 200);
        }catch (error){
            logger.error('Error while making user trusted', { error: error });
            return ctx.json(createErrorResponse(500, 'Internal error'), 500);
        }


    }
);


export default users;