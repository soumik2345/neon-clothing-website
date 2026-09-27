import { NextRequest, NextResponse } from "next/server";
import { connectDB, getMongoStatus } from "@/lib/db/mongodb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("retry") === "true";

  if (force) {
    await connectDB(true);
  }

  const status = getMongoStatus();

  return NextResponse.json({
    connected: status.connected,
    type: status.connected ? "MongoDB Atlas (Active)" : "In-Memory Resilient Storage",
    lastError: status.lastError,
    cooldownActive: status.cooldownActive,
    message: status.connected
      ? "Connected to MongoDB via Mongoose successfully"
      : status.lastError?.includes("whitelist")
      ? "MongoDB Atlas connection blocked: Please whitelist your IP (or 0.0.0.0/0) in MongoDB Atlas -> Network Access."
      : "Running with in-memory resilient storage. Everything functions dynamically.",
  });
}
