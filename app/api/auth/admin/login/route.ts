import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { comparePassword, hashPassword, signToken } from "@/lib/auth/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if any admin exists. If not, auto-seed default master admin
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      const defaultPasswordHash = await hashPassword("admin123");
      await User.create({
        name: "Neon Master Admin",
        email: "admin@neonthrift.com",
        password: defaultPasswordHash,
        role: "admin",
      });
      console.log("Auto-provisioned default master admin: admin@neonthrift.com / admin123");
    }

    // Find admin user with password field included
    const user = await User.findOne({ email: cleanEmail, role: "admin" }).select("+password");

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, error: "Invalid admin credentials or account not authorized as Admin" },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate Admin JWT Token
    const token = await signToken({
      userId: String(user._id),
      email: user.email,
      name: user.name,
      role: "admin",
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin authenticated successfully",
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set("neon_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Admin login error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
