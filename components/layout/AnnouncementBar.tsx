"use client";

import React from "react";

interface AnnouncementBarProps {
  text?: string;
}

export function AnnouncementBar({
  text = "FREE SHIPPING ON ALL ORDERS ABOVE ₹1499",
}: AnnouncementBarProps) {
  if (!text) return null;

  return (
    <div className="w-full bg-[#0a0a0a] text-white text-[11px] md:text-xs py-2 px-4 text-center tracking-widest font-medium uppercase border-b border-neutral-800 flex items-center justify-center">
      <span>{text}</span>
    </div>
  );
}
