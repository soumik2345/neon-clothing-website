"use client";

import React from "react";
import { CategoryType } from "../types/category.types";
import { CategoryCard } from "./CategoryCard";

interface CategoryGridProps {
  categories: CategoryType[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-14 md:py-18 bg-[#fbfbfb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-black font-mono">
            SHOP BY CATEGORY
          </h2>
          <div className="w-10 h-0.5 bg-black mx-auto mt-2" />
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
          {categories.slice(0, 5).map((category) => (
            <CategoryCard key={category._id || category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
