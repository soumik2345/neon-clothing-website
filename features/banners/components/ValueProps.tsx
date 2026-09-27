"use client";

import React from "react";
import { Truck, Award, PackageCheck, Headphones } from "lucide-react";
import { ValuePropType } from "../types/banner.types";

interface ValuePropsProps {
  items: ValuePropType[];
}

export function ValueProps({ items }: ValuePropsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "truck":
        return <Truck className="w-6 h-6 stroke-[1.5] text-neutral-800" />;
      case "award":
        return <Award className="w-6 h-6 stroke-[1.5] text-neutral-800" />;
      case "package":
      case "refresh-cw":
        return <PackageCheck className="w-6 h-6 stroke-[1.5] text-neutral-800" />;
      case "headphones":
        return <Headphones className="w-6 h-6 stroke-[1.5] text-neutral-800" />;
      default:
        return <Award className="w-6 h-6 stroke-[1.5] text-neutral-800" />;
    }
  };

  return (
    <section className="bg-white border-b border-neutral-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3.5 group"
            >
              <div className="shrink-0 p-2 bg-neutral-50 rounded-full border border-neutral-100 group-hover:border-neutral-300 transition">
                {getIcon(item.icon)}
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  {item.title}
                </h4>
                <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
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
