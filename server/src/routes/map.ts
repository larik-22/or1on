import { Hono } from 'hono';
import logger from '../utils/logger.js';
import { createErrorResponse } from '../errors/error.js';
import { createHighlightsGeoJSON } from '../controllers/highlightsController.js';
import {EntityManager} from "@mikro-orm/core";


const map = new Hono();


/**
 * Route for fetching highlights as GeoJSON.
 *
 * @param ctx - The Hono context object, which contains the request and response information.
 * @returns A GeoJSON response with highlights data.
 */
map.get('/highlights', async (ctx) => {
    try {
        logger.info('Fetching highlights for /map/highlights');
        const em = (ctx.get('em' as 'jwtPayload') as EntityManager).fork();

        const geoJSON = await createHighlightsGeoJSON(em);
        return ctx.json(geoJSON);
    } catch (err) {
        logger.error('Error fetching highlights', { error: err });
        return ctx.json(createErrorResponse(500, 'Failed to fetch highlights'), 500);
    }
});

export default map;
