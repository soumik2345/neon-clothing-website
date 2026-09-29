import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] overflow-x-hidden">
      {/* 1. Announcement Bar Skeleton */}
      <div className="h-8 bg-neutral-950 flex items-center justify-center">
        <Skeleton className="h-3 w-64 bg-neutral-800" />
      </div>

      {/* 2. Header Skeleton */}
      <div className="h-16 md:h-20 border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Skeleton className="h-7 w-28 bg-neutral-300" />
          <div className="hidden md:flex items-center space-x-8">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* 3. Hero Banner Skeleton */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] min-h-[440px] md:min-h-[600px] bg-neutral-900 flex items-center justify-center">
        <div className="text-center px-4 max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-3 w-32 bg-neutral-800 mx-auto" />
          <Skeleton className="h-10 sm:h-14 w-80 sm:w-96 bg-neutral-800 mx-auto" />
          <Skeleton className="h-4 w-60 bg-neutral-800 mx-auto" />
          <div className="pt-2">
            <Skeleton className="h-11 w-40 bg-neutral-700 mx-auto" />
          </div>
        </div>
      </div>

      {/* 4. Value Props Skeleton */}
      <div className="bg-[#111] py-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full bg-neutral-800 shrink-0" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-24 bg-neutral-800" />
                <Skeleton className="h-2.5 w-16 bg-neutral-800" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Category Grid Skeleton */}
      <div className="py-12 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2 text-center">
                <Skeleton className="aspect-square w-full rounded-xs" />
                <Skeleton className="h-3.5 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Trending Now Product Carousel Skeleton */}
      <div className="py-14 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-7 w-40 mx-auto" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[4/5] w-full" />
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
