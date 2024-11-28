import { jwt } from 'hono/jwt';
import type { MiddlewareHandler } from 'hono';
import { createErrorResponse } from '../errors/error.js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    logger.error('JWT_SECRET is not defined in environment variables.');
    throw new Error('JWT_SECRET is not defined in environment variables.');
}

/**
 * Middleware to verify if a user is authenticated using JWT.
 *
 * @param ctx - The Hono context object.
 * @param next - The next middleware function in the stack.
 * @returns {Promise<void>} A promise that resolves after middleware execution.
 */
export const isLoggedIn: MiddlewareHandler = async (ctx, next) => {
    try {
        logger.info('Authenticating request');
        await jwt({ secret: JWT_SECRET, alg: 'HS256' })(ctx, next);
        logger.info('Authentication successful', { email: ctx.get('jwtPayload')?.email });
    } catch (err) {
        logger.warn('Unauthorized access attempt', { error: err });
        return ctx.json(createErrorResponse(401, 'Unauthorized'), 401);
    }
};
