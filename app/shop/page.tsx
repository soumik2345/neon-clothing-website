import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/features/products/components/ProductCard";
import { getProducts } from "@/features/products/services/product.service";
import { getCategories } from "@/features/categories/services/category.service";
import { getBanners } from "@/features/banners/services/banner.service";
import { getSettings } from "@/features/settings/services/settings.service";
import Link from "next/link";

export const revalidate = 0;

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: "price-asc" | "price-desc" | "newest" | "popular";
    search?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, sort, search } = await searchParams;

  const [products, categories, banners, settings] = await Promise.all([
    getProducts({
      category: category && category !== "all" ? category : undefined,
      sort,
      search,
    }),
    getCategories(),
    getBanners(),
    getSettings(),
  ]);

  const activeCategory = category || "all";

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header
        announcementText={banners.announcementText}
        storeName={settings.storeName}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 w-full">
        {/* Page Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
            CURATED COLLECTION
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black font-mono mt-1">
            {activeCategory === "all" ? "ALL STREETWEAR" : activeCategory}
          </h1>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mt-2">
            Explore authentic thrifted hoodies, oversized graphic tees, utility cargos, and outerwear.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-4 border-b border-neutral-200">
          <Link
            href="/shop"
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition ${
              activeCategory === "all"
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            All Products
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition ${
                activeCategory.toLowerCase() === c.slug.toLowerCase()
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Sort & Count Header */}
        <div className="flex items-center justify-between mb-8 text-xs text-neutral-500">
          <span>Showing {products.length} curated pieces</span>

          <div className="flex items-center gap-2">
            <span className="uppercase font-semibold text-neutral-600">Sort by:</span>
            <div className="flex items-center gap-2 font-medium">
              <Link
                href={`/shop?${category ? `category=${category}&` : ""}sort=newest`}
                className={`hover:text-black ${sort === "newest" ? "font-bold text-black underline" : ""}`}
              >
                Newest
              </Link>
              <span>•</span>
              <Link
                href={`/shop?${category ? `category=${category}&` : ""}sort=price-asc`}
                className={`hover:text-black ${sort === "price-asc" ? "font-bold text-black underline" : ""}`}
              >
                Price: Low to High
              </Link>
              <span>•</span>
              <Link
                href={`/shop?${category ? `category=${category}&` : ""}sort=price-desc`}
                className={`hover:text-black ${sort === "price-desc" ? "font-bold text-black underline" : ""}`}
              >
                Price: High to Low
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-base font-bold text-neutral-800 uppercase">
              No products found in this category.
            </p>
            <p className="text-xs text-neutral-500 mt-2">
              Try exploring all items or clear your current filter.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-6 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.slug} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer storeName={settings.storeName} tagline={settings.tagline} />
    </div>
  );
}
