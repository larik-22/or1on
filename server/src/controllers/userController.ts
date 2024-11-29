import { EntityManager } from '@mikro-orm/core';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger.js';
import { randomUUID } from 'crypto';

let users: User[] = [];

export const getAllUsers = () => {
    return users;
}

export const getUserById = (id: string) => {
    return users.find(user => user.id === id)
}

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

export const getFeedbackByUserId = (id: string) => {
    return users.find(user => user.id === id)?.feedback;
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
    const { email, password, isAdmin } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = em.create(User, {
            id: randomUUID(),
            email: email,
            password: hashedPassword,
            isAdmin: isAdmin,
            username: ''
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

export const deleteUser = (id: string) => {
    const deletedUser = users.find(user => user.id === id);
    users = users.filter(user => user.id !== deletedUser?.id);
}

export const deleteFeedbackFromUserBy = (userId: string, feedbackId) => {
    let user = users.find(user => user.id === userId);
    user?.feedback.filter();
}