import { Highlight } from '../models/highlight.js';
import {EntityManager} from "@mikro-orm/core";



/**
 * Creates a GeoJSON object for all approved highlights.
 *
 * @param em - EntityManager instance for database interaction.
 * @returns {Promise<object>} - GeoJSON object containing approved highlights.
 */
export const createHighlightsGeoJSON = async (em: EntityManager):Promise<object> => {
    const highlights = await em.find(Highlight, {is_approved: true});

    return {
        type: 'FeatureCollection',
        features: highlights.map((highlight) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [highlight.longitude, highlight.latitude],
            },
            properties: {
                id: highlight.id,
                name: highlight.name,
                description: highlight.description,
                category: highlight.category,
                businessDescription: highlight.businessDescription,
            },
        })),
    };
} ;
