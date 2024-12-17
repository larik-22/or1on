import {z} from "zod";

export const highlightSuggestionSchema = z.object({
	lat: z.number().min(-90, "Latitude should be between -90 and 90").max(90, "Latitude should be between -90 and 90"),
	lng: z.number().min(-180, "Longitude should be between -180 and 180").max(180, "Longitude should be between -180 and 180"),
	name: z.string().min(3, "Name should be at least 3 characters"),
	description: z.string().min(5, "Description should be at least 5 characters"),
	category: z.string().min(1, "Please select a category"),
	businessDescription: z.string().optional(),
})