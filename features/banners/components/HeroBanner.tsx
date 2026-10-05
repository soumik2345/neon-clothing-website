"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { HeroBannerType, HeroSlideType } from "../types/banner.types";

interface HeroBannerProps {
  hero: HeroBannerType;
  slides?: HeroSlideType[];
}

export function HeroBanner({ hero, slides }: HeroBannerProps) {
  // Normalize slides: use slides if available, else fallback to hero as single slide
  const activeSlides: HeroSlideType[] =
    slides && slides.length > 0
      ? slides
      : [
          {
            tag: hero.tag || "NEW ARRIVALS",
            title: hero.title || "THRIFTED.\nCURATED.",
            subtitle:
              hero.subtitle ||
              "Premium thrifted pieces. Handpicked for quality. Priced for you.",
            ctaText: hero.ctaText || "SHOP NOW",
            ctaLink: hero.ctaLink || "/shop",
            bgType: "image",
            image: hero.image,
            bgColor: "#0c0c0c",
            textColor: "white",
          },
        ];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: activeSlides.length > 1,
    align: "start",
    duration: 35,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Autoplay functionality (5.5s per slide)
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused || !emblaApi) return;

    autoplayTimerRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, 5500);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [emblaApi, isPaused, activeSlides.length, selectedIndex]);

  return (
    <section
      className="relative overflow-hidden group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Homepage Hero Carousel"
    >
      {/* Embla Viewport with touch-pan-y for smooth native mobile vertical scroll */}
      <div className="overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex">
          {activeSlides.map((slide, index) => {
            const isSolidColor = slide.bgType === "color";
            const bgColor = slide.bgColor || "#0c0c0c";
            const isDarkText = slide.textColor === "black";

            return (
              <div
                key={slide.id || index}
                className="flex-[0_0_100%] min-w-0 relative overflow-hidden transition-colors duration-500"
                style={{ backgroundColor: bgColor }}
              >
                {/* Full Background Image */}
                {slide.image && (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={slide.image}
                      alt={slide.title.replace("\n", " ")}
                      fill
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      className="object-cover object-center transition-transform duration-700 hover:scale-105"
                      sizes="100vw"
                    />
                    {/* Dark gradient overlay for crystal-clear readability */}
                    <div className="absolute inset-0 bg-black/55" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                  </div>
                )}

                {/* Background Watermark for Solid Color Mode */}
                {isSolidColor && !slide.image && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
                    <span className="absolute -right-6 sm:-right-10 -bottom-6 sm:-bottom-10 text-[24vw] lg:text-[18vw] font-black font-mono tracking-tighter uppercase leading-none select-none text-white">
                      NEON
                    </span>
                  </div>
                )}

                {/* Foreground Content Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="min-h-[320px] xs:min-h-[360px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[580px] flex flex-col justify-center py-8 sm:py-12 lg:py-16 text-left max-w-2xl space-y-2 sm:space-y-4 lg:space-y-5">
                    {/* Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block text-[9px] sm:text-xs font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-xs font-mono ${
                          isDarkText && !slide.image
                            ? "bg-black/10 text-black"
                            : "bg-white text-black shadow-xs"
                        }`}
                      >
                        {slide.tag || "NEW ARRIVALS"}
                      </span>

                      {isSolidColor && !slide.image && (
                        <span
                          className={`text-[9px] sm:text-[10px] font-mono tracking-widest uppercase ${
                            isDarkText ? "text-neutral-600" : "text-neutral-400"
                          }`}
                        >
                          EXCLUSIVE DROP
                        </span>
                      )}
                    </div>

                    {/* Headline */}
                    <h1
                      className={`text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[0.95] whitespace-pre-line font-mono ${
                        isDarkText && !slide.image ? "text-black" : "text-white"
                      }`}
                    >
                      {slide.title || "THRIFTED.\nCURATED."}
                    </h1>

                    {/* Subtitle */}
                    {slide.subtitle ? (
                      <p
                        className={`text-xs sm:text-sm md:text-base max-w-xl leading-relaxed ${
                          isDarkText && !slide.image ? "text-neutral-700" : "text-neutral-200"
                        }`}
                      >
                        {slide.subtitle}
                      </p>
                    ) : null}

                    {/* CTA Button */}
                    <div className="pt-2 sm:pt-4">
                      <Link
                        href={slide.ctaLink || "/shop"}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-black uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition duration-200 shadow-md rounded-none group/btn cursor-pointer"
                      >
                        <span>{slide.ctaText || "SHOP NOW"}</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Hover Navigation Controls */}
      {activeSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className="hidden sm:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/60 hover:bg-black text-white rounded-full items-center justify-center transition border border-white/20 opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
            aria-label="Previous Hero Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            className="hidden sm:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/60 hover:bg-black text-white rounded-full items-center justify-center transition border border-white/20 opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
            aria-label="Next Hero Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots / Progress Bars */}
          <div className="absolute bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-2">
            {activeSlides.map((_, idx) => {
              const isCurrent = selectedIndex === idx;
              const currentSlide = activeSlides[selectedIndex];
              const isBlackText = currentSlide?.textColor === "black";

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollTo(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isCurrent
                      ? isBlackText
                        ? "w-4 sm:w-8 h-1 sm:h-2 bg-black"
                        : "w-4 sm:w-8 h-1 sm:h-2 bg-white"
                      : isBlackText
                      ? "w-1.5 sm:w-2.5 h-1 sm:h-2 bg-black/30 hover:bg-black/60"
                      : "w-1.5 sm:w-2.5 h-1 sm:h-2 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
