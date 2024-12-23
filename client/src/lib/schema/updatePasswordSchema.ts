import { z } from 'zod';

/**
 * Schema for validating the update password form data.
 * Ensures the new password meets security requirements and matches the confirmation password.
 */
export const updatePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required."),
        newPassword: z
            .string()
            .min(6, "Password must be at least 6 characters long.")
            .max(32, "Password must be at most 32 characters long.")
            .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, {
                message:
                    "Password must contain an uppercase letter, a lowercase letter, and a number!",
            }),
        confirmPassword: z.string().min(1, "Please confirm your new password."),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match-_-",
        path: ["confirmPassword"],
    });
