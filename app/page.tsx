import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/features/banners/components/HeroBanner";
import { ValueProps } from "@/features/banners/components/ValueProps";
import { CategoryGrid } from "@/features/categories/components/CategoryGrid";
import { TrendingSection } from "@/features/products/components/TrendingSection";
import { PromoCards } from "@/features/banners/components/PromoCards";
import { CategoryShowcaseSection } from "@/features/products/components/CategoryShowcaseSection";
import { getBanners } from "@/features/banners/services/banner.service";
import { getCategories } from "@/features/categories/services/category.service";
import { getProducts } from "@/features/products/services/product.service";
import { BannerContentType } from "@/features/banners/types/banner.types";
import { CategoryType } from "@/features/categories/types/category.types";
import { ProductType } from "@/features/products/types/product.types";
import { getSettings } from "@/features/settings/services/settings.service";
import { SiteSettingsType } from "@/features/settings/types/settings.types";
import {
  initialBanners,
  initialCategories,
  initialProducts,
  initialSettings,
} from "@/lib/db/seed-data";

export const revalidate = 0;

export default async function HomePage() {
  let banners: BannerContentType = JSON.parse(JSON.stringify(initialBanners));
  let categories: CategoryType[] = JSON.parse(JSON.stringify(initialCategories));
  let trendingProducts: ProductType[] = JSON.parse(
    JSON.stringify(initialProducts.filter((p) => p.isTrending))
  );
  let settings: SiteSettingsType = JSON.parse(JSON.stringify(initialSettings));

  try {
    const [rawBanners, rawCategories, rawTrendingProducts, rawSettings] =
      await Promise.all([
        getBanners(),
        getCategories(),
        getProducts({ isTrending: true, limit: 12 }),
        getSettings(),
      ]);

    if (rawBanners) banners = JSON.parse(JSON.stringify(rawBanners));
    if (rawCategories) categories = JSON.parse(JSON.stringify(rawCategories));
    if (rawTrendingProducts)
      trendingProducts = JSON.parse(JSON.stringify(rawTrendingProducts));
    if (rawSettings) settings = JSON.parse(JSON.stringify(rawSettings));
  } catch (err) {
    console.warn("HomePage SSR data fetch fallback:", err);
  }

  // Shop By Category Section Config (from Admin Panel)
  const shopByCategoryConfig = banners.shopByCategorySection || {
    enabled: true,
    title: "SHOP BY CATEGORY",
    limit: 5,
    selectedCategories: [],
  };

  let displayCategories = categories;

  if (
    shopByCategoryConfig.selectedCategories &&
    shopByCategoryConfig.selectedCategories.length > 0
  ) {
    const catMap = new Map(categories.map((c) => [c.slug, c]));
    const matched = shopByCategoryConfig.selectedCategories
      .map((slug) => catMap.get(slug))
      .filter((c): c is typeof categories[number] => Boolean(c));
    if (matched.length > 0) {
      displayCategories = matched;
    }
  } else {
    displayCategories = categories.filter((c) => c.showOnHome !== false);
  }

  const categoryLimit = Number(shopByCategoryConfig.limit) || 5;
  displayCategories = displayCategories.slice(0, categoryLimit);

  // Dynamic Category Spotlight Sections from Admin Config
  const rawSpotlightSections =
    banners.featuredCategorySections && banners.featuredCategorySections.length > 0
      ? banners.featuredCategorySections
      : banners.featuredCategorySection
      ? [
          {
            id: "sec_default_hoodies",
            enabled: banners.featuredCategorySection.enabled !== false,
            tag: "CATEGORY SPOTLIGHT",
            categorySlug: banners.featuredCategorySection.categorySlug || "hoodies",
            title: banners.featuredCategorySection.title || "FEATURED COLLECTION: HOODIES",
            subtitle:
              banners.featuredCategorySection.subtitle ||
              "Heavyweight french terry hoodies & vintage drops",
            limit: banners.featuredCategorySection.limit || 10,
            selectedProductIds: [],
          },
        ]
      : [];

  const activeSpotlightSections = rawSpotlightSections.filter((s) => s.enabled !== false);

  const rawSpotlightWithProds = await Promise.all(
    activeSpotlightSections.map(async (sec) => {
      let prods: ProductType[] = [];
      const secLimit = Number(sec.limit) || 10;

      if (sec.selectedProductIds && sec.selectedProductIds.length > 0) {
        prods = await getProducts({
          ids: sec.selectedProductIds,
          limit: secLimit,
        });
      }

      if (prods.length === 0 && sec.categorySlug) {
        prods = await getProducts({
          category: sec.categorySlug,
          limit: secLimit,
        });
      }

      return {
        ...sec,
        products: prods,
      };
    })
  );

  const spotlightSectionsWithProducts: Array<typeof rawSpotlightWithProds[number]> =
    JSON.parse(JSON.stringify(rawSpotlightWithProds));


  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      {/* Top Navbar & Announcement */}
      <Header
        announcementText={banners.announcementText}
        storeName={settings.storeName}
      />

      <main className="flex-1">
        {/* Hero Section Carousel */}
        <HeroBanner hero={banners.hero} slides={banners.heroSlides} />

        {/* 4 Feature Props Bar */}
        <ValueProps items={banners.valueProps} />

        {/* Shop By Category Section (Responsive Slider for mobile, Grid for desktop) */}
        {shopByCategoryConfig.enabled !== false && displayCategories.length > 0 && (
          <CategoryGrid
            categories={displayCategories}
            title={shopByCategoryConfig.title || "SHOP BY CATEGORY"}
          />
        )}

        {/* Trending Now Products Carousel */}
        <TrendingSection products={trendingProducts} />

        {/* Dynamic Category Sections (Hoodies, T-Shirts, Pants etc. - styled identically to Trending Now) */}
        {spotlightSectionsWithProducts.map((sec) => (
          <CategoryShowcaseSection
            key={sec.id || `${sec.categorySlug}-${sec.title}`}
            title={sec.title || sec.categorySlug.toUpperCase()}
            categorySlug={sec.categorySlug}
            products={sec.products}
          />
        ))}

        {/* 3 Promo Banners */}
        <PromoCards cards={banners.promoCards} />

      </main>

      {/* Comprehensive Footer */}
      <Footer
        storeName={settings.storeName}
        tagline={settings.tagline}
        appDownload={settings.appDownload}
      />
    </div>
  );
}
