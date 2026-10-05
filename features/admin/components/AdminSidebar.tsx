"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Package,
  Sliders,
  Settings,
  ArrowLeft,
  LogOut,
  X,
  MessageSquare,
  FileText,
  Bell,
} from "lucide-react";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Orders", href: "/admin/orders", icon: Package },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Messages", href: "/admin/messages", icon: MessageSquare },
    { label: "Banners & Hero", href: "/admin/banners", icon: Sliders },
    { label: "About Us", href: "/admin/about", icon: FileText },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0c0c0c] text-neutral-300 flex flex-col border-r border-neutral-800 h-screen sticky top-0 overflow-y-auto">
      {/* Brand */}
      <div className="h-16 md:h-20 border-b border-neutral-800 px-6 flex items-center justify-between shrink-0">
        <Link href="/admin" onClick={onCloseMobile} className="flex items-center gap-2">
          <span className="text-xl font-black text-white tracking-widest font-mono">NEON</span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded-xs">
            ADMIN
          </span>
        </Link>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-neutral-800 transition"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin" && pathname?.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition ${
                isActive
                  ? "bg-white text-black font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Store link & Logout */}
      <div className="p-4 border-t border-neutral-800 space-y-3">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition border border-neutral-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
        </Link>

        <button
          type="button"
          onClick={async () => {
            await fetch("/api/auth/admin/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
          className="flex items-center justify-center gap-2 w-full py-2 bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider rounded-xs transition border border-red-900/40 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Log Out
        </button>
      </div>
    </aside>
  );
}
