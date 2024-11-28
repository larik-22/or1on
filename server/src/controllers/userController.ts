import type { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const users: User[] = [];

// test admin and regular user
users.push({
    id: randomUUID(),
    email: 'test@user.com',
    password: bcrypt.hashSync('password', 10),
    isAdmin: false,
});

users.push({
    id: randomUUID(),
    email: 'test@admin.com',
    password: bcrypt.hashSync('password', 10),
    isAdmin: true,
});


/**
 * Fetches a user by their email.
 *
 * @param email - The email of the user to find.
 * @returns A promise resolving to the user object if found, otherwise `undefined`.
 */
export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    return users.find((user) => user.email === email);
};

/**
 * Creates a new user and stores them in the system.
 *
 * @param data - The user data excluding the `id` field.
 * @returns A promise resolving to the created user object excluding the `password` field.
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

    const { password: _, ...userData } = newUser;
    return userData;
};
