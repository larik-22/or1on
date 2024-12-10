import { z } from 'zod';

export const registerSchema = z
	.object({
		username: z.string().min(4, "Username must be at least 4 characters long").max(24, "Username must be at most 24 characters long"),
		email: z.string().email(),
		password:
			z
				.string()
				.min(6, "Password must be at least 6 characters long")
				.max(32, "Password must be at most 32 characters long"),
				// .regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])'), {
				// 		message:
				// 			'Password must contain an uppercase letter, lowercase letter, and number'
				// 	}
				// ),
		confirmPassword:
			z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});