"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductType } from "../types/product.types";
import { ProductCard } from "./ProductCard";

interface CategoryShowcaseSectionProps {
  title: string;
  subtitle?: string;
  categorySlug: string;
  products: ProductType[];
  limit?: number;
}

export function CategoryShowcaseSection({
  title,
  subtitle,
  categorySlug,
  products,
}: CategoryShowcaseSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-[#f9f9f9] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 pb-4 border-b border-neutral-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
              CATEGORY SPOTLIGHT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black font-mono">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-neutral-500 mt-1 max-w-md">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href={`/shop?category=${encodeURIComponent(categorySlug)}`}
            className="text-xs font-bold uppercase tracking-wider text-black hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto group"
          >
            <span>View All {categorySlug.toUpperCase()}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product._id || product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
