"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PromoCardType } from "../types/banner.types";

interface PromoCardsProps {
  cards: PromoCardType[];
}

export function PromoCards({ cards }: PromoCardsProps) {
  return (
    <section className="py-12 md:py-16 bg-[#fbfbfb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {cards.slice(0, 3).map((card, index) => (
            <div
              key={index}
              className="group relative h-[320px] sm:h-[360px] w-full overflow-hidden bg-neutral-900 shadow-sm flex flex-col justify-end"
            >
              {/* Background Image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-80"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Card Content Overlay */}
              <div className="relative z-10 p-6 md:p-8 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-300 block">
                  {card.tag}
                </span>

                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-mono">
                  {card.title}
                </h3>

                <div className="pt-2">
                  <Link
                    href={card.ctaLink || "/shop"}
                    className="inline-block bg-white text-black px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition duration-150 rounded-none shadow-md"
                  >
                    {card.ctaText || "EXPLORE"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
