import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import {
  initialCategories,
  initialProducts,
  initialBanners,
  initialSettings,
  initialOrders,
} from "../lib/db/seed-data";

// Load .env.local if present
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    for (const line of envConfig.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...values] = trimmed.split("=");
        process.env[key.trim()] = values.join("=").trim();
      }
    }
  }
} catch {
  // Ignore
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/neon_thrift";

async function runSeed() {
  console.log("⚡ Starting NEON database seeder...");
  console.log(`📡 Connecting to MongoDB: ${MONGODB_URI}`);

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✓ Connected to MongoDB successfully!");

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Failed to get MongoDB database instance");
    }

    // Clear existing collections
    console.log("🧹 Clearing old data...");
    await Promise.all([
      db.collection("products").deleteMany({}),
      db.collection("categories").deleteMany({}),
      db.collection("banners").deleteMany({}),
      db.collection("settings").deleteMany({}),
      db.collection("orders").deleteMany({}),
    ]);

    // Insert Mockup Dataset
    console.log("📦 Inserting categories...");
    await db.collection("categories").insertMany(initialCategories);

    console.log("📦 Inserting streetwear products...");
    await db.collection("products").insertMany(initialProducts);

    console.log("📦 Inserting banners, hero & promo configuration...");
    await db.collection("banners").insertOne(initialBanners);

    console.log("📦 Inserting store settings...");
    await db.collection("settings").insertOne(initialSettings);

    console.log("📦 Inserting sample orders...");
    await db.collection("orders").insertMany(initialOrders);

    console.log("\n==========================================");
    console.log("🎉 SEEDING COMPLETED SUCCESSFULLY!");
    console.log(`- Categories: ${initialCategories.length}`);
    console.log(`- Products:   ${initialProducts.length}`);
    console.log(`- Orders:     ${initialOrders.length}`);
    console.log("- Banners, Hero & Featured Collection configured");
    console.log("==========================================\n");
  } catch (error: unknown) {
    const err = error as Error;
    console.error("\n❌ MongoDB Seeding Error:", err.message);
    console.log("\nℹ️  If your local MongoDB is not running:");
    console.log("1. Start MongoDB with: brew services start mongodb-community");
    console.log("   OR run MongoDB in Docker: docker run -d -p 27017:27017 mongo");
    console.log("2. Or use a free MongoDB Atlas URI in .env.local:");
    console.log("   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/neon_thrift");
    console.log("\nNote: The website also operates with built-in in-memory fallback!");
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runSeed();
