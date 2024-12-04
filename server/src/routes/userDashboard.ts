import { Hono } from 'hono';
import { isLoggedIn } from '../middleware/isLoggedIn.js';
import {  updateUsername, updateUserPassword } from '../controllers/userController.js';
import {EntityManager} from "@mikro-orm/core";
import logger from "../utils/logger.js";

const userDashboard = new Hono();

/**
 * Route to update the user's email.
 * Requires the user to be logged in.
 * Expects a JSON body with `userId` and `newEmail`.
 * Responds with the result of the email update operation.
 */
userDashboard.post('/update-username', isLoggedIn, async (c) => {
    const em = c.get('em' as 'jwtPayload') as EntityManager;
    const { oldUsername, newUsername } = await c.req.json();
    logger.info('Update user request received', { oldUsername, newUsername });
    if (!oldUsername || !newUsername) {
        return c.json({ success: false, message: 'Missing required fields' }, 400);
    }

    const result = await updateUsername(em,oldUsername, newUsername);
    return c.json(result, result.success ? 200 : 400);
});

/**
 * Route to update the user's password.
 * Requires the user to be logged in.
 * Expects a JSON body with `userId`, `oldPassword`, and `newPassword`.
 * Responds with the result of the password update operation.
 */
userDashboard.post('/update-password', isLoggedIn, async (c) => {
    const em = c.get('em' as 'jwtPayload') as EntityManager;
    const { userId, oldPassword, newPassword } = await c.req.json();

    if (!userId || !oldPassword || !newPassword) {
        return c.json({ success: false, message: 'Missing required fields' }, 400);
    }

    const result = await updateUserPassword(
        em,
        userId,
        oldPassword,
        newPassword);
    return c.json(result, result.success ? 200 : 400);
});

export default userDashboard;
