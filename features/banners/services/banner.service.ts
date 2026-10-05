import { connectDB } from "@/lib/db/mongodb";
import { Banner, IBanner } from "@/lib/db/models/Banner";
import { BannerContentType } from "../types/banner.types";
import { initialBanners } from "@/lib/db/seed-data";

export async function getBanners(): Promise<BannerContentType> {
  try {
    await connectDB();

    let doc = await Banner.findOne({ identifier: "home_banners" }).lean();
    if (!doc) {
      // If not yet initialized in collection, create initial document
      await Banner.create(initialBanners as unknown as Partial<IBanner>);
      doc = await Banner.findOne({ identifier: "home_banners" }).lean();
    }

    if (doc) {
      const b = doc as IBanner & { _id: unknown };
      const heroSlides =
        b.heroSlides && b.heroSlides.length > 0
          ? b.heroSlides
          : initialBanners.heroSlides || [
              {
                tag: b.hero?.tag || "NEW ARRIVALS",
                title: b.hero?.title || "THRIFTED.\nCURATED.",
                subtitle:
                  b.hero?.subtitle ||
                  "Premium thrifted pieces. Handpicked for quality. Priced for you.",
                ctaText: b.hero?.ctaText || "SHOP NOW",
                ctaLink: b.hero?.ctaLink || "/shop",
                bgType: "image",
                image:
                  b.hero?.image ||
                  "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80",
                bgColor: "#0c0c0c",
                textColor: "white",
              },
            ];

      const result = {
        ...b,
        _id: String(b._id),
        heroSlides,
        featuredCategorySection:
          b.featuredCategorySection || initialBanners.featuredCategorySection,
        featuredCategorySections:
          b.featuredCategorySections && b.featuredCategorySections.length > 0
            ? b.featuredCategorySections
            : [
                {
                  id: "sec_hoodies_default",
                  enabled: true,
                  categorySlug: "hoodies",
                  title: "HOODIES",
                  limit: 12,
                  selectedProductIds: [],
                },
                {
                  id: "sec_tshirts_default",
                  enabled: true,
                  categorySlug: "t-shirts",
                  title: "T-SHIRTS",
                  limit: 12,
                  selectedProductIds: [],
                },
                {
                  id: "sec_pants_default",
                  enabled: true,
                  categorySlug: "pants",
                  title: "PANTS",
                  limit: 12,
                  selectedProductIds: [],
                },
              ],
        shopByCategorySection:
          b.shopByCategorySection || {
            enabled: true,
            title: "SHOP BY CATEGORY",
            limit: 5,
            selectedCategories: ["hoodies", "t-shirts", "pants", "jackets", "accessories"],
          },
        categoryTabbedSection:
          b.categoryTabbedSection || {
            enabled: true,
            tag: "CURATED DROPS & COLLABS",
            title: "EXPLORE BY CATEGORY",
            subtitle: "Select a category to view handpicked streetwear pieces",
            items: [
              { categorySlug: "hoodies", label: "HOODIES", limit: 8, selectedProductIds: [], enabled: true },
              { categorySlug: "t-shirts", label: "T-SHIRTS", limit: 8, selectedProductIds: [], enabled: true },
              { categorySlug: "pants", label: "PANTS", limit: 8, selectedProductIds: [], enabled: true },
              { categorySlug: "jackets", label: "JACKETS", limit: 8, selectedProductIds: [], enabled: true },
            ],
          },
      };

      return JSON.parse(JSON.stringify(result)) as BannerContentType;
    }
  } catch (error) {
    console.warn("getBanners fallback to initialBanners:", error);
  }

  return JSON.parse(JSON.stringify(initialBanners)) as BannerContentType;
}

export async function updateBanners(
  data: Partial<BannerContentType>
): Promise<BannerContentType> {
  await connectDB();

  const updated = await Banner.findOneAndUpdate(
    { identifier: "home_banners" },
    data,
    { new: true, upsert: true }
  ).lean();

  const b = updated as IBanner & { _id: unknown };
  return JSON.parse(
    JSON.stringify({
      ...b,
      _id: String(b._id),
    })
  ) as BannerContentType;
}
