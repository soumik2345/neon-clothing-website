import { NextRequest, NextResponse } from "next/server";
import {
  getNotifications,
  createNotification,
} from "@/features/notifications/services/notification.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : 30;

    const notifications = await getNotifications({ userEmail: email, limit });
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error("API Error in GET /api/notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, type, targetUrl, imageUrl, targetUserEmail } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: "Title and message are required" },
        { status: 400 }
      );
    }

    const notification = await createNotification({
      title,
      message,
      type: type || "promo",
      targetUrl,
      imageUrl,
      targetUserEmail,
    });

    return NextResponse.json(
      { success: true, data: notification },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error in POST /api/notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
