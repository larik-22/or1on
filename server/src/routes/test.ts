import { Hono } from 'hono';
import { isLoggedIn } from '../middleware/isLoggedIn.js';
import { isAdmin } from '../middleware/isAdmin.js';
import logger from '../utils/logger.js';
import { createErrorResponse } from '../errors/error.js';

const test = new Hono();

/**
 * Protected route accessible to logged-in users.
 *
 * @param ctx - The Hono context object, which contains the request and response information.
 * @returns A JSON response with a greeting message for the authenticated user.
 */
test.get('/protected', isLoggedIn, (ctx) => {
    try {
        const user = ctx.get('jwtPayload');
        logger.info('Accessed protected route', { email: user.email });
        return ctx.json({ message: `Hello, ${user.email}! This is a protected route.` });
    } catch (err) {
        logger.error('Error accessing protected route', { error: err });
        return ctx.json(createErrorResponse(500, 'Failed to access protected route'), 500);
    }
});

/**
 * Admin-protected route accessible only to admin users.
 *
 * @param ctx - The Hono context object, which contains the request and response information.
 * @returns A JSON response confirming access to the admin-protected route.
 */
test.get('/adminprotected', isLoggedIn, isAdmin, (ctx) => {
    try {
        const user = ctx.get('jwtPayload');
        logger.info('Accessed admin-protected route', { email: user.email });
        return ctx.json({ message: 'This is an admin-protected route' });
    } catch (err) {
        logger.error('Error accessing admin-protected route', { error: err });
        return ctx.json(createErrorResponse(500, 'Failed to access admin-protected route'), 500);
    }
});

export default test;
