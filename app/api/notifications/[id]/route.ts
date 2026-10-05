import { NextRequest, NextResponse } from "next/server";
import {
  markNotificationAsRead,
  deleteNotification,
} from "@/features/notifications/services/notification.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { userEmail } = body;

    await markNotificationAsRead(id, userEmail);
    return NextResponse.json({ success: true, message: "Marked as read" });
  } catch (error) {
    console.error("API Error in PATCH /api/notifications/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteNotification(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Notification not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("API Error in DELETE /api/notifications/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
