import { NextResponse } from "next/server";
import { connectDB, isMongoConnected } from "@/lib/db/mongodb";

export async function GET() {
  const db = await connectDB();
  const connected = !!db && isMongoConnected();

  return NextResponse.json({
    connected,
    type: connected ? "MongoDB (Active)" : "Runtime In-Memory / Ready for MongoDB",
    message: connected
      ? "Connected to MongoDB via Mongoose successfully"
      : "Running with in-memory resilient storage. Add MONGODB_URI to .env.local to persist directly into MongoDB.",
  });
}
