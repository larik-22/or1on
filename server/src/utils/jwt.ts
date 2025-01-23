import { sign } from 'hono/jwt';
import type { User } from '../models/user.js';
import logger from './logger.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    logger.error('JWT_SECRET is not defined in environment variables.');
    throw new Error('JWT_SECRET is not defined in environment variables.');
}

/**
 * Generates a JSON Web Token (JWT) for the specified user.
 * @param user - The user object for which the token is generated.
 *                 The user's password is excluded from the token payload.
 * @returns {Promise<string>} A promise that resolves to the generated JWT as a string.
 * @throws An error if the token generation process fails.
 */
export const generateToken = async (user: User): Promise<string> => {
    const { id, email, isAdmin, verified ,username} = user;
    const payload = { id, email, isAdmin, verified , username};

    try {
        logger.info(`Generating token for user with id: ${payload.id}`);
        return await sign(payload, JWT_SECRET, 'HS256');
    } catch (err) {
        logger.error('Error generating token:', { error: err });
        throw new Error('Failed to generate JWT token');
    }
};

