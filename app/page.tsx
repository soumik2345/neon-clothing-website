import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/features/banners/components/HeroBanner";
import { ValueProps } from "@/features/banners/components/ValueProps";
import { CategoryGrid } from "@/features/categories/components/CategoryGrid";
import { TrendingSection } from "@/features/products/components/TrendingSection";
import { PromoCards } from "@/features/banners/components/PromoCards";
import { CategoryShowcaseSection } from "@/features/products/components/CategoryShowcaseSection";
import { InstagramFeed } from "@/features/banners/components/InstagramFeed";
import { getBanners } from "@/features/banners/services/banner.service";
import { getCategories } from "@/features/categories/services/category.service";
import { getProducts } from "@/features/products/services/product.service";
import { getSettings } from "@/features/settings/services/settings.service";

export const revalidate = 0;

export default async function HomePage() {
  const [banners, categories, trendingProducts, settings] = await Promise.all([
    getBanners(),
    getCategories(),
    getProducts({ isTrending: true, limit: 12 }),
    getSettings(),
  ]);

  // Featured Category Section from Admin Config
  const featuredConfig = banners.featuredCategorySection || {
    enabled: true,
    categorySlug: "hoodies",
    title: "FEATURED COLLECTION: HOODIES",
    subtitle: "Heavyweight french terry hoodies & vintage drops",
    limit: 10,
  };

  const featuredCategoryProducts = await getProducts({
    category: featuredConfig.categorySlug,
    limit: featuredConfig.limit || 10,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      {/* Top Navbar & Announcement */}
      <Header
        announcementText={banners.announcementText}
        storeName={settings.storeName}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroBanner hero={banners.hero} />

        {/* 4 Feature Props Bar */}
        <ValueProps items={banners.valueProps} />

        {/* Category Grid (5 categories) */}
        <CategoryGrid categories={categories} />

        {/* Trending Now Products Carousel */}
        <TrendingSection products={trendingProducts} />

        {/* 3 Promo Banners */}
        <PromoCards cards={banners.promoCards} />

        {/* Dynamic Category-Based Showcase Section (configured from Admin Panel) */}
        {featuredConfig.enabled !== false && (
          <CategoryShowcaseSection
            title={featuredConfig.title || `COLLECTION: ${featuredConfig.categorySlug.toUpperCase()}`}
            subtitle={featuredConfig.subtitle}
            categorySlug={featuredConfig.categorySlug}
            products={featuredCategoryProducts}
            limit={featuredConfig.limit}
          />
        )}

        {/* Instagram Grid Bar */}
        <InstagramFeed
          posts={banners.instagramFeed}
          handle={settings.instagramHandle}
        />
      </main>

      {/* Comprehensive Footer */}
      <Footer storeName={settings.storeName} tagline={settings.tagline} />
    </div>
  );
}
