export type NotificationTypeEnum = "promo" | "drop" | "order" | "general";

export interface NotificationItem {
  _id?: string;
  id: string;
  title: string;
  message: string;
  type: NotificationTypeEnum;
  targetUrl?: string;
  imageUrl?: string;
  targetUserEmail?: string | null;
  isRead?: boolean;
  createdAt: string;
}

export interface CreateNotificationInput {
  title: string;
  message: string;
  type?: NotificationTypeEnum;
  targetUrl?: string;
  imageUrl?: string;
  targetUserEmail?: string;
}
