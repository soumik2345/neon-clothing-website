import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.delete("neon_user_token");
  response.cookies.delete("neon_admin_token");
  return response;
}
