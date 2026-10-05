"use client";

import React from "react";
import { Menu, ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  title: string;
  onOpenMobileSidebar?: () => void;
}

export function AdminHeader({ title, onOpenMobileSidebar }: AdminHeaderProps) {
  return (
    <header className="h-16 md:h-20 bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (onOpenMobileSidebar) {
              onOpenMobileSidebar();
            } else {
              window.dispatchEvent(new Event("toggle-admin-mobile-sidebar"));
            }
          }}
          className="lg:hidden p-2 text-neutral-600 hover:text-black cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg md:text-xl font-black uppercase tracking-tight text-black font-mono">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Visit store shortcut */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-xs transition text-xs font-semibold uppercase tracking-wider border border-neutral-200"
          title="Open Live Store in New Tab"
        >
          <span>View Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Logout button */}
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/auth/admin/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xs transition text-xs font-semibold uppercase tracking-wider border border-red-200 cursor-pointer"
          title="Sign Out of Admin Portal"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
