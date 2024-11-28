import { z } from 'zod';

export const loginSchema = z
	.object({
		email: z.string().email(),
		password:
			z
				.string()
				.min(8, "Username must be at least 8 characters long")
				.max(32, "Username must be at most 32 characters long")
				// .regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])'), {
				// 		message:
				// 			'Password must contain an uppercase letter, lowercase letter, and number'
				// 	}
				// )
	})