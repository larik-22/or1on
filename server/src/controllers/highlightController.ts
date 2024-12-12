import { EntityManager } from '@mikro-orm/core';
import { Highlight } from "../models/highlight.js";
import logger from "../utils/logger.js";

/**
 * Fetches all highlights from the database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @returns {Promise<Highlight[] | null>} A promise resolving to a list of highlights if found,
 * otherwise null.
 */
export const getAllHighlights = async (em: EntityManager): Promise<Highlight[] | null> => {
    try {
        const highlights = await em.find(Highlight);
        if (highlights.length === 0){
            return null;
        }
        return highlights
    } catch (error){
        logger.error('Failed to fetch highlights: ' + error);
        return null;
    }
}

/**
 * Fetches a highlight by its id from the database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param id - The id of the highlight to be found.
 * @returns {Promise<Highlight | null>} A promise resolving to the highlight object if found,
 * otherwise null.
 */
export const getHighlightById = async (em: EntityManager, id: number):
    Promise<Highlight | null> => {
    try {
        return await em.findOne(Highlight, {id: id});
    } catch (error) {
        logger.error('Failed to fetch user with id: ' + id + ' error: ' + error);
    }
}

/**
 * Creates a new highlight and stores it in the database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param data -  - The highlight data excluding the `id` field.
 * @returns {Promise<void>}
 */
export const createHighlight = async (em: EntityManager, data: Omit<Highlight, 'id'>):
    Promise<void> => {
    try{
        const {name, description, category, latitude, longitude, is_approved} = data;
        const newHighlight = em.create(Highlight, {
            name,
            description,
            category: category ?? null,
            latitude: latitude  ?? null,
            longitude: longitude ?? null,
            is_approved: is_approved ?? false,
            tours: []
        })

        await em.persistAndFlush(newHighlight)
    }catch (error){
        logger.error('Failed to create highlight: ' + error);
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