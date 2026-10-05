import { connectDB } from "@/lib/db/mongodb";
import { Notification, INotification } from "@/lib/db/models/Notification";
import {
  NotificationItem,
  CreateNotificationInput,
} from "../types/notification.types";

function toPlainNotification(doc: any, userEmail?: string): NotificationItem {
  const plain = JSON.parse(JSON.stringify(doc));
  const isRead = userEmail
    ? Boolean(plain.isRead || (plain.readBy && plain.readBy.includes(userEmail.toLowerCase().trim())))
    : Boolean(plain.isRead);

  return {
    _id: String(plain._id),
    id: String(plain._id),
    title: plain.title,
    message: plain.message,
    type: plain.type || "promo",
    targetUrl: plain.targetUrl || "",
    imageUrl: plain.imageUrl || "",
    targetUserEmail: plain.targetUserEmail || null,
    isRead,
    createdAt: plain.createdAt,
  };
}

export async function getNotifications(filter?: {
  userEmail?: string;
  limit?: number;
}): Promise<NotificationItem[]> {
  await connectDB();

  const userEmail = filter?.userEmail?.toLowerCase().trim();
  const limit = Math.min(filter?.limit || 30, 100);

  let query: any = {};
  if (userEmail) {
    // Both broadcast notifications and targeted notifications for this email
    const escapedEmail = userEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query = {
      $or: [
        { targetUserEmail: null },
        { targetUserEmail: "" },
        { targetUserEmail: { $exists: false } },
        { targetUserEmail: userEmail },
        { targetUserEmail: { $regex: new RegExp(`^${escapedEmail}$`, "i") } },
      ],
    };
  } else {
    // Public broadcast only
    query = {
      $or: [
        { targetUserEmail: null },
        { targetUserEmail: "" },
        { targetUserEmail: { $exists: false } },
      ],
    };
  }

  const docs = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return docs.map((d) => toPlainNotification(d, userEmail));
}

export async function createNotification(
  data: CreateNotificationInput
): Promise<NotificationItem> {
  await connectDB();

  const doc: any = await Notification.create({
    title: data.title.trim(),
    message: data.message.trim(),
    type: data.type || "promo",
    targetUrl: data.targetUrl?.trim() || "",
    imageUrl: data.imageUrl?.trim() || "",
    targetUserEmail: data.targetUserEmail
      ? data.targetUserEmail.toLowerCase().trim()
      : undefined,
    isRead: false,
    readBy: [],
  });

  return toPlainNotification(doc.toObject ? doc.toObject() : doc, data.targetUserEmail);
}

export async function markNotificationAsRead(
  id: string,
  userEmail?: string
): Promise<boolean> {
  await connectDB();

  if (userEmail) {
    const cleanEmail = userEmail.toLowerCase().trim();
    await Notification.findByIdAndUpdate(id, {
      $addToSet: { readBy: cleanEmail },
      isRead: true,
    });
  } else {
    await Notification.findByIdAndUpdate(id, { isRead: true });
  }

  return true;
}

export async function deleteNotification(id: string): Promise<boolean> {
  await connectDB();
  const res = await Notification.findByIdAndDelete(id);
  return Boolean(res);
}
