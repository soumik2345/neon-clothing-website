import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { NotificationSubscription } from "@/lib/db/models/NotificationSubscription";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { endpoint, keys, userEmail, platform } = body;

    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: "Endpoint is required" },
        { status: 400 }
      );
    }

    const sub = await NotificationSubscription.findOneAndUpdate(
      { endpoint },
      {
        endpoint,
        keys: keys || {},
        userEmail: userEmail?.toLowerCase()?.trim() || null,
        platform: platform || "web",
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Subscription saved",
      data: sub,
    });
  } catch (error) {
    console.error("API Error in POST /api/notifications/subscribe:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}
