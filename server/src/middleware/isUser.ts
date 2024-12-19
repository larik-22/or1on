import type { MiddlewareHandler } from 'hono';
import type { User } from '../models/user.js';
import logger from '../utils/logger.js';
import { createErrorResponse } from '../errors/error.js';

/**
 * Middleware to check if a user is a regular user (not an admin).
 *
 * @param ctx - The Hono context object.
 * @param next - The next middleware function in the stack.
 * @returns {Promise<void>} A promise that resolves after middleware execution.
 */
export const isUser: MiddlewareHandler = async (ctx, next) => {
    const payload = ctx.get('jwtPayload') as User;

    if (payload?.isAdmin) {
        logger.warn(
            'Access denied: Admin user attempted to access user-only route',
            { email: payload?.email }
        );
        return ctx.json(createErrorResponse(403, 'Forbidden: Users only'), 403);
    }

    logger.info('User access granted', { email: payload.email });
    await next();
};
