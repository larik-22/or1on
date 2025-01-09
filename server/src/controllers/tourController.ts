import { EntityManager } from '@mikro-orm/core';
import { Tour } from "../models/tour.js";
import logger from '../utils/logger.js';
import { Highlight } from '../models/highlight.js';

/**
 * Fetches all tours
 *
 * @param em - The MikroORM EntityManager instance.
 * @returns {Promise<Tour[] | null>} A promise resolving to a list of tours if found, otherwise null
 */
export const getAllTours = async (em: EntityManager): Promise<Tour[] | null> => {
    try {
        const tours = await em.find(Tour, {});
        if (tours.length === 0){
            return null
        }
        return tours;
    } catch (error){
        logger.error('Failed to fetch tours: ' + error)
        return null;
    }
}

/**
 * Fetches a user by their id from the database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param id - The id of the user to find.
 * @returns {Promise<Tour | null>} A promise resolving to the tour object if found, otherwise null.
 */
export const getTourById = async (em: EntityManager, id: number): Promise<Tour | null> => {
    try {
        return await em.findOne(Tour, { id });
    } catch (error) {
        logger.error('Failed to fetch tour with id: ' + id + ' error: ' + error);
    }
}

// eslint-disable-next-line jsdoc/require-returns
/**
 * Fetches all highlights by tour id from the database and returns them as a GeoJSON object.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param tourId - The id of the tour to find highlights for.
 */
// eslint-disable-next-line max-len
export const getHighlightsByTour = async (
    em: EntityManager,
    tourId: number
): Promise<{ geoJSON: object | null, highlights: Highlight[] | null }> => {
    try {
        const tour = await em.findOne(Tour, { id: tourId }, { populate: ['highlights'] });
        if (!tour) {
            return { geoJSON: null, highlights: null };
        }

        const highlights = tour.highlights.getItems();
        if (highlights.length === 0) {
            return { geoJSON: null, highlights: null };
        }

        const geoJSON = {
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
                },
            })),
        };

        return { geoJSON, highlights };
    } catch (error) {
        logger.error('Failed to fetch highlights for tour with id: ' + tourId + ' error: ' + error);
        throw error; // Throw the error instead of returning null values
    }
};

/**
 * Creates a new tour and stores it in the database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param data - The tour data excluding the 'id' field.
 * @returns {Promise<void>}
 */
export const createTour = async (em: EntityManager, data: Omit<Tour, 'id'>): Promise<void> => {
    try {
        const { name, category, description, duration_time, start_hour, highlights } = data;
        const newTour = em.create(Tour, {
            name: name,
            category: category,
            description: description,
            duration_time: duration_time,
            start_hour: start_hour,
            highlights: highlights ?? []
        });

        await em.persistAndFlush(newTour);
    } catch (error){
        logger.error('Failed to create tour: ' + error);
    }
}

/**
 * Updates existing user's data
 *
 * @param em - The MikroORM EntityManager instance.
 * @param id - The id of the tour to be updated.
 * @param updatedData - The changed data of the updated attributes.
 * @returns {Promise<void>}
 */
export const updateTour = async (em: EntityManager, id: number, updatedData: Partial<Tour>):
    Promise<void> =>{
    const tour = await em.findOne(Tour, {id: id});
    if(!tour){
        throw new Error('Tour with id ${id} not found');
    }
    try {
        em.assign(tour, updatedData)
        await em.persistAndFlush(tour);
    }catch (error){
        logger.error('Failed to update tour with id: ' + id + ' error: ' + error)
    }
}

/**
 * Deletes existing tour from the database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param id - The id of the tour to be deleted.
 * @returns {Promise<void>}
 */
export const deleteTour = async (em: EntityManager, id: number): Promise<void> => {
    try {
        await em.nativeDelete(Tour, {id: id});
        await em.flush();
    } catch (error){
        logger.error('Failed to delete tour with id: ' + id + ' error: ' + error);
    }
}
