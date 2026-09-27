import { z } from "zod";

export const ProductSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  price: z.number().min(0, "Price must be positive"),
  originalPrice: z.number().min(0).optional(),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  condition: z.string().default("Grade A Curated Vintage"),
  images: z.array(z.string().url("Must be a valid URL")).min(1, "At least 1 image is required"),
  sizes: z.array(z.string()).min(1, "At least 1 size is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  isTrending: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof ProductSchema>;
