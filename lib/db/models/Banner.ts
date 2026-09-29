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
  heroSlides?: Array<{
    tag: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    bgType: "image" | "color";
    image?: string;
    bgColor?: string;
    textColor?: "white" | "black";
  }>;
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
  shopByCategorySection?: {
    enabled: boolean;
    title: string;
    limit: number;
    selectedCategories: string[];
  };
  featuredCategorySection?: {
    enabled: boolean;
    categorySlug: string;
    title: string;
    subtitle?: string;
    limit: number;
  };
  featuredCategorySections?: Array<{
    id?: string;
    enabled: boolean;
    tag?: string;
    categorySlug: string;
    title: string;
    subtitle?: string;
    limit: number;
    selectedProductIds?: string[];
  }>;
  categoryTabbedSection?: {
    enabled: boolean;
    tag?: string;
    title: string;
    subtitle?: string;
    items: Array<{
      categorySlug: string;
      label?: string;
      limit: number;
      selectedProductIds?: string[];
      enabled: boolean;
    }>;
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
    heroSlides: [
      {
        tag: { type: String, default: "NEW ARRIVALS" },
        title: { type: String, default: "THRIFTED.\nCURATED." },
        subtitle: {
          type: String,
          default: "Premium thrifted pieces. Handpicked for quality. Priced for you.",
        },
        ctaText: { type: String, default: "SHOP NOW" },
        ctaLink: { type: String, default: "/shop" },
        bgType: { type: String, enum: ["image", "color"], default: "image" },
        image: { type: String, default: "" },
        bgColor: { type: String, default: "#0c0c0c" },
        textColor: { type: String, enum: ["white", "black"], default: "white" },
      },
    ],
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
    shopByCategorySection: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: "SHOP BY CATEGORY" },
      limit: { type: Number, default: 5 },
      selectedCategories: { type: [String], default: [] },
    },
    featuredCategorySection: {
      enabled: { type: Boolean, default: true },
      categorySlug: { type: String, default: "hoodies" },
      title: { type: String, default: "FEATURED COLLECTION: HOODIES" },
      subtitle: { type: String, default: "Handpicked heavyweight hoodies & vintage drops" },
      limit: { type: Number, default: 10 },
    },
    featuredCategorySections: [
      {
        id: { type: String },
        enabled: { type: Boolean, default: true },
        tag: { type: String, default: "CATEGORY SPOTLIGHT" },
        categorySlug: { type: String, required: true, default: "hoodies" },
        title: { type: String, required: true, default: "FEATURED COLLECTION: HOODIES" },
        subtitle: { type: String, default: "Heavyweight french terry hoodies & vintage drops" },
        limit: { type: Number, default: 10 },
        selectedProductIds: { type: [String], default: [] },
      },
    ],
    categoryTabbedSection: {
      enabled: { type: Boolean, default: true },
      tag: { type: String, default: "CURATED DROPS & COLLABS" },
      title: { type: String, default: "EXPLORE BY CATEGORY" },
      subtitle: {
        type: String,
        default: "Select a category to view handpicked streetwear pieces",
      },
      items: [
        {
          categorySlug: { type: String, required: true },
          label: { type: String },
          limit: { type: Number, default: 8 },
          selectedProductIds: { type: [String], default: [] },
          enabled: { type: Boolean, default: true },
        },
      ],
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
