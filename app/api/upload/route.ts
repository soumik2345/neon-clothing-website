import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "@/lib/db/mongodb";
import { Setting } from "@/lib/db/models/Setting";
import fs from "fs";
import path from "path";

// Initialize Cloudinary with environment variables or MongoDB store settings
async function initCloudinary() {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  let apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    try {
      await connectDB();
      const settings = await Setting.findOne({ identifier: "site_settings" }).lean();
      if (settings) {
        const s = settings as unknown as Record<string, unknown>;
        if (s.cloudinaryCloudName && s.cloudinaryApiKey && s.cloudinaryApiSecret) {
          cloudName = String(s.cloudinaryCloudName);
          apiKey = String(s.cloudinaryApiKey);
          apiSecret = String(s.cloudinaryApiSecret);
        }
      }
    } catch {
      // Fallback
    }
  }

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = (formData as any).get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const hasCloudinary = await initCloudinary();

    if (hasCloudinary) {
      // Upload directly to Cloudinary
      return new Promise<NextResponse>((resolve) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "neon_streetwear",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) {
              console.error("Cloudinary upload error:", error);
              resolve(
                NextResponse.json(
                  { success: false, error: error?.message || "Cloudinary upload failed" },
                  { status: 500 }
                )
              );
            } else {
              resolve(
                NextResponse.json({
                  success: true,
                  url: result.secure_url,
                  publicId: result.public_id,
                  provider: "cloudinary",
                })
              );
            }
          }
        );

        uploadStream.end(buffer);
      });
    }

    // Fallback: If Cloudinary credentials are not configured yet, save to public/uploads
    // so the admin can test immediately without setup interruption
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const localUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: localUrl,
      provider: "local",
      message: "Uploaded locally (Set CLOUDINARY_CLOUD_NAME in .env.local to route directly to Cloudinary CDN)",
    });
  } catch (error: unknown) {
    console.error("Upload API error:", error);
    const msg = error instanceof Error ? error.message : "Failed to process image upload";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
