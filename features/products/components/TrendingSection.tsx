"use client";

import React from "react";
import { ProductType } from "../types/product.types";
import { ProductCarousel } from "@/components/ui/ProductCarousel";

interface TrendingSectionProps {
  products: ProductType[];
}

export function TrendingSection({ products }: TrendingSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="relative flex items-center justify-between mb-8 md:mb-12">
          <div className="flex-1 text-center">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-black font-mono">
              TRENDING NOW
            </h2>
            <div className="w-10 h-0.5 bg-black mx-auto mt-2" />
          </div>
        </div>

        {/* Embla Smooth Drag/Swipe Carousel (6 cards per view on desktop, matching mockup) */}
        <ProductCarousel
          products={products}
          slideClassName="flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_16.666%]"
          showControls={true}
          showDots={true}
        />
      </div>
    </section>
  );
}
