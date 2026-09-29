import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    await connectDB();
    const userDoc = await User.findById(session.userId).lean();

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        name: userDoc?.name || session.name,
        email: session.email,
        role: session.role,
        phone: userDoc?.phone || "",
        address: userDoc?.address || {},
      },
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json({ authenticated: false, user: null });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, address } = body;

    await connectDB();
    const updated = await User.findByIdAndUpdate(
      session.userId,
      {
        ...(name ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(address !== undefined ? { address } : {}),
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.userId,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        phone: updated.phone || "",
        address: updated.address || {},
      },
    });
  } catch (error) {
    console.error("PUT /api/auth/me error:", error);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}
