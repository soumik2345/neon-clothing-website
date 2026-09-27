import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBanner extends Document {
  identifier: string; // "home_banners"
  announcementText: string;
  hero: {
    tag: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    image: string;
  };
  valueProps: Array<{
    title: string;
    subtitle: string;
    icon: string;
  }>;
  promoCards: Array<{
    tag: string;
    title: string;
    ctaText: string;
    ctaLink: string;
    image: string;
  }>;
  featuredCategorySection: {
    enabled: boolean;
    categorySlug: string;
    title: string;
    subtitle?: string;
    limit: number;
  };
  instagramFeed: Array<{
    image: string;
    link: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    identifier: { type: String, required: true, unique: true, default: "home_banners" },
    announcementText: {
      type: String,
      default: "FREE SHIPPING ON ALL ORDERS ABOVE ₹1499",
    },
    hero: {
      tag: { type: String, default: "NEW ARRIVALS" },
      title: { type: String, default: "THRIFTED.\nCURATED." },
      subtitle: {
        type: String,
        default: "Premium thrifted pieces. Handpicked for quality. Priced for you.",
      },
      ctaText: { type: String, default: "SHOP NOW" },
      ctaLink: { type: String, default: "/shop" },
      image: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80",
      },
    },
    valueProps: [
      {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        icon: { type: String, required: true },
      },
    ],
    promoCards: [
      {
        tag: { type: String, required: true },
        title: { type: String, required: true },
        ctaText: { type: String, required: true },
        ctaLink: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    featuredCategorySection: {
      enabled: { type: Boolean, default: true },
      categorySlug: { type: String, default: "hoodies" },
      title: { type: String, default: "FEATURED COLLECTION: HOODIES" },
      subtitle: { type: String, default: "Handpicked heavyweight hoodies & vintage drops" },
      limit: { type: Number, default: 10 },
    },
    instagramFeed: [
      {
        image: { type: String, required: true },
        link: { type: String, default: "#" },
      },
    ],
  },
  { timestamps: true }
);

export const Banner: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);
