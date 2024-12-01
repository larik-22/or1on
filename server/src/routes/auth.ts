import { Hono } from 'hono';
import { createUser, getUserByEmail } from '../controllers/userController.js';
import { createErrorResponse } from '../errors/error.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import {EntityManager} from "@mikro-orm/core";

dotenv.config();

const auth = new Hono();

const registrationSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    isAdmin: z.boolean().optional().default(false),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

auth.post('/', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const body = await ctx.req.json();
        logger.info('Registration request received', { body });

        const result = registrationSchema.safeParse(body);
        if (!result.success) {
            logger.warn('Invalid registration data', { errors: result.error.errors });
            return ctx.json(createErrorResponse(400, 'Invalid registration data'), 400);
        }

        const { email, isAdmin } = result.data;
        const existingUser = await getUserByEmail(em, email);
        if (existingUser) {
            logger.warn(`Registration failed: User with email ${email} already exists`);
            return ctx.json(createErrorResponse(409, 'User already exists'), 409);
        }

        const newUser = await createUser(em, { ...result.data, isAdmin });
        logger.info('User registered successfully', { userId: newUser.id, email: newUser.email });
        return ctx.json({ message: 'User registered successfully', user: newUser }, 201);
    } catch (err) {
        logger.error('Error during user registration', { error: err });
        return ctx.json(createErrorResponse(500, 'Internal server error'), 500);
    }
});

/**
 * Handles user login and token generation.
 *
 * @param ctx - The Hono context object.
 * @returns A response with a success message and JWT token, or an error message.
 */
auth.post('/tokens', async (ctx) => {
    try {
        const em = ctx.get('em' as 'jwtPayload') as EntityManager;
        const body = await ctx.req.json();
        logger.info('Login request received', { body });

        const result = loginSchema.safeParse(body);
        if (!result.success) {
            logger.warn('Invalid login data', { errors: result.error.errors });
            return ctx.json(createErrorResponse(400, 'Invalid login data'), 400);
        }

        const { email, password } = result.data;
        const user = await getUserByEmail(em, email);

        if (!user) {
            logger.warn(`Login failed: User with email ${email} not found`);
            return ctx.json(createErrorResponse(404, `User with email ${email} not found`), 404);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            logger.warn(`Login failed: Invalid password for user ${email}`);
            return ctx.json(createErrorResponse(401, 'Invalid password'), 401);
        }

        const token = await generateToken(user);
        logger.info('Login successful', { userId: user.id, email: user.email });
        return ctx.json({ message: 'Login successful', token });
    } catch (err) {
        logger.error('Error during login', { error: err });
        return ctx.json(createErrorResponse(500, 'Internal server error'), 500);
    }
});

export default auth;
