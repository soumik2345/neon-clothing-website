import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotificationSubscription extends Document {
  endpoint: string;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
  userEmail?: string;
  platform: "web" | "mobile";
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSubscriptionSchema = new Schema<INotificationSubscription>(
  {
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, default: "" },
      auth: { type: String, default: "" },
    },
    userEmail: { type: String, lowercase: true, trim: true, default: null },
    platform: { type: String, enum: ["web", "mobile"], default: "web" },
  },
  { timestamps: true }
);

NotificationSubscriptionSchema.index({ endpoint: 1 });
NotificationSubscriptionSchema.index({ userEmail: 1 });

export const NotificationSubscription: Model<INotificationSubscription> =
  mongoose.models.NotificationSubscription ||
  mongoose.model<INotificationSubscription>(
    "NotificationSubscription",
    NotificationSubscriptionSchema
  );
