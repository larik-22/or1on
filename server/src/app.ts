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
    const api = new Hono();
    api.use('*', async (ctx, next) => {
        ctx.set('em' as 'jwtPayload', em);
        await next();
    });

    api.use('*', cors({
        origin: '*',
        allowHeaders: ['Origin', 'Content-Type', 'Authorization'],
        allowMethods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }));

    api.route('/auth', auth);
    api.route('/test', test);
    api.route('/map', map);
    api.route('/tours', tours);
    api.route('/users', users);
    api.route('/feedbacks', feedbacks);
    api.route('/highlights', highlights);
    api.route('/userDashboard', userDashboard);

    app.route('/api', api);

    app.get('/', (c) => {
        logger.info('Received GET request on /');
        return c.text('Hello Hono!');
    });

    return app;
};
