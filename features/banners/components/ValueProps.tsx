"use client";

import React from "react";
import { Truck, Award, PackageCheck, Headphones } from "lucide-react";
import { ValuePropType } from "../types/banner.types";

interface ValuePropsProps {
  items: ValuePropType[];
}

export function ValueProps({ items }: ValuePropsProps) {
  const getIcon = (iconName: string) => {
    const iconClass =
      "w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 stroke-[1.5] text-neutral-800 shrink-0";
    switch (iconName?.toLowerCase()) {
      case "truck":
        return <Truck className={iconClass} />;
      case "award":
        return <Award className={iconClass} />;
      case "package":
      case "refresh-cw":
        return <PackageCheck className={iconClass} />;
      case "headphones":
        return <Headphones className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  return (
    <section className="bg-white border-b border-neutral-200 py-2.5 sm:py-5 md:py-7">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Single line 4-column layout on mobile and desktop */}
        <div className="grid grid-cols-4 divide-x divide-neutral-200 sm:divide-none gap-0.5 sm:gap-4 md:gap-6 lg:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left px-1 sm:px-0 space-y-1 sm:space-y-0 sm:space-x-3 group"
            >
              <div className="shrink-0 p-1 sm:p-2 bg-neutral-50 rounded-full border border-neutral-100 group-hover:border-neutral-300 transition">
                {getIcon(item.icon)}
              </div>
              <div className="min-w-0">
                <h4 className="text-[8px] xs:text-[9px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider text-neutral-900 leading-tight truncate">
                  {item.title}
                </h4>
                <p className="hidden md:block text-[11px] text-neutral-500 font-medium mt-0.5 truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
