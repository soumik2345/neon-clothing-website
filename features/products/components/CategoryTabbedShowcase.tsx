"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductType } from "../types/product.types";
import { ProductCard } from "./ProductCard";

export interface CategoryTabData {
  categorySlug: string;
  label: string;
  products: ProductType[];
}

interface CategoryTabbedShowcaseProps {
  tag?: string;
  title: string;
  subtitle?: string;
  tabs: CategoryTabData[];
}

export function CategoryTabbedShowcase({
  tag = "CURATED DROPS & COLLABS",
  title = "EXPLORE BY CATEGORY",
  subtitle = "Select a category to view handpicked streetwear pieces",
  tabs,
}: CategoryTabbedShowcaseProps) {
  // Filter tabs that have products or are valid
  const activeTabs = tabs.filter((t) => t.categorySlug);
  const [selectedSlug, setSelectedSlug] = useState<string>(
    activeTabs[0]?.categorySlug || "all"
  );

  if (!activeTabs || activeTabs.length === 0) return null;

  // Selected tab data
  const currentTab =
    activeTabs.find((t) => t.categorySlug === selectedSlug) || activeTabs[0];
  const currentProducts = currentTab?.products || [];

  return (
    <section className="py-14 md:py-20 bg-white border-b border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
          {tag && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-black text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest rounded-full">
              <Sparkles className="w-3 h-3 text-black" />
              {tag}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black font-mono">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
              {subtitle}
            </p>
          )}
          <div className="w-12 h-0.5 bg-black mx-auto mt-2" />
        </div>

        {/* Interactive Category Tabs / Pills */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {activeTabs.map((tab) => {
            const isSelected = tab.categorySlug === selectedSlug;
            return (
              <button
                key={tab.categorySlug}
                type="button"
                onClick={() => setSelectedSlug(tab.categorySlug)}
                className={`shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-xs font-mono font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-black text-white shadow-xs scale-102"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black"
                }`}
              >
                {tab.label || tab.categorySlug.toUpperCase()}
                <span className="ml-1.5 text-[10px] opacity-60">
                  ({tab.products.length})
                </span>
              </button>
            );
          })}
        </div>

        {/* Multi-Column Product Display */}
        {currentProducts.length === 0 ? (
          <div className="py-16 text-center bg-neutral-50 border border-neutral-200 rounded-xs space-y-3">
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
              No products found in this category collection
            </p>
            <Link
              href="/shop"
              className="inline-block px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 rounded-xs"
            >
              Browse All Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5 animate-in fade-in duration-300">
            {currentProducts.map((product) => (
              <ProductCard
                key={product._id || product.id || product.slug}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Bottom Action Footer */}
        {currentTab && (
          <div className="mt-10 sm:mt-12 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Showing {currentProducts.length} curated pieces from {currentTab.label || currentTab.categorySlug}
            </p>

            <Link
              href={`/shop?category=${encodeURIComponent(currentTab.categorySlug)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-black text-black hover:bg-black hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition group cursor-pointer"
            >
              <span>Explore All {currentTab.label || currentTab.categorySlug}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
