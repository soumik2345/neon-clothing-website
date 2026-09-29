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
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

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
                className="flex-[0_0_100%] min-w-0 relative transition-colors duration-500"
                style={{ backgroundColor: bgColor }}
              >
                {/* Background Watermark/Texture for Solid Color Slides */}
                {isSolidColor && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
                    <span className="absolute -right-6 sm:-right-10 -bottom-6 sm:-bottom-10 text-[24vw] lg:text-[18vw] font-black font-mono tracking-tighter uppercase leading-none select-none text-white">
                      NEON
                    </span>
                  </div>
                )}

                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-12 min-h-[220px] xs:min-h-[250px] sm:min-h-[360px] md:min-h-[480px] lg:min-h-[580px] items-center gap-2 sm:gap-6 lg:gap-8 py-3 xs:py-4 sm:py-8 lg:py-16">
                    {/* Left Typography & CTAs (side-by-side like desktop) */}
                    <div className="col-span-7 sm:col-span-7 lg:col-span-6 z-10 space-y-1.5 xs:space-y-2 sm:space-y-4 lg:space-y-6 text-left flex flex-col items-start">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span
                          className={`inline-block text-[8px] xs:text-[9px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.25em] uppercase px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-xs font-mono ${
                            isDarkText
                              ? "bg-black/10 text-black"
                              : "bg-white/10 text-neutral-300"
                          }`}
                        >
                          {slide.tag || "NEW ARRIVALS"}
                        </span>

                        {isSolidColor && (
                          <span
                            className={`text-[7px] xs:text-[8px] sm:text-[10px] font-mono tracking-widest uppercase ${
                              isDarkText ? "text-neutral-600" : "text-neutral-400"
                            }`}
                          >
                            EXCLUSIVE DROP
                          </span>
                        )}
                      </div>

                      <h1
                        className={`text-base xs:text-lg sm:text-3xl md:text-5xl lg:text-7xl font-black tracking-tight uppercase leading-[0.98] sm:leading-[0.95] whitespace-pre-line font-mono ${
                          isDarkText ? "text-black" : "text-white"
                        }`}
                      >
                        {slide.title || "THRIFTED.\nCURATED."}
                      </h1>

                      <p
                        className={`text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base max-w-xs sm:max-w-md leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none ${
                          isDarkText ? "text-neutral-700" : "text-neutral-300"
                        }`}
                      >
                        {slide.subtitle ||
                          "Premium thrifted pieces. Handpicked for quality. Priced for you."}
                      </p>

                      <div className="pt-0.5 sm:pt-2">
                        <Link
                          href={slide.ctaLink || "/shop"}
                          className={`inline-flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 px-3 py-1.5 xs:px-4 xs:py-2 sm:px-8 sm:py-3.5 text-[8px] xs:text-[9px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition duration-200 shadow-sm rounded-xs group/btn ${
                            isDarkText
                              ? "bg-black text-white hover:bg-neutral-800"
                              : "bg-white text-black hover:bg-neutral-200"
                          }`}
                        >
                          <span>{slide.ctaText || "SHOP NOW"}</span>
                          <ArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>

                    {/* Right Visual Image */}
                    <div className="col-span-5 sm:col-span-5 lg:col-span-6 relative h-[180px] xs:h-[210px] sm:h-[320px] md:h-[440px] lg:h-[520px] w-full flex items-center justify-end">
                      {slide.image ? (
                        <div className="relative w-full h-full max-h-[190px] xs:max-h-[220px] sm:max-h-[340px] md:max-h-[460px] lg:max-h-[560px] overflow-hidden rounded-xs">
                          <Image
                            src={slide.image}
                            alt={slide.title.replace("\n", " ")}
                            fill
                            priority={index === 0}
                            className="object-cover object-center transition-transform duration-700 hover:scale-105"
                            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 50vw, 50vw"
                          />
                          {/* Gradient fade to merge smoothly with background */}
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: `linear-gradient(to top, ${bgColor} 0%, transparent 30%), linear-gradient(to right, ${bgColor} 0%, transparent 20%)`,
                            }}
                          />
                        </div>
                      ) : (
                        /* If no image and solid color, show prominent graphic card */
                        <div className="w-full max-w-xs aspect-4/5 border border-white/20 p-2.5 xs:p-4 sm:p-8 flex flex-col justify-between rounded-xs bg-white/5 backdrop-blur-xs">
                          <div className="text-[7px] xs:text-[8px] sm:text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                            NEON &bull; STREETWEAR
                          </div>
                          <div className="space-y-1 sm:space-y-2">
                            <span className="text-xs xs:text-sm sm:text-2xl md:text-3xl font-black font-mono tracking-tight uppercase text-white">
                              VINTAGE
                            </span>
                            <p className="text-[8px] xs:text-[9px] sm:text-xs text-neutral-400 line-clamp-2">
                              Hand-sourced, verified authentic.
                            </p>
                          </div>
                          <div className="h-0.5 bg-white/20 w-8 sm:w-16" />
                        </div>
                      )}
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
