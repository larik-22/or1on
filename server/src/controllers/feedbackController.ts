import {Feedback} from "../models/feedback.js";
import {EntityManager} from "@mikro-orm/core";
import logger from "../utils/logger.js";
import {User} from "../models/user.js";
import {getHighlightById} from "./highlightController.js";

/**
 * Fetches all feedback posted by a specific user.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param userId - The id of the user whose feedback is to be found.
 * @returns {Promise<Feedback[] | null>} A promise resolving to a list of feedbacks if found,
 * otherwise null.
 */
export const getFeedbackByUserId = async (em: EntityManager, userId: string):
    Promise<Feedback[]> => {
    try {
        return await em.find(Feedback, {user: {id: userId}});
    } catch (error) {
        logger.error(`Failed to fetch feedback for user ID: ${userId}. Error: ${error}`);
        throw new Error('Error fetching feedbacks for user.');
    }
};

/**
 * Fetches all feedback that need to be approved
 *
 * @param em - The MikroORM EntityManager instance.
 * @returns {Promise<Feedback[] | null>} A promise resolving list of feedbacks for approval if found
 * */
export const getFeedbacksForApproval = async (em: EntityManager):
    Promise<Feedback[] | null> => {
    try {
        return await em.find(
            Feedback, {is_approved: false}
        )
    } catch (error) {
        logger.error('Failed to fetch feedback feedbacks for approval' + error);
        return null;
    }
};

/**
 * Fetches a list of feedbacks from a highlight
 *
 * @param em - The MikroORM EntityManager instance.
 * @param id - The id of the highlight.
 * @returns {Promise<Feedback[]>} A promise resolving to a list of feedbacks if found,
 * otherwise null.
 */
export const getFeedbackByHighlight = async (em: EntityManager, id: number):
    Promise<Feedback[] | null> => {
    try {
        const feedbacks = await em.find(
            Feedback, {highlight: {id: id}}, {populate: ['user', 'highlight']}
        );
        if (feedbacks.length === 0) {
            return null
        }
        return feedbacks
    } catch (error) {
        logger.error('Failed to fetch feedback from highlight with id: ' + id + ' error: ' + error);
        return null;
    }
};

/**
 * Updates the is_approved field in a specific feedback.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param id - The id of the feedback to be updated.
 * @returns {Promise<void>}
 */
export const approveFeedback = async (em: EntityManager, id: number): Promise<void> => {
    try {
        await em.nativeUpdate(Feedback, {id: id}, {is_approved: true});
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
export const deleteFeedback = async (em: EntityManager, id: number): Promise<void> => {
    try {
        await em.nativeDelete(Feedback, {id: id});
        await em.flush();
        logger.info('Feedback deleted successfully!')
    } catch (error) {
        logger.error('Failed to find or delete feedback with id: ' + id + ' error: ' + error)
    }
};
/**
 * Creates a new feedback entry for a specific highlight.
 *
 * @async
 * @function createFeedback
 * @param {EntityManager} em - The EntityManager instance used for database operations.
 * @param {number} highlightId - The ID of the highlight for which feedback is being created.
 * @param {User} user - The user creating the feedback.
 * @param {number} rating - The rating provided by the user.
 * @param {string} comment - The comment provided by the user.
 * @returns {Promise<void>} A promise that resolves when the feedback is successfully created.
 */
export const createFeedback = async (
    em: EntityManager,
    highlightId: number,
    user: User,
    rating: number,
    comment: string
): Promise<void> => {
    try {
        const highlight = await getHighlightById(em, highlightId)

        if (!highlight) {
            throw new Error('Highlight not found');
        }

        const feedback = em.create(Feedback, {
            highlight,
            user,
            rating: rating,
            comment: comment,
            is_approved: user.verified
        });
        await em.persistAndFlush(feedback);
        logger.info('Feedback created successfully!');
    } catch (error) {
        logger.error(
            'Failed to create feedback for highlight id: ' + highlightId + ' error: ' + error
        );
    }
};
