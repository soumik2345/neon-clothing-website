import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { About } from "@/lib/db/models/About";
import { initialAbout } from "@/lib/db/seed-data";

export async function GET() {
  try {
    await connectDB();
    let doc = await About.findOne({ identifier: "site_about" }).lean();
    if (!doc) {
      const created = await About.create(initialAbout);
      doc = created.toObject();
    }
    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error("GET /api/about error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load About Us information" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await connectDB();

    const updated = await About.findOneAndUpdate(
      { identifier: "site_about" },
      body,
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/about error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update About Us content" },
      { status: 500 }
    );
  }
}
