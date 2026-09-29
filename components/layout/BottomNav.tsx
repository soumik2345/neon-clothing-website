"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Layers, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";

export function BottomNav() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  // Do not render bottom nav on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isHomeActive = pathname === "/";

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-2.5 left-3 right-3 max-w-md mx-auto z-40 bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-[0_10px_32px_-4px_rgba(0,0,0,0.15)] rounded-2xl px-2 py-1.5 pb-[calc(env(safe-area-inset-bottom,4px)+6px)]"
    >
      <div className="flex items-center justify-between">
        {/* 1. Shop */}
        <Link
          href="/shop"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition ${
            pathname.startsWith("/shop")
              ? "text-black"
              : "text-neutral-400 hover:text-neutral-700"
          }`}
        >
          <ShoppingBag
            className={`w-5 h-5 transition ${
              pathname.startsWith("/shop") ? "stroke-[2.3px] text-black" : "text-neutral-400"
            }`}
          />
          <span
            className={`text-[10px] uppercase tracking-tight mt-1 transition ${
              pathname.startsWith("/shop")
                ? "font-black text-black"
                : "font-semibold text-neutral-500"
            }`}
          >
            Shop
          </span>
        </Link>

        {/* 2. Collections */}
        <Link
          href="/collections"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition ${
            pathname.startsWith("/collections")
              ? "text-black"
              : "text-neutral-400 hover:text-neutral-700"
          }`}
        >
          <Layers
            className={`w-5 h-5 transition ${
              pathname.startsWith("/collections") ? "stroke-[2.3px] text-black" : "text-neutral-400"
            }`}
          />
          <span
            className={`text-[10px] uppercase tracking-tight mt-1 transition ${
              pathname.startsWith("/collections")
                ? "font-black text-black"
                : "font-semibold text-neutral-500"
            }`}
          >
            Collections
          </span>
        </Link>

        {/* 3. Center Elevated Home Button */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <Link
            href="/"
            aria-label="Home"
            className={`-mt-5 w-12 h-12 rounded-full flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.25)] border-[3px] border-white transition active:scale-95 ${
              isHomeActive
                ? "bg-black text-white"
                : "bg-neutral-900 hover:bg-black text-white"
            }`}
          >
            <Home className="w-5 h-5 stroke-[2.2px]" />
          </Link>
          <span
            className={`text-[10px] uppercase tracking-tight mt-0.5 transition ${
              isHomeActive ? "font-black text-black" : "font-semibold text-neutral-500"
            }`}
          >
            Home
          </span>
        </div>

        {/* 4. Cart */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-1 text-center relative group cursor-pointer transition text-neutral-400 hover:text-black"
          aria-label={`Open Cart (${totalItems} items)`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-neutral-500 group-hover:text-black transition stroke-[2px]" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-black text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-150">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase font-semibold tracking-tight text-neutral-500 group-hover:text-black mt-1">
            Cart
          </span>
        </button>

        {/* 5. Account / Profile */}
        <Link
          href="/profile"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition ${
            pathname.startsWith("/profile") || pathname.startsWith("/login")
              ? "text-black"
              : "text-neutral-400 hover:text-neutral-700"
          }`}
        >
          <User
            className={`w-5 h-5 transition ${
              pathname.startsWith("/profile") || pathname.startsWith("/login")
                ? "stroke-[2.3px] text-black"
                : "text-neutral-400"
            }`}
          />
          <span
            className={`text-[10px] uppercase tracking-tight mt-1 transition ${
              pathname.startsWith("/profile") || pathname.startsWith("/login")
                ? "font-black text-black"
                : "font-semibold text-neutral-500"
            }`}
          >
            Account
          </span>
        </Link>
      </div>
    </nav>
  );
}
