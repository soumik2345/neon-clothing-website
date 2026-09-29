"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductType } from "../types/product.types";
import { ProductCarousel } from "@/components/ui/ProductCarousel";

interface CategoryShowcaseSectionProps {
  title: string;
  categorySlug?: string;
  products: ProductType[];
}

export function CategoryShowcaseSection({
  title,
  categorySlug,
  products,
}: CategoryShowcaseSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading - Exact same style as TRENDING NOW */}
        <div className="relative flex items-center justify-between mb-8 md:mb-12">
          <div className="flex-1 text-center">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-black font-mono">
              {title}
            </h2>
            <div className="w-10 h-0.5 bg-black mx-auto mt-2" />
          </div>

          {categorySlug && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block">
              <Link
                href={`/shop?category=${encodeURIComponent(categorySlug)}`}
                className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-black flex items-center gap-1 group transition"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {/* Embla Smooth Drag/Swipe Carousel (6 cards per view on desktop, matching Trending Now) */}
        <ProductCarousel
          products={products}
          slideClassName="flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_16.666%]"
          showControls={true}
          showDots={true}
        />

        {categorySlug && (
          <div className="mt-6 text-center md:hidden">
            <Link
              href={`/shop?category=${encodeURIComponent(categorySlug)}`}
              className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 hover:text-black underline underline-offset-4"
            >
              <span>View All {title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
