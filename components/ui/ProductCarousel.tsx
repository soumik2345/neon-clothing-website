"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductType } from "@/features/products/types/product.types";
import { ProductCard } from "@/features/products/components/ProductCard";

interface ProductCarouselProps {
  products: ProductType[];
  slideClassName?: string;
  showControls?: boolean;
  showDots?: boolean;
}

export function ProductCarousel({
  products,
  slideClassName = "flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_16.666%]",
  showControls = true,
  showDots = true,
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    slidesToScroll: 1,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="relative group/carousel">
      {/* Top Controls when used in custom headers */}
      {showControls && (
        <div className="hidden sm:flex items-center gap-2 absolute -top-14 right-0 z-10">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className="w-8 h-8 rounded-full border border-neutral-300 hover:border-black hover:bg-neutral-100 flex items-center justify-center transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 text-black" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className="w-8 h-8 rounded-full border border-neutral-300 hover:border-black hover:bg-neutral-100 flex items-center justify-center transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 text-black" />
          </button>
        </div>
      )}

      {/* Embla Viewport */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing select-none" ref={emblaRef}>
        <div className="flex -ml-3 sm:-ml-4">
          {products.map((product, idx) => (
            <div
              key={product._id || product.slug || idx}
              className={`min-w-0 pl-3 sm:pl-4 shrink-0 ${slideClassName}`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Touch Overlay Arrows (visible on hover or swipe) */}
      <button
        type="button"
        onClick={scrollPrev}
        disabled={prevBtnDisabled}
        className="sm:hidden absolute left-1 top-1/3 -translate-y-1/2 z-20 w-8 h-8 bg-black/80 text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-0 transition"
        aria-label="Previous"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={scrollNext}
        disabled={nextBtnDisabled}
        className="sm:hidden absolute right-1 top-1/3 -translate-y-1/2 z-20 w-8 h-8 bg-black/80 text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-0 transition"
        aria-label="Next"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dot Indicators */}
      {showDots && scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                index === selectedIndex
                  ? "w-8 bg-black"
                  : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
