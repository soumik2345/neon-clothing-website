"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X, ShieldCheck, Package, LogOut, UserCheck } from "lucide-react";
import { AnnouncementBar } from "./AnnouncementBar";
import { SearchModal } from "./SearchModal";
import { useCart } from "@/features/cart/context/CartContext";

interface HeaderProps {
  announcementText?: string;
  storeName?: string;
}

interface AuthUserState {
  name: string;
  email: string;
  role: "admin" | "customer";
}

export function Header({
  announcementText = "FREE SHIPPING ON ALL ORDERS ABOVE ₹1499",
  storeName = "NEON",
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUserState | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated && data.user) {
        setCurrentUser({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        });
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("neon-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("neon-auth-change", handleAuthChange);
    };
  }, [checkAuth, pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      if (currentUser?.role === "admin") {
        await fetch("/api/auth/admin/logout", { method: "POST" });
      } else {
        await fetch("/api/auth/user/logout", { method: "POST" });
      }
      setCurrentUser(null);
      setIsUserMenuOpen(false);
      window.dispatchEvent(new Event("neon-auth-change"));
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "SHOP", href: "/shop" },
    { label: "COLLECTIONS", href: "/collections" },
    { label: "ABOUT US", href: "/about" },
    { label: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      <AnnouncementBar text={announcementText} />

      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/80 transition-shadow duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 sm:h-16 md:h-20 flex items-center justify-between">
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-neutral-800 hover:text-black focus:outline-none"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 md:flex-none text-center md:text-left px-2">
              <Link href="/" className="inline-block group">
                <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-black uppercase font-mono">
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
            <div className="flex items-center space-x-1 sm:space-x-3 md:space-x-5">
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
                  className="p-2 text-neutral-800 hover:text-black transition-colors flex items-center gap-1.5"
                  aria-label="User account"
                >
                  <User className="w-5 h-5 stroke-[1.75]" />
                  {currentUser && (
                    <span className="hidden xl:inline-block text-[11px] font-bold uppercase tracking-wider text-black max-w-[80px] truncate">
                      {currentUser.name.split(" ")[0]}
                    </span>
                  )}
                  {currentUser?.role === "admin" && (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-black text-white px-1.5 py-0.5 rounded-xs">
                      ADMIN
                    </span>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 shadow-xl py-2 z-50 rounded-xs"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    {currentUser ? (
                      <>
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <p className="text-xs font-bold text-black uppercase truncate">
                            {currentUser.name}
                          </p>
                          <p className="text-[10px] text-neutral-500 truncate">
                            {currentUser.email}
                          </p>
                        </div>

                        {currentUser.role === "admin" ? (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:bg-neutral-100"
                          >
                            <ShieldCheck className="w-4 h-4 text-black" />
                            Admin Dashboard
                          </Link>
                        ) : null}

                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-800 hover:bg-neutral-100"
                        >
                          <UserCheck className="w-4 h-4 text-neutral-700" />
                          My Profile &amp; Orders
                        </Link>

                        <Link
                          href="/track-order"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                        >
                          <Package className="w-4 h-4 text-neutral-600" />
                          Track Order
                        </Link>

                        <div className="pt-1 mt-1 border-t border-neutral-100">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-neutral-100"
                        >
                          Sign In
                        </Link>

                        <Link
                          href="/register"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100"
                        >
                          Create Account
                        </Link>

                        <Link
                          href="/track-order"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                        >
                          <Package className="w-4 h-4 text-neutral-600" />
                          Track Order
                        </Link>

                        <div className="pt-1 mt-1 border-t border-neutral-100">
                          <Link
                            href="/admin/login"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono text-neutral-500 hover:text-black hover:bg-neutral-50"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Admin Portal
                          </Link>
                        </div>
                      </>
                    )}
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
      </header>

      {/* Modern Mobile Slide-Over Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-black uppercase font-mono tracking-tight text-black"
              >
                {storeName}
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-neutral-500 hover:text-black rounded-xs"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Quick Search trigger inside drawer */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full py-2.5 px-3 bg-neutral-100 border border-neutral-200 text-xs text-neutral-500 rounded-xs flex items-center gap-2 hover:bg-neutral-200 transition text-left"
              >
                <Search className="w-4 h-4 text-neutral-400" />
                <span>Search streetwear, hoodies...</span>
              </button>

              {/* Navigation Links */}
              <div className="space-y-1">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 px-2 pb-1">
                  Menu
                </p>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-3 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs transition ${
                        isActive
                          ? "bg-black text-white"
                          : "text-neutral-800 hover:bg-neutral-100 hover:text-black"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Account Section */}
              <div className="pt-2 border-t border-neutral-200 space-y-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 px-2 pb-1">
                  Account &amp; Orders
                </p>

                {currentUser ? (
                  <div className="space-y-1.5">
                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs">
                      <p className="text-xs font-bold text-black uppercase truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] text-neutral-500 font-mono truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    {currentUser.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-black bg-neutral-100 hover:bg-neutral-200 rounded-xs"
                      >
                        <ShieldCheck className="w-4 h-4 text-black" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-100 rounded-xs"
                    >
                      <UserCheck className="w-4 h-4 text-neutral-600" />
                      My Profile &amp; Orders
                    </Link>

                    <Link
                      href="/track-order"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 rounded-xs"
                    >
                      <Package className="w-4 h-4 text-neutral-600" />
                      Track Order Status
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-xs text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full block text-center py-2.5 px-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xs hover:bg-neutral-800 transition"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full block text-center py-2.5 px-4 border border-black text-black text-xs font-bold uppercase tracking-widest rounded-xs hover:bg-neutral-50 transition"
                    >
                      Create Account
                    </Link>
                    <Link
                      href="/track-order"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-neutral-600 hover:text-black transition"
                    >
                      <Package className="w-3.5 h-3.5" /> Track Live Order
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-neutral-100 bg-neutral-50 text-[10px] text-neutral-500 font-mono text-center">
              FREE SHIPPING ON ORDERS OVER ₹1499
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
