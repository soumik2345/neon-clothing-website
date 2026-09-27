"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X, ShieldCheck, Package } from "lucide-react";
import { AnnouncementBar } from "./AnnouncementBar";
import { SearchModal } from "./SearchModal";
import { useCart } from "@/features/cart/context/CartContext";

interface HeaderProps {
  announcementText?: string;
  storeName?: string;
}

export function Header({
  announcementText = "FREE SHIPPING ON ALL ORDERS ABOVE ₹1499",
  storeName = "NEON",
}: HeaderProps) {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "SHOP", href: "/shop" },
    { label: "COLLECTIONS", href: "/shop?collections=all" },
    { label: "ABOUT US", href: "/about" },
    { label: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      <AnnouncementBar text={announcementText} />

      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/80 transition-shadow duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 md:h-20 flex items-center justify-between">
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-neutral-800 hover:text-black focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 md:flex-none text-center md:text-left">
              <Link href="/" className="inline-block group">
                <span className="text-2xl md:text-3xl font-black tracking-tight text-black uppercase font-mono">
                  {storeName}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-150 py-1 border-b-2 ${
                      isActive
                        ? "border-black text-black"
                        : "border-transparent text-neutral-600 hover:text-black hover:border-neutral-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons: Search, User, Cart */}
            <div className="flex items-center space-x-4 md:space-x-5">
              {/* Search Icon */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-neutral-800 hover:text-black transition-colors"
                aria-label="Search items"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
              </button>

              {/* User / Admin Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 text-neutral-800 hover:text-black transition-colors flex items-center"
                  aria-label="User account"
                >
                  <User className="w-5 h-5 stroke-[1.75]" />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 shadow-xl py-2 z-50 rounded-xs"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-100"
                    >
                      <ShieldCheck className="w-4 h-4 text-neutral-900" />
                      Admin Panel
                    </Link>
                    <Link
                      href="/track-order"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                    >
                      <Package className="w-4 h-4 text-neutral-600" />
                      Track Orders
                    </Link>
                  </div>
                )}
              </div>

              {/* Shopping Bag / Cart */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-neutral-800 hover:text-black transition-colors"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-0.5 bg-black text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-xs font-bold uppercase tracking-widest text-neutral-800 hover:text-black border-b border-neutral-100"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider text-black bg-neutral-100 px-3 rounded-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
