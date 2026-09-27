import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col justify-between bg-white animate-pulse">
      <div className="aspect-[4/5] w-full bg-neutral-200" />
      <div className="pt-3 pb-2 space-y-2">
        <div className="h-3 bg-neutral-200 w-3/4 rounded-xs" />
        <div className="h-3 bg-neutral-200 w-1/3 rounded-xs" />
      </div>
      <div className="pt-1">
        <div className="w-full h-8 bg-neutral-300" />
      </div>
    </div>
  );
}
