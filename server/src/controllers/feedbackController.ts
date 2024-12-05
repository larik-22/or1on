import type {Feedback} from "../models/feedback.js";
import type { Highlight } from "../models/highlight.js";
import {EntityManager} from "@mikro-orm/core";
import logger from "../utils/logger.js";

/**
 * Fetches all feedback posted by a specific user.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param userId - The id of the user whose feedback is to be found.
 * @returns {Promise<Feedback[] | null>} A promise resolving to a list of feedbacks if found, otherwise null.
 */
export const getFeedbackByUserId = async (em: EntityManager, userId: string): Promise<Feedback[] | null> => {
    try {
        return await em.find(Feedback, {user: {id: userId}});
    } catch (error){
        logger.error('Failed to fetch feedback where user id: ' + userId + ' error: ' + error)
    }
};

/**
 * Fetches a list of feedbacks from a highlight
 *
 * @param em - The MikroORM EntityManager instance.
 * @param id - The id of the highlight.
 * @returns {Promise<Feedback[]>} A promise resolving to a list of feedbacks if found, otherwise null.
 */
export const getFeedbackByHighlight = async (em: EntityManager, id: string): Promise<Feedback[]> => {
    try {
        return await em.find(Feedback, {Highlight: {id: id}});
    } catch (error) {
        logger.error('Failed to fetch feedback from highlight with id: ' + id + ' error: ' + error);
    }
};

/**
 * Updates the is_approved field in a specific feedback.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param id - The id of the feedback to be updated.
 * @returns {Promise<void>}
 */
export const approveFeedback = async (em: EntityManager, id: string): Promise<void> => {
    try {
        await em.nativeUpdate(Feedback, { id: id }, { is_approved: true});
        await em.flush();
        logger.info('Feedback updated successfully!');
    } catch (error) {
        logger.error('Failed to find or update feedback with id: ' + id + ' error: ' + error);
    }
};

/**
 * Deletes an existing user from the database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param id - The id of the feedback to be deleted.
 * @returns {Promise<void>}
 */
export const deleteFeedback = async (em: EntityManager, id: string): Promise<void> => {
    try {
        await em.nativeDelete(Feedback, {id: id});
        await em.flush();
        logger.info('Feedback deleted successfully!')
    } catch (error) {
        logger.error('Failed to find or delete feedback with id: ' + id + ' error: ' + error)
    }
};