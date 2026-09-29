import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/features/products/components/ProductCard";
import { ShopFilters } from "@/features/products/components/ShopFilters";
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
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, sort, search, minPrice, maxPrice, page } = await searchParams;

  const minPriceNum = minPrice !== undefined && minPrice !== "" ? Number(minPrice) : undefined;
  const maxPriceNum = maxPrice !== undefined && maxPrice !== "" ? Number(maxPrice) : undefined;

  const [allMatchingProducts, categories, banners, settings] = await Promise.all([
    getProducts({
      category: category && category !== "all" ? category : undefined,
      sort,
      search,
      minPrice: minPriceNum,
      maxPrice: maxPriceNum,
      limit: 1000,
    }),
    getCategories(),
    getBanners(),
    getSettings(),
  ]);

  const activeCategory = category || "all";
  const ITEMS_PER_PAGE = 12;
  const totalProducts = allMatchingProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));
  const currentPage = Math.max(1, Math.min(Number(page) || 1, totalPages));

  const paginatedProducts = allMatchingProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const buildPageLink = (pageNum: number) => {
    const params = new URLSearchParams();
    if (category && category !== "all") params.set("category", category);
    if (sort) params.set("sort", sort);
    if (search) params.set("search", search);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (pageNum > 1) params.set("page", String(pageNum));
    const qs = params.toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header
        announcementText={banners.announcementText}
        storeName={settings.storeName}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* Page Title */}
        <div className="text-center mb-8">
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

        {/* Custom Mobile-Friendly Shop Filter & Sort System */}
        <ShopFilters
          categories={categories}
          totalProducts={totalProducts}
          currentCategory={activeCategory}
          currentSort={sort}
          currentSearch={search}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
        />

        {/* Product Grid */}
        {paginatedProducts.length === 0 ? (
          <div className="py-24 text-center bg-white border border-neutral-200 rounded-xs shadow-2xs p-8 my-6">
            <p className="text-base font-bold text-neutral-800 uppercase font-mono">
              No products found matching your criteria.
            </p>
            <p className="text-xs text-neutral-500 mt-2">
              Try adjusting your price range, search query, or selected category.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-6 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-neutral-800 transition"
            >
              Reset Filters &amp; View All
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product._id || product.slug} product={product} />
            ))}
          </div>
        )}

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="mt-14 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-neutral-500 font-mono">
              Page <strong className="text-black">{currentPage}</strong> of{" "}
              <strong className="text-black">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              {/* Previous Button */}
              {currentPage > 1 ? (
                <Link
                  href={buildPageLink(currentPage - 1)}
                  className="px-3.5 py-2 text-xs font-mono font-bold uppercase border border-neutral-300 hover:border-black text-neutral-800 hover:text-black bg-white transition rounded-xs"
                >
                  &larr; Prev
                </Link>
              ) : (
                <span className="px-3.5 py-2 text-xs font-mono font-bold uppercase border border-neutral-200 text-neutral-300 bg-neutral-50 cursor-not-allowed rounded-xs">
                  &larr; Prev
                </span>
              )}

              {/* Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isCurrent = pageNum === currentPage;
                // Show first, last, current, and pages adjacent to current
                if (
                  totalPages > 7 &&
                  pageNum !== 1 &&
                  pageNum !== totalPages &&
                  Math.abs(pageNum - currentPage) > 1
                ) {
                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return (
                      <span key={pageNum} className="px-2 text-xs text-neutral-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <Link
                    key={pageNum}
                    href={buildPageLink(pageNum)}
                    className={`min-w-9 h-9 flex items-center justify-center text-xs font-mono font-bold transition rounded-xs border ${
                      isCurrent
                        ? "bg-black text-white border-black shadow-xs"
                        : "bg-white text-neutral-800 border-neutral-300 hover:border-black"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              {/* Next Button */}
              {currentPage < totalPages ? (
                <Link
                  href={buildPageLink(currentPage + 1)}
                  className="px-3.5 py-2 text-xs font-mono font-bold uppercase border border-neutral-300 hover:border-black text-neutral-800 hover:text-black bg-white transition rounded-xs"
                >
                  Next &rarr;
                </Link>
              ) : (
                <span className="px-3.5 py-2 text-xs font-mono font-bold uppercase border border-neutral-200 text-neutral-300 bg-neutral-50 cursor-not-allowed rounded-xs">
                  Next &rarr;
                </span>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer storeName={settings.storeName} tagline={settings.tagline} />
    </div>
  );
}
