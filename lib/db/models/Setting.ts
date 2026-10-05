import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISetting extends Document {
  identifier: string; // "site_settings"
  storeName: string;
  tagline: string;
  currency: string;
  freeShippingThreshold: number;
  supportEmail: string;
  supportPhone: string;
  instagramHandle: string;
  address: string;
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;
  appDownload?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    playStoreUrl?: string;
    appStoreUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    identifier: { type: String, required: true, unique: true, default: "site_settings" },
    storeName: { type: String, default: "NEON" },
    tagline: {
      type: String,
      default: "Thrifted culture. Curated style. Pieces with a past, made for the present.",
    },
    currency: { type: String, default: "₹" },
    freeShippingThreshold: { type: Number, default: 1499 },
    supportEmail: { type: String, default: "support@neonthrift.com" },
    supportPhone: { type: String, default: "+91 98765 43210" },
    instagramHandle: { type: String, default: "@neon.thrift" },
    address: { type: String, default: "Streetwear Vault, Fashion District" },
    cloudinaryCloudName: { type: String, default: "" },
    cloudinaryApiKey: { type: String, default: "" },
    cloudinaryApiSecret: { type: String, default: "" },
    appDownload: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: "DOWNLOAD OUR APP" },
      subtitle: {
        type: String,
        default: "Shop curated vintage streetwear on the go. Get instant drop alerts.",
      },
      playStoreUrl: { type: String, default: "" },
      appStoreUrl: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);
