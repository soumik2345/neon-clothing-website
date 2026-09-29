"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  X,
  Check,
  ArrowUpDown,
  Filter,
  RotateCcw,
} from "lucide-react";
import { CategoryType } from "@/features/categories/types/category.types";
import { useSettings } from "@/features/settings/context/SettingsContext";

interface ShopFiltersProps {
  categories: CategoryType[];
  totalProducts: number;
  currentCategory: string;
  currentSort?: string;
  currentSearch?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

const SORT_OPTIONS = [
  { label: "Newest Drops", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Popular", value: "popular" },
];

export function ShopFilters({
  categories,
  totalProducts,
  currentCategory,
  currentSort = "newest",
  currentSearch = "",
  currentMinPrice,
  currentMaxPrice,
}: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { formatPrice } = useSettings();

  const priceRanges = React.useMemo(() => [
    { label: "All Prices", min: undefined, max: undefined },
    { label: `Under ${formatPrice(999)}`, min: 0, max: 999 },
    { label: `${formatPrice(1000)} - ${formatPrice(1999)}`, min: 1000, max: 1999 },
    { label: `${formatPrice(2000)} - ${formatPrice(2999)}`, min: 2000, max: 2999 },
    { label: `${formatPrice(3000)}+`, min: 3000, max: undefined },
  ], [formatPrice]);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Helper to update query params
  const updateQuery = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === "" || val === "all") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    // Reset to page 1 on filter change
    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchInput.trim() || undefined });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateQuery({ search: undefined });
  };

  const handlePriceSelect = (min?: number, max?: number) => {
    updateQuery({
      minPrice: min !== undefined ? String(min) : undefined,
      maxPrice: max !== undefined ? String(max) : undefined,
    });
  };

  const handleResetAll = () => {
    setSearchInput("");
    startTransition(() => {
      router.push(pathname);
    });
    setMobileDrawerOpen(false);
  };

  const activeFiltersCount =
    (currentCategory && currentCategory !== "all" ? 1 : 0) +
    (currentSearch ? 1 : 0) +
    (currentMinPrice !== undefined || currentMaxPrice !== undefined ? 1 : 0) +
    (currentSort && currentSort !== "newest" ? 1 : 0);

  // Find active price range label
  const activePriceRange = priceRanges.find((r) => {
    if (r.min === undefined && r.max === undefined) {
      return currentMinPrice === undefined && currentMaxPrice === undefined;
    }
    return (
      (r.min === undefined || String(r.min) === currentMinPrice) &&
      (r.max === undefined || String(r.max) === currentMaxPrice)
    );
  }) || { label: "Custom Price" };

  return (
    <div className="space-y-6 mb-8">
      {/* Search and Quick Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar with Streetwear Minimalist styling */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 max-w-md w-full"
        >
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search hoodies, tees, cargos, brands..."
            className="w-full pl-10 pr-9 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 focus:border-black text-xs font-medium rounded-xs outline-none transition"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Desktop Price & Sort Selectors + Mobile Drawer Trigger */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          {/* Mobile Filter & Sort Button */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer active:scale-98 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter &amp; Sort</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-black text-[10px] font-mono flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Desktop Price Range Selector */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-neutral-500 font-medium uppercase text-[11px] tracking-wider">
              Price:
            </span>
            <select
              value={activePriceRange.label}
              onChange={(e) => {
                const target = priceRanges.find((r) => r.label === e.target.value);
                if (target) handlePriceSelect(target.min, target.max);
              }}
              className="py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xs text-xs font-semibold text-neutral-800 outline-none focus:border-black cursor-pointer uppercase"
            >
              {priceRanges.map((r) => (
                <option key={r.label} value={r.label}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Sort Selector */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-neutral-500 font-medium uppercase text-[11px] tracking-wider">
              Sort:
            </span>
            <select
              value={currentSort}
              onChange={(e) => updateQuery({ sort: e.target.value })}
              className="py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xs text-xs font-semibold text-neutral-800 outline-none focus:border-black cursor-pointer uppercase"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Category Chips (Mobile-First Touch Friendly) */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          <button
            onClick={() => updateQuery({ category: undefined })}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs whitespace-nowrap transition cursor-pointer shrink-0 border ${
              !currentCategory || currentCategory === "all"
                ? "bg-black text-white border-black shadow-xs"
                : "bg-white text-neutral-700 border-neutral-200 hover:border-black hover:text-black"
            }`}
          >
            All Drops
          </button>

          {categories.map((c) => {
            const isSelected =
              currentCategory?.toLowerCase() === c.slug.toLowerCase();
            return (
              <button
                key={c.slug}
                onClick={() => updateQuery({ category: c.slug })}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs whitespace-nowrap transition cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? "bg-black text-white border-black shadow-xs"
                    : "bg-white text-neutral-700 border-neutral-200 hover:border-black hover:text-black"
                }`}
              >
                <span>{c.name}</span>
                {typeof c.itemCount === "number" && c.itemCount > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? "bg-neutral-800 text-neutral-300"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {c.itemCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filters Pill Bar & Results Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-neutral-500 border-t border-neutral-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-neutral-400 font-mono">
            <strong className="text-black font-mono">{totalProducts}</strong> items found
          </span>

          {activeFiltersCount > 0 && (
            <>
              <span className="text-neutral-300">•</span>
              {currentCategory && currentCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 text-black text-[11px] font-bold uppercase rounded-xs">
                  {currentCategory}
                  <button
                    onClick={() => updateQuery({ category: undefined })}
                    className="hover:text-red-600 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(currentMinPrice !== undefined || currentMaxPrice !== undefined) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 text-black text-[11px] font-bold uppercase rounded-xs font-mono">
                  {activePriceRange.label}
                  <button
                    onClick={() => handlePriceSelect(undefined, undefined)}
                    className="hover:text-red-600 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {currentSearch && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 text-black text-[11px] font-bold uppercase rounded-xs">
                  &ldquo;{currentSearch}&rdquo;
                  <button
                    onClick={handleClearSearch}
                    className="hover:text-red-600 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetAll}
                className="text-[11px] font-bold uppercase text-red-600 hover:underline flex items-center gap-1 ml-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Clear all
              </button>
            </>
          )}
        </div>

        {isPending && (
          <span className="text-neutral-400 text-[11px] font-mono animate-pulse">
            Filtering drops...
          </span>
        )}
      </div>

      {/* Mobile Filter & Sort Drawer / Bottom Sheet */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="relative bg-white w-full rounded-t-xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-black" />
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-black">
                  Filters &amp; Sort
                </h3>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 text-neutral-400 hover:text-black rounded-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-5 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Categories */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateQuery({ category: undefined })}
                    className={`p-2.5 text-xs font-bold uppercase rounded-xs text-left border transition ${
                      !currentCategory || currentCategory === "all"
                        ? "bg-black text-white border-black"
                        : "bg-neutral-50 text-neutral-800 border-neutral-200"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((c) => {
                    const isSelected =
                      currentCategory?.toLowerCase() === c.slug.toLowerCase();
                    return (
                      <button
                        key={c.slug}
                        onClick={() => updateQuery({ category: c.slug })}
                        className={`p-2.5 text-xs font-bold uppercase rounded-xs text-left border transition flex items-center justify-between ${
                          isSelected
                            ? "bg-black text-white border-black"
                            : "bg-neutral-50 text-neutral-800 border-neutral-200"
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        {typeof c.itemCount === "number" && (
                          <span
                            className={`text-[10px] font-mono ${
                              isSelected ? "text-neutral-300" : "text-neutral-400"
                            }`}
                          >
                            {c.itemCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
                  Price Range
                </label>
                <div className="space-y-1.5">
                  {priceRanges.map((r) => {
                    const isSelected = activePriceRange.label === r.label;
                    return (
                      <button
                        key={r.label}
                        onClick={() => handlePriceSelect(r.min, r.max)}
                        className={`w-full p-2.5 rounded-xs text-xs font-bold uppercase flex items-center justify-between border transition ${
                          isSelected
                            ? "bg-black text-white border-black font-mono"
                            : "bg-neutral-50 text-neutral-700 border-neutral-200"
                        }`}
                      >
                        <span>{r.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
                  Sort Order
                </label>
                <div className="space-y-1.5">
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = currentSort === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => updateQuery({ sort: opt.value })}
                        className={`w-full p-2.5 rounded-xs text-xs font-bold uppercase flex items-center justify-between border transition ${
                          isSelected
                            ? "bg-black text-white border-black"
                            : "bg-neutral-50 text-neutral-700 border-neutral-200"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetAll}
                className="w-1/3 py-3 border border-neutral-300 text-black text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-neutral-100 transition"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-neutral-800 transition"
              >
                Show Results ({totalProducts})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
