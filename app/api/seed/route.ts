import { NextResponse } from "next/server";
import { connectDB, isMongoConnected } from "@/lib/db/mongodb";
import { Product } from "@/lib/db/models/Product";
import { Category } from "@/lib/db/models/Category";
import { Order } from "@/lib/db/models/Order";
import { Banner } from "@/lib/db/models/Banner";
import { Setting } from "@/lib/db/models/Setting";
import {
  initialProducts,
  initialCategories,
  initialOrders,
  initialBanners,
  initialSettings,
} from "@/lib/db/seed-data";

export async function POST() {
  try {
    const db = await connectDB(true);
    const isMongo = !!db && isMongoConnected();

    if (isMongo) {
      // Clear and re-populate
      await Product.deleteMany({});
      await Category.deleteMany({});
      await Order.deleteMany({});
      await Banner.deleteMany({});
      await Setting.deleteMany({});

      await Product.insertMany(initialProducts);
      await Category.insertMany(initialCategories);
      await Order.insertMany(initialOrders);
      await Banner.create(initialBanners as unknown as Record<string, unknown>);
      await Setting.create(initialSettings);

      return NextResponse.json({
        success: true,
        message: "MongoDB successfully seeded with design mockup dataset!",
        database: "MongoDB",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized in memory with design mockup dataset!",
      database: "InMemoryFallback",
    });
  } catch (error) {
    console.error("API Error in POST /api/seed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
