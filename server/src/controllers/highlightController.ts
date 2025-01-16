import { EntityManager } from '@mikro-orm/core';
import { Highlight } from "../models/highlight.js";
import logger from "../utils/logger.js";
import { User } from '../models/user.js';
/*eslint-disable */

/**
 * Fetches all highlights from the database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @returns {Promise<Highlight[] | null>} A promise resolving to a list of highlights if found,
 * otherwise null.
 */
export const getAllHighlights = async (em: EntityManager): Promise<Highlight[] | null> => {
    try {
        const highlights = await em.find(Highlight, {}, { populate: ['users'] });
        if (highlights.length === 0) {
            return null;
        }

        return highlights;
    } catch (error) {
        logger.error('Failed to fetch highlights: ' + error);
        return null;
    }
}

export const getHighlightById = async (em: EntityManager, id: number): Promise<Highlight | null> => {
    try {
        const highlight = await em.findOne(Highlight, { id }, { populate: ['users'] });
        if (!highlight) {
            return null;
        }

        return highlight;
    } catch (error) {
        logger.error('Failed to fetch highlight with id: ' + id + ' error: ' + error);
        return null;
    }
}




/**
 * Creates a new highlight and stores it in the database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param data -  - The highlight data excluding the `id` field.
 * @returns {Promise<void>}
 */

export const createHighlight = async (em: EntityManager, data: Omit<Highlight, 'id'>, userEmail: string): Promise<void> => {
    try {
        // First find the user
        const user = await em.findOne(User, { email: userEmail });
        if (!user) {
            throw new Error('User not found');
        }

        const {
            name,
            description,
            category,
            businessDescription,
            latitude,
            longitude,
            is_approved
        } = data;

        const newHighlight = em.create(Highlight, {
            name,
            description,
            category,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            is_approved: is_approved ?? false,
            businessDescription: businessDescription ?? 'none',
            tours: []
        });

        // Important: Add the user to the highlight's users collection
        newHighlight.users.add(user);

        await em.persistAndFlush(newHighlight);
    } catch (error) {
        logger.error('Failed to create highlight: ' + error);
        throw error; // Rethrow the error after logging it
    }
}

/**
 * Updates is_approved field in specific highlight.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param id - The id of the highlight to be approved.
 * @returns {Promise<void>}
 */
export const approveHighlightSuggestion = async (em: EntityManager, id: number): Promise<void> => {
    try {
        await em.nativeUpdate(Highlight, {id: id}, {is_approved: true});
        await em.flush();
    } catch (error){
        logger.error('Failed to approve highlight with id: ' + id + ' error: ' + error);
    }
}

/**
 * Updates existing highlight's data.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param id - The id of the highlight to be found.
 * @param updatedData - The changed data of the updated attributes.
 * @returns {Promise<void>}
 */
export const updateHighlight =
    async (em: EntityManager, id: number, updatedData: Partial<Highlight>): Promise<void> =>{
    const highlight = await em.findOne(Highlight, {id: id});
    if(!highlight){
        throw new Error('Highlight with id ${id} not found');
    }
    try {
        await em.assign(highlight, updatedData)
        await em.persistAndFlush(highlight);
    }catch (error){
        logger.error('Failed to update highlight with id: ' + id + ' error: ' + error)
    }
}

/**
 * Deletes existing highlight form database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param id - The id of the highlight to be deleted.
 * @returns {Promise<void>}
 */
export const deleteHighlight = async (em: EntityManager, id: number): Promise<void> => {
    try {
        await em.nativeDelete(Highlight, {id: id});
        em.flush();
    }catch (error){
        logger.error('Failed to delete highlight with id: ' + id + ' error: ' + error);
    }
}
/**
 * Fetches highlights associated with a specific user.
 *
 * @param em - The MikroORM EntityManager instance.
 * highlights are to be fetched.
 * @returns {Promise<Highlight[] | null>} A promise resolving
 * to a list of highlights if found,
 * otherwise null.
 */


export const getHighlightsByUserToken = async (em: EntityManager, userEmail: string): Promise<Highlight[] | null> => {
    try {
        // First find the user
        const user = await em.findOne(User, { email: userEmail }, { populate: ['highlights'] });
        if (!user) {
            return null;
        }

        // Get highlights through the user's highlights collection
        const highlights = user.highlights.getItems();
        if (highlights.length === 0) {
            return null;
        }

        // Format the response
        return highlights.map(highlight => ({
            id: highlight.id,
            name: highlight.name,
            description: highlight.description,
            category: highlight.category,
            latitude: highlight.latitude,
            longitude: highlight.longitude,
            is_approved: highlight.is_approved,
            businessDescription: highlight.businessDescription,
            suggestedBy: {
                username: user.username,
                email: user.email
            }
        }));
    } catch (error) {
        logger.error('Failed to fetch highlights for user with email: ' + userEmail + ' error: ' + error);
        return null;
    }
}