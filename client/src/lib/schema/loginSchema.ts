import { z } from 'zod';

//TODO uncomment after backend password validation sync
export const loginSchema = z
	.object({
		email: z.string().email(),
		password:
			z
				.string()
				.min(6, "Password must be at least 6 characters long")
				.max(32, "Password must be at most 32 characters long")
				.regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])'), {
						message:
							'Password must contain an uppercase letter, lowercase letter, and number'
					}
				)
	})