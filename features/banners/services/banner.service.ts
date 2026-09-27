import { connectDB, isMongoConnected } from "@/lib/db/mongodb";
import { Banner, IBanner } from "@/lib/db/models/Banner";
import { initialBanners } from "@/lib/db/seed-data";
import { BannerContentType } from "../types/banner.types";

let localBanners: BannerContentType = {
  ...initialBanners,
  _id: "ban_default",
};

export async function seedBannersIfEmpty(): Promise<void> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const count = await Banner.countDocuments({ identifier: "home_banners" });
      if (count === 0) {
        await Banner.create(initialBanners);
        console.log("Successfully seeded MongoDB banners!");
      }
    } catch (e) {
      console.warn("Error seeding MongoDB banners:", e);
    }
  }
}

export async function getBanners(): Promise<BannerContentType> {
  await seedBannersIfEmpty();

  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const doc = await Banner.findOne({ identifier: "home_banners" }).lean();
      if (doc) {
        const b = doc as IBanner & { _id: unknown };
        return {
          ...b,
          _id: String(b._id),
          featuredCategorySection:
            b.featuredCategorySection || initialBanners.featuredCategorySection,
        } as BannerContentType;
      }
    } catch (err) {
      console.warn("MongoDB getBanners failed, using fallback:", err);
    }
  }

  return localBanners;
}

export async function updateBanners(
  data: Partial<BannerContentType>
): Promise<BannerContentType> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const updated = await Banner.findOneAndUpdate(
        { identifier: "home_banners" },
        data,
        { new: true, upsert: true }
      ).lean();
      if (updated) {
        const b = updated as IBanner & { _id: unknown };
        return {
          ...b,
          _id: String(b._id),
        } as BannerContentType;
      }
    } catch (err) {
      console.warn("MongoDB updateBanners failed, using fallback:", err);
    }
  }

  localBanners = {
    ...localBanners,
    ...data,
  };

  return localBanners;
}
