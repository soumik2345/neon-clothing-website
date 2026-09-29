import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCategories } from "@/features/categories/services/category.service";
import { getBanners } from "@/features/banners/services/banner.service";
import { getSettings } from "@/features/settings/services/settings.service";
import { getProducts } from "@/features/products/services/product.service";

export const revalidate = 0;

export default async function CollectionsPage() {
  const [categories, banners, settings, allProducts] = await Promise.all([
    getCategories(),
    getBanners(),
    getSettings(),
    getProducts({ limit: 500 }),
  ]);

  // Compute live product count per category
  const countMap = new Map<string, number>();
  for (const p of allProducts) {
    const slug = p.category?.toLowerCase() || "";
    countMap.set(slug, (countMap.get(slug) || 0) + 1);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header
        announcementText={banners.announcementText}
        storeName={settings.storeName}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full">
        {/* Page Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-[0.25em] font-mono mb-3 rounded-xs">
            <Layers className="w-3.5 h-3.5" />
            <span>CURATED ARCHIVES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black font-mono">
            ALL COLLECTIONS
          </h1>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3 mb-3" />
          <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
            Explore our curated streetwear archives by category. Handpicked vintage hoodies, distressed oversized tees, technical cargos, and outerwear.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((c) => {
            const count = countMap.get(c.slug.toLowerCase()) ?? c.itemCount ?? 0;
            return (
              <Link
                key={c.slug}
                href={`/shop?category=${encodeURIComponent(c.slug)}`}
                className="group relative flex flex-col overflow-hidden bg-neutral-900 border border-neutral-200/80 rounded-xs shadow-xs hover:border-black transition duration-300"
              >
                {/* Category Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-800">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono text-xs uppercase">
                      No Image
                    </div>
                  )}

                  {/* Gradient Overlay for streetwear dark aesthetic */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                  {/* Top Badge: Item Count */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-white/90 text-black backdrop-blur-xs rounded-2xs">
                      {count} {count === 1 ? "PIECE" : "PIECES"}
                    </span>
                  </div>

                  {/* Bottom Category Info */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 space-y-1 sm:space-y-1.5 text-left">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400 block">
                      COLLECTION
                    </span>
                    <h2 className="text-base sm:text-xl font-black uppercase tracking-tight text-white font-mono group-hover:text-neutral-200 transition-colors">
                      {c.name}
                    </h2>
                    {c.description && (
                      <p className="text-[10px] sm:text-xs text-neutral-300 line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {c.description}
                      </p>
                    )}

                    <div className="pt-2 flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-white">
                      <span>View Products</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Banner to Explore All Products */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-10 bg-neutral-100 border border-neutral-200 rounded-xs text-center space-y-3">
          <h3 className="text-base sm:text-xl font-black uppercase tracking-tight text-black font-mono">
            Looking for something specific?
          </h3>
          <p className="text-xs text-neutral-600 max-w-md mx-auto">
            Browse our entire inventory with instant search, sorting, and price filters.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition rounded-xs"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer storeName={settings.storeName} tagline={settings.tagline} />
    </div>
  );
}
