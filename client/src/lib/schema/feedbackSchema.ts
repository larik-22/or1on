import {z} from "zod";

export const feedbackSchema = z.object({
	userid: z.string().optional(),
	rating: z.number().min(1, "Rating can't be less than 1").max(5, "Rating can't be more than 5"),
	feedbackMessage: z.string().min(5, "Please provide at least 5 characters").max(500, "Word limit exceeded"),
})