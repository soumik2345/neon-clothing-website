"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroBannerType } from "../types/banner.types";

interface HeroBannerProps {
  hero: HeroBannerType;
}

export function HeroBanner({ hero }: HeroBannerProps) {
  return (
    <section className="relative bg-[#0c0c0c] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px] md:min-h-[580px] lg:min-h-[640px] items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-6 py-12 md:py-16 lg:py-24 z-10 space-y-6">
            <span className="inline-block text-[11px] md:text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase">
              {hero.tag || "NEW ARRIVALS"}
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[0.95] text-white whitespace-pre-line font-mono">
              {hero.title || "THRIFTED.\nCURATED."}
            </h1>

            <p className="text-neutral-400 text-xs sm:text-sm md:text-base max-w-md leading-relaxed">
              {hero.subtitle ||
                "Premium thrifted pieces. Handpicked for quality. Priced for you."}
            </p>

            <div className="pt-2">
              <Link
                href={hero.ctaLink || "/shop"}
                className="inline-block bg-white text-black px-8 py-3.5 text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition duration-200 shadow-lg rounded-xs"
              >
                {hero.ctaText || "SHOP NOW"}
              </Link>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-6 relative h-[420px] sm:h-[500px] md:h-[580px] lg:h-full w-full flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg h-full max-h-[580px] overflow-hidden">
              <Image
                src={hero.image}
                alt="NEON Streetwear Collection"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Subtle gradient vignette to blend into dark background */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0c0c0c] lg:via-transparent lg:to-transparent opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
