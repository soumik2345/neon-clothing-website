import { NextRequest, NextResponse } from "next/server";
import { getBanners, updateBanners } from "@/features/banners/services/banner.service";

export async function GET() {
  try {
    const banners = await getBanners();
    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    console.error("API Error in GET /api/banners:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await updateBanners(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("API Error in PUT /api/banners:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update banners" },
      { status: 500 }
    );
  }
}
