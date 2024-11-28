import type { MiddlewareHandler } from 'hono';
import type { User } from '../models/user.js';
import logger from '../utils/logger.js';
import { createErrorResponse } from '../errors/error.js';

/**
 * Middleware to check if a user is an admin.
 *
 * @param ctx - The Hono context object.
 * @param next - The next middleware function in the stack.
 * @returns A promise that resolves after middleware execution.
 */
export const isAdmin: MiddlewareHandler = async (ctx, next) => {
    const payload = ctx.get('jwtPayload') as User;

    if (!payload?.isAdmin) {
        logger.warn('Access denied: Non-admin user attempted to access admin route', { email: payload?.email });
        return ctx.json(createErrorResponse(403, 'Forbidden: Admins only'), 403);
    }

    logger.info('Admin access granted', { email: payload.email });
    await next();
};
