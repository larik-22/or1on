import type { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const users: User[] = [];

/**
 * Fetches a user by their email.
 *
 * @param email - The email of the user to find.
 * @returns {Promise<User | undefined>} A promise resolving to the user object if found.
 */
export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    return users.find((user) => user.email === email);
};

/**
 * Creates a new user and stores them in the system.
 *
 * @param data - The user data excluding the `id` field.
 * @returns {Promise<Omit<User, 'password'>>} Promise resolving to the created user object.
 */
export const createUser = async (data: Omit<User, 'id'>): Promise<Omit<User, 'password'>> => {
    const { email, password, isAdmin } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
        id: randomUUID(),
        email,
        password: hashedPassword,
        isAdmin,
    };

    users.push(newUser);

    return { id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin };
};
