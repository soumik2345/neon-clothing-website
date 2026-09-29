"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryType } from "../types/category.types";
import { CategoryCard } from "./CategoryCard";

interface CategoryGridProps {
  categories: CategoryType[];
  title?: string;
  subtitle?: string;
}

export function CategoryGrid({
  categories,
  title = "SHOP BY CATEGORY",
  subtitle,
}: CategoryGridProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: categories.length > 3,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Gentle auto-slide for mobile slider (every 3.8s, pauses on touch/hover)
  useEffect(() => {
    if (!emblaApi || categories.length <= 2) return;

    let timer: ReturnType<typeof setInterval> | null = null;

    const startTimer = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        if (emblaApi) {
          emblaApi.scrollNext();
        }
      }, 3800);
    };

    const stopTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    startTimer();

    emblaApi.on("pointerDown", stopTimer);
    emblaApi.on("pointerUp", startTimer);

    return () => {
      stopTimer();
      emblaApi.off("pointerDown", stopTimer);
      emblaApi.off("pointerUp", startTimer);
    };
  }, [emblaApi, categories.length]);

  if (!categories || categories.length === 0) return null;

  // Determine dynamic grid columns for desktop based on item count
  const desktopGridClass =
    categories.length === 5
      ? "md:grid-cols-5"
      : categories.length === 6
      ? "md:grid-cols-3 lg:grid-cols-6"
      : categories.length === 4
      ? "md:grid-cols-4"
      : "md:grid-cols-3 lg:grid-cols-5";

  return (
    <section className="py-12 md:py-18 bg-[#fbfbfb] border-b border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with navigation controls for mobile */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div className="flex-1 text-center md:text-center">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-black font-mono">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-neutral-500 font-mono mt-1 uppercase tracking-wider">
                {subtitle}
              </p>
            )}
            <div className="w-10 h-0.5 bg-black mx-auto mt-2" />
          </div>

          {/* Mobile slide buttons at top right */}
          <div className="flex md:hidden items-center gap-1.5 absolute right-4 sm:right-6">
            <button
              type="button"
              onClick={scrollPrev}
              className="w-7 h-7 rounded-full bg-white border border-neutral-300 shadow-2xs flex items-center justify-center hover:bg-black hover:text-white transition cursor-pointer"
              aria-label="Previous category"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="w-7 h-7 rounded-full bg-white border border-neutral-300 shadow-2xs flex items-center justify-center hover:bg-black hover:text-white transition cursor-pointer"
              aria-label="Next category"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 1. Mobile Slider (< md): Shows 2 to 3 cards visible initially, smooth swipe & auto-slide */}
        <div className="block md:hidden">
          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing select-none touch-pan-y -mx-4 px-4 sm:-mx-6 sm:px-6"
            ref={emblaRef}
          >
            <div className="flex gap-3 sm:gap-4">
              {categories.map((category) => (
                <div
                  key={category._id || category.slug}
                  className="flex-[0_0_44%] sm:flex-[0_0_32%] min-w-0"
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile slide indicators / dots */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {categories.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => emblaApi?.scrollTo(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  selectedIndex === idx
                    ? "w-6 bg-black"
                    : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 2. Desktop High-Fashion Grid (>= md): Clean 5 or 6 column layout */}
        <div className={`hidden md:grid ${desktopGridClass} gap-4 md:gap-5`}>
          {categories.map((category) => (
            <CategoryCard key={category._id || category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
