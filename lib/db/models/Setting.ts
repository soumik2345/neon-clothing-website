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
  },
  { timestamps: true }
);

export const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);
