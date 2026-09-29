import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  image: z.string().min(1, "Must be a valid image path or URL"),
  description: z.string().optional(),
  itemCount: z.number().int().min(0).default(0),
  order: z.number().int().default(0),
  showOnHome: z.boolean().default(true).optional(),
});

export type CategoryInput = z.infer<typeof CategorySchema>;
