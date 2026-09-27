"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductType } from "../types/product.types";
import { ProductCard } from "./ProductCard";

interface TrendingSectionProps {
  products: ProductType[];
}

export function TrendingSection({ products }: TrendingSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Responsive items calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(2); // Mobile: 2 items
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(3); // Tablet: 3 items
      } else {
        setItemsPerPage(6); // Desktop: 6 items (as in mockup)
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, totalPages - 1)));
  }, [totalPages]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  }, [totalPages]);

  // Keyboard navigation & drag
  const visibleProducts = products.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  return (
    <section className="py-14 md:py-20 bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Controls */}
        <div className="relative flex items-center justify-between mb-8 md:mb-10">
          <div className="flex-1 text-center">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-black font-mono">
              TRENDING NOW
            </h2>
            <div className="w-10 h-0.5 bg-black mx-auto mt-2" />
          </div>

          {/* Desktop Left/Right arrows on top-right */}
          {totalPages > 1 && (
            <div className="hidden sm:flex items-center gap-2 absolute right-0">
              <button
                type="button"
                onClick={handlePrev}
                className="w-8 h-8 rounded-full border border-neutral-300 hover:border-black hover:bg-neutral-100 flex items-center justify-center transition"
                aria-label="Previous trending slide"
              >
                <ChevronLeft className="w-4 h-4 text-black" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-8 h-8 rounded-full border border-neutral-300 hover:border-black hover:bg-neutral-100 flex items-center justify-center transition"
                aria-label="Next trending slide"
              >
                <ChevronRight className="w-4 h-4 text-black" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container with animated transitions */}
        <div className="relative">
          {/* Side arrow buttons for quick navigation */}
          {totalPages > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="sm:hidden absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/80 text-white rounded-full flex items-center justify-center shadow-md"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="sm:hidden absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/80 text-white rounded-full flex items-center justify-center shadow-md"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          <div
            ref={containerRef}
            className="transition-all duration-500 ease-in-out"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {(visibleProducts.length > 0 ? visibleProducts : products.slice(0, 6)).map(
                (product) => (
                  <ProductCard key={product._id || product.slug} product={product} />
                )
              )}
            </div>
          </div>
        </div>

        {/* Interactive Carousel Pagination Dots */}
        {totalPages > 1 ? (
          <div className="flex items-center justify-center gap-2 mt-8 md:mt-10">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 ${
                  currentIndex === idx
                    ? "bg-black w-6 h-2 rounded-full"
                    : "bg-neutral-300 hover:bg-neutral-400 w-2 h-2 rounded-full"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mt-8">
            <span className="w-2.5 h-2.5 bg-black rounded-full" />
            <span className="w-2 h-2 bg-neutral-300 rounded-full" />
            <span className="w-2 h-2 bg-neutral-300 rounded-full" />
          </div>
        )}
      </div>
    </section>
  );
}
