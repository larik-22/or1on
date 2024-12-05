import { EntityManager } from '@mikro-orm/core';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger.js';
import {randomUUID} from "crypto";

/**
 * Fetches a user by their email from the database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param email - The email of the user to find.
 * @returns {Promise<User | null>} A promise resolving to the user object if found, otherwise null.
 */
export const getUserByEmail = async (em: EntityManager, email: string): Promise<User | null> => {
    try {
        return await em.findOne(User, { email });
    } catch (error) {
        logger.error('Failed to fetch user by email:' + email + ' error: ' + error);
        throw error;
    }
};

/**
 * Fetches a user by their username from the database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param username - The username of the user to find.
 * @returns {Promise<User | null>} A promise resolving to the user object if found, otherwise null.
 */
export const getUserByUsername = async (
    em: EntityManager,
    username: string
): Promise<User | null> => {
    try {
        return await em.findOne(User, { username });
    } catch (error) {
        logger.error('Failed to fetch user by email:' + username + ' error: ' + error);
        throw error;
    }
};

/**
 * Creates a new user and stores them in the database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param data - The user data excluding the `id` field.
 * @returns {Promise<Omit<User, 'password' | null>>} Promise resolving to the created user object.
 */
export const createUser = async (
    em: EntityManager,
    data: Omit<User, 'id'>
): Promise<Omit<User, 'password'>> => {
    try {
    const { email, password, isAdmin, username } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = em.create(User, {
            id: randomUUID(),
            email: email,
            password: hashedPassword,
            isAdmin: isAdmin,
            username: username
        });

    await em.persistAndFlush(newUser);

    return {
        id: newUser.id,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        username: newUser.username
    };
    } catch (error) {
        logger.error('Failed to create user: ' + error);
        throw error;
    }
};

/**
 * Updates a user's email in the database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param oldUsername - The ID of the user to update.
 * @param newUsername - The new email to set.
 * @returns {Promise<{ success: boolean; message: string }>} Result of the operation.
 */
export const updateUsername = async (
    em: EntityManager,
    oldUsername: string,
    newUsername: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const user = await em.findOne(User, { username:oldUsername });
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        const emailExists = await em.count(User, { username: newUsername });
        if (emailExists > 0) {
            return { success: false, message: 'Username is already in use' };
        }

        user.username = newUsername;
        await em.persistAndFlush(user);

        logger.info(`User ${oldUsername} username updated to ${newUsername}`);
        return { success: true, message: 'Username updated successfully' };
    } catch (error) {
        logger.error(`Failed to update username for user ${oldUsername}: ${error}`);
        throw error;
    }
};

/**
 * Updates a user's password in the database.
 *
 * @param em - The MikroORM EntityManager instance.
 * @param userId - The ID of the user to update.
 * @param oldPassword - The current password for verification.
 * @param newPassword - The new password to set.
 * @returns {Promise<{ success: boolean; message: string }>} Result of the operation.
 */
export const updateUserPassword = async (
    em: EntityManager,
    userId: string,
    oldPassword: string,
    newPassword: string

): Promise<{ success: boolean; message: string }> => {
    try {
        const user = await em.findOne(User, { id: userId });
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return { success: false, message: 'Incorrect current password' };
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await em.flush();

        logger.info(`User ${userId} password updated successfully`);
        return { success: true, message: 'Password updated successfully' };
    } catch (error) {
        logger.error(`Failed to update password for user ${userId}: ${error}`);
        throw error;
    }
};
