import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAboutPillar {
  number: string;
  title: string;
  description: string;
}

export interface IAbout extends Document {
  identifier: string; // "site_about"
  badge: string;
  title: string;
  subtitle: string;
  bannerImage: string;
  storyTitle?: string;
  storyContent?: string;
  pillars: IAboutPillar[];
  createdAt: Date;
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    identifier: { type: String, required: true, unique: true, default: "site_about" },
    badge: { type: String, default: "OUR PHILOSOPHY" },
    title: { type: String, default: "THRIFTED CULTURE. CURATED STYLE." },
    subtitle: {
      type: String,
      default: "Pieces with a past, made for the present. Founded in 2024 to redefine vintage streetwear.",
    },
    bannerImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
    },
    storyTitle: { type: String, default: "THE NEON VISION" },
    storyContent: {
      type: String,
      default: "Born in the underground streetwear movement, NEON reclaims authentic vintage silhouettes, heavy french terry fabrics, and timeless thrift drops for modern street expression.",
    },
    pillars: [
      {
        number: { type: String, default: "01. HANDPICKED" },
        title: { type: String, default: "HANDPICKED" },
        description: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

export const About: Model<IAbout> =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);
