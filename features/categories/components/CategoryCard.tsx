"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryType } from "../types/category.types";

interface CategoryCardProps {
  category: CategoryType;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/shop/${category.slug}`}
      className="group relative block aspect-[3/4] w-full overflow-hidden bg-neutral-900 rounded-none shadow-xs"
    >
      {/* Category Image */}
      <Image
        src={category.image}
        alt={category.name}
        fill
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-95"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 group-hover:from-black/75 transition-colors" />

      {/* Content: Title & SHOP NOW button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 space-y-3">
        <h3 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-wider text-white drop-shadow-sm font-mono">
          {category.name}
        </h3>

        <div className="px-4 py-1.5 border border-white/60 bg-black/40 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-widest group-hover:bg-white group-hover:text-black group-hover:border-white transition duration-200">
          SHOP NOW
        </div>
      </div>
    </Link>
  );
}
