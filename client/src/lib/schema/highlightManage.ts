import {z} from "zod";

export const highlightSchema = z.object({
    name: z.string().nonempty("Name is required"),
    description: z.string().nonempty("Description is required"),
    category: z.string().nonempty("Category is required"),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    is_approved: z.boolean().default(false),
    businessDescription: z.string().nullable().default(null),
});
