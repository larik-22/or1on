import { Hono } from 'hono';
import { isLoggedIn } from '../middleware/isLoggedIn.js';
import {  updateUsername, updateUserPassword } from '../controllers/userController.js';
import {EntityManager} from "@mikro-orm/core";
import logger from "../utils/logger.js";
import type {User} from "../models/user.js";
import bcrypt from "bcryptjs";


const userDashboard = new Hono();

/**
 * Route to update the user's email.
 * Requires the user to be logged in.
 * Expects a JSON body with `userId` and `newEmail`.
 * Responds with the result of the email update operation.
 */
userDashboard.post('/update-username', isLoggedIn, async (c) => {
    const em = c.get('em' as 'jwtPayload') as EntityManager;
    const payload = c.get('jwtPayload') as User;
    const { oldUsername, newUsername } = await c.req.json();
    logger.info('Update user request received', { oldUsername, newUsername });
    if (!oldUsername || !newUsername) {
        return c.json({ success: false, message: 'Missing required fields' }, 400);
    }
    if(payload.username !== oldUsername){
        return c.json({ success: false, message: 'Old username does not match' }, 400);
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
    const payload = await c.get('jwtPayload') as User;
    const { oldPassword, newPassword } = await c.req.json();

    if (!oldPassword || !newPassword) {
        return c.json({ success: false, message: 'Missing required fields' }, 400);
    }
    const userId = payload.id;
    if(oldPassword === newPassword){
        return c.json({ success: false,
            message: 'New password cannot be the same as the old password' }
            ,400)
    }
    bcrypt.compare(oldPassword, payload.password, (err, res) => {
        if(!res){
            return c.json({ success: false, message: 'Old password is incorrect' }, 400);
        }
    });
    if(newPassword.length < 5){
        return c.json({ success: false, message: 'Password must be at least 6 characters' }, 400);
    }


    const result = await updateUserPassword(
        em,
        userId,
        oldPassword,
        newPassword
    );
    return c.json(result, result.success ? 200 : 400);
});

export default userDashboard;
