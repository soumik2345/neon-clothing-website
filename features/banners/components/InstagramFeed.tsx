"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import { InstagramPostType } from "../types/banner.types";

interface InstagramFeedProps {
  posts: InstagramPostType[];
  handle?: string;
}

export function InstagramFeed({
  posts,
  handle = "@neon.thrift",
}: InstagramFeedProps) {
  const [startIndex, setStartIndex] = useState(0);
  const itemsVisible = 8;

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % Math.max(1, posts.length - 3));
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <section className="bg-[#0c0c0c] text-white py-6 border-t border-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Header */}
          <div className="shrink-0 space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-300">
              FOLLOW US ON INSTAGRAM
            </h3>
            <a
              href={`https://instagram.com/${handle.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-white hover:text-neutral-400 transition block font-mono"
            >
              {handle}
            </a>
          </div>

          {/* Thumbnails row */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            {posts.slice(startIndex, startIndex + itemsVisible).map((post, idx) => (
              <a
                key={idx}
                href={post.link || "https://instagram.com"}
                target="_blank"
                rel="noreferrer"
                className="relative aspect-square w-16 sm:w-20 md:w-24 shrink-0 bg-neutral-800 overflow-hidden group border border-neutral-800 hover:border-neutral-500 transition"
              >
                <Image
                  src={post.image}
                  alt={`NEON Instagram post ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-300"
                  sizes="96px"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white -rotate-45" />
                </div>
              </a>
            ))}

            {/* Scroll Navigation Arrow */}
            <div className="flex items-center gap-1 shrink-0 ml-2">
              {startIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center transition"
                  aria-label="Previous photos"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-full border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center transition"
                aria-label="Next photos"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
