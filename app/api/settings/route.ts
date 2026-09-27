import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/features/settings/services/settings.service";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("API Error in GET /api/settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await updateSettings(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("API Error in PUT /api/settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
