import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  type: "promo" | "drop" | "order" | "general";
  targetUrl?: string;
  imageUrl?: string;
  targetUserEmail?: string | null;
  isRead: boolean;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["promo", "drop", "order", "general"],
      default: "promo",
    },
    targetUrl: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    targetUserEmail: { type: String, trim: true, lowercase: true, default: null },
    isRead: { type: Boolean, default: false },
    readBy: [{ type: String, lowercase: true, trim: true }],
  },
  { timestamps: true }
);

NotificationSchema.index({ targetUserEmail: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: -1 });

export const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
