import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  condition: string;
  images: string[];
  sizes: string[];
  stock: number;
  isTrending: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    category: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    condition: { type: String, default: "Grade A Curated Vintage" },
    images: [{ type: String, required: true }],
    sizes: [{ type: String, default: ["S", "M", "L", "XL"] }],
    stock: { type: Number, required: true, default: 10, min: 0 },
    isTrending: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isTrending: 1 });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
