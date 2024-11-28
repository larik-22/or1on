import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import auth from './routes/auth.js';
import test from './routes/test.js';
import logger from './utils/logger.js';

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

export const app = new Hono();

/**
 * Registers the routes for authentication and testing.
 */
app.route('/auth', auth);
app.route('/test', test);

/**
 * Handles the root GET request.
 *
 * @param c - The Hono context object.
 * @returns A text response with a welcome message.
 */
app.get('/', (c) => {
    logger.info('Received GET request on /');
    return c.text('Hello Hono!');
});

/**
 * Listens for uncaught exceptions and logs them before exiting.
 */
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err.message}`, { stack: err.stack });
    process.exit(1);
});

/**
 * Listens for unhandled promise rejections and logs them.
 */
process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled promise rejection: ${reason}`);
});

try {
    serve({
        fetch: app.fetch,
        port: Number(port),
    });
    logger.info(`Server is running at http://${host}:${port}`);
} catch (err) {
    logger.error(
        `Failed to start server: ${(err as Error).message}`,
        { stack: (err as Error).stack }
    );
}
