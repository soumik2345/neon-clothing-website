"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import { ProductType } from "@/features/products/types/product.types";
import { useSettings } from "@/features/settings/context/SettingsContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { formatPrice } = useSettings();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success) {
          setResults(json.data.slice(0, 6));
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-start justify-center pt-20 px-4">
        <div className="relative w-full max-w-2xl bg-white rounded-none shadow-2xl p-6 overflow-hidden">
          <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
            <Search className="w-5 h-5 text-neutral-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search by product name, category or style..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm md:text-base outline-none text-neutral-900 placeholder-neutral-400"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-xs text-neutral-400 hover:text-neutral-700"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-neutral-900 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="py-12 text-center text-xs text-neutral-400">Searching inventory...</div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((product) => (
                  <Link
                    key={product._id || product.id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 hover:bg-neutral-50 transition border border-transparent hover:border-neutral-100 rounded-xs"
                  >
                    <div className="relative w-14 h-16 bg-neutral-100 shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-tight text-neutral-900 truncate">
                        {product.title}
                      </p>
                      <p className="text-[11px] text-neutral-500 uppercase">{product.category}</p>
                      <p className="text-xs font-bold text-neutral-900 mt-1">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="py-10 text-center">
                <p className="text-sm font-medium text-neutral-600">No matching streetwear found.</p>
                <p className="text-xs text-neutral-400 mt-1">Try searching for &quot;Hoodie&quot;, &quot;Tee&quot;, or &quot;Pants&quot;</p>
              </div>
            ) : (
              <div className="py-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Hoodies", "Chaos Club", "Cargo Pants", "Vintage Washed", "Jackets", "Caps"].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-xs transition"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="mt-4 pt-3 border-t border-neutral-100 text-right">
              <Link
                href={`/shop?search=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:underline inline-flex items-center gap-1"
              >
                View all results ({results.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
