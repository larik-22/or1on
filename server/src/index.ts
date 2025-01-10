import { serve } from '@hono/node-server';
import logger from './utils/logger.js';
import { getDBConnector, updateDBSchema } from './utils/db.js';
import { createApp } from './app.js';

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

/**
 * Main entry point for the application.
 *
 * Initializes the database, updates the schema, and starts the HTTP server.
 */
(async () => {
    try {
        /**
         * Initialize the database connector.
         */
        const dbConnector = await getDBConnector();

        /**
         * Create a scoped EntityManager for the application.
         */
        const em = dbConnector.em.fork();

        /**
         * Update the database schema to match the application models.
         */
        await updateDBSchema(dbConnector);

        /**
         * Create and configure the Hono app instance.
         */
        const app = createApp(em);

        /**
         * Start the HTTP server using the Hono app.
         */
        serve({
            fetch: app.fetch,
            port: Number(port),
        });

        logger.info(`Server is running at http://${host}:${port}`);
    } catch (err) {
        logger.error(
            `Failed to start server: ${err as Error}: ${(err as Error).message}`,
            { stack: (err as Error).stack }
        );
    }
})();

/**
 * Handles uncaught exceptions to log the error and exit the process.
 */
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err.message}`, { stack: err.stack });
    process.exit(1);
});

/**
 * Handles unhandled promise rejections to log the error.
 */
process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled promise rejection: ${reason}`);
});
