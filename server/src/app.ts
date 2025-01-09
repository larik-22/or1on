import { Hono } from 'hono';
import auth from './routes/auth.js';
import test from './routes/test.js';
import map from './routes/map.js';
import { cors } from 'hono/cors';
import logger from './utils/logger.js';
import type {EntityManager } from '@mikro-orm/core';
import tours from "./routes/tours.js";
import feedbacks from "./routes/feedbacks.js";
import users from "./routes/users.js";
import highlights from "./routes/highlights.js";
import userDashboard from "./routes/userDashboard.js";

/**
 * Creates and configures a Hono application with the provided EntityManager.
 *
 * @param {EntityManager} em - An instance of EntityManager to manage database operations.
 * @returns {Hono} A configured Hono application.
 */
export const createApp = (em: EntityManager): Hono => {
    const app = new Hono();
    app.use('*', async (ctx, next) => {
        ctx.set('em' as 'jwtPayload', em);
        await next();
    });

    app.use('*', cors({
        origin: 'http://localhost:4173',
        allowHeaders: ['Origin', 'Content-Type', 'Authorization'],
        allowMethods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }));

    app.route('/auth', auth);
    app.route('/test', test);
    app.route('/map', map);
    app.route('/tours', tours);
    app.route('/users', users);
    app.route('/feedbacks', feedbacks);
    app.route('/highlights', highlights);
    app.route('/userDashboard', userDashboard);

    app.get('/', (c) => {
        logger.info('Received GET request on /');
        return c.text('Hello Hono!');
    });

    return app;
};
