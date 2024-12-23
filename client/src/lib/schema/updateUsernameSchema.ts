import { z } from 'zod';

/**
 * Schema for validating the update username form data.
 * Ensures the new username is alphanumeric and within the character limits.
 */
export const updateUsernameSchema = z.object({
    newUsername: z
        .string()
        .min(4, "Username must be at least 4 characters long.")
        .max(24, "Username must be at most 24 characters long.")
        .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric."),
});
