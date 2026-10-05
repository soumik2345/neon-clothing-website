"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useSettings } from "@/features/settings/context/SettingsContext";

interface FooterProps {
  storeName?: string;
  tagline?: string;
  appDownload?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    playStoreUrl?: string;
    appStoreUrl?: string;
  };
}

export function Footer({
  storeName,
  tagline,
  appDownload: propAppDownload,
}: FooterProps) {
  const { settings } = useSettings();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const finalStoreName = storeName || settings?.storeName || "NEON";
  const finalTagline =
    tagline ||
    settings?.tagline ||
    "Thrifted culture. Curated style. Pieces with a past, made for the present.";

  const appDownload = propAppDownload || settings?.appDownload;
  const isAppEnabled = appDownload?.enabled !== false;
  const playStoreUrl = appDownload?.playStoreUrl?.trim();
  const appStoreUrl = appDownload?.appStoreUrl?.trim();
  const hasPlayStore = Boolean(playStoreUrl);
  const hasAppStore = Boolean(appStoreUrl);
  const showAppSection = isAppEnabled && (hasPlayStore || hasAppStore);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto pt-16 pb-12 text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12">
          {/* Brand info */}
          <div className="lg:col-span-1 space-y-4">
            <span className="text-2xl font-black uppercase tracking-tight text-black font-mono">
              {finalStoreName}
            </span>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">{finalTagline}</p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:border-black transition"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:border-black transition text-xs font-bold"
                aria-label="TikTok"
              >
                TK
              </a>
              {/* WhatsApp */}
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:border-black transition text-xs font-bold"
                aria-label="WhatsApp"
              >
                WA
              </a>
            </div>
          </div>

          {/* SHOP Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">SHOP</h3>
            <ul className="space-y-2.5 text-xs text-neutral-500">
              <li>
                <Link href="/shop" className="hover:text-black transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-black transition">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/shop/hoodies" className="hover:text-black transition">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link href="/shop/t-shirts" className="hover:text-black transition">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop/pants" className="hover:text-black transition">
                  Pants
                </Link>
              </li>
              <li>
                <Link href="/shop/accessories" className="hover:text-black transition">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">COMPANY</h3>
            <ul className="space-y-2.5 text-xs text-neutral-500">
              <li>
                <Link href="/about" className="hover:text-black transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-black transition">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-black transition">
                  Returns &amp; Refunds
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-black transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* HELP Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">HELP</h3>
            <ul className="space-y-2.5 text-xs text-neutral-500">
              <li>
                <Link href="/faqs" className="hover:text-black transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-black transition">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-black transition">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-black transition">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">
              NEWSLETTER
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Get exclusive updates on new drops and special offers.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-100 border border-neutral-200 text-xs px-3.5 py-3 pr-10 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black transition rounded-xs"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-black text-white hover:bg-neutral-800 transition flex items-center justify-center rounded-xs"
                aria-label="Subscribe"
              >
                {isSubscribed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>
            {isSubscribed && (
              <p className="text-[11px] text-emerald-600 font-medium">
                Thank you for subscribing to NEON drops!
              </p>
            )}
          </div>
        </div>

        {/* Dynamic Mobile App Download Banner */}
        {showAppSection && (
          <div className="mb-12 p-6 sm:p-8 bg-neutral-950 text-white rounded-xs border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-1.5 text-center md:text-left z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-neutral-800 border border-neutral-700 text-[10px] font-mono font-bold tracking-widest text-neutral-300 uppercase rounded-xs">
                <span>OUR MOBILE APP</span>
              </div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight font-mono text-white">
                {appDownload?.title || "DOWNLOAD OUR APP"}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {appDownload?.subtitle ||
                  "Shop curated vintage streetwear on the go. Get early drop alerts & fast checkout."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 z-10">
              {hasPlayStore && (
                <a
                  href={playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 hover:border-neutral-400 transition-all rounded-sm shadow-xs group"
                  aria-label="Download on Google Play Store"
                >
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3.609 1.814L13.793 12 3.61 22.186A2.372 2.372 0 0 1 3 20.5V3.5c0-.64.225-1.229.609-1.686z"
                      fill="#00D2FF"
                    />
                    <path
                      d="M17.202 8.591L13.793 12l3.409 3.409 3.864-2.208a1.604 1.604 0 0 0 0-2.802l-3.864-2.208z"
                      fill="#FFCE00"
                    />
                    <path
                      d="M3.61 1.814l10.183 10.186 3.409-3.409-11.836-6.763A1.97 1.97 0 0 0 3.61 1.814z"
                      fill="#00F076"
                    />
                    <path
                      d="M13.793 12L3.61 22.186c.52.441 1.22.527 1.756.222l11.836-6.763-3.409-3.409z"
                      fill="#FF334B"
                    />
                  </svg>
                  <div className="text-left flex flex-col">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 leading-none">
                      GET IT ON
                    </span>
                    <span className="text-xs font-bold text-white tracking-tight leading-tight mt-0.5 font-sans group-hover:text-emerald-400 transition-colors">
                      Google Play
                    </span>
                  </div>
                </a>
              )}

              {hasAppStore && (
                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 hover:border-neutral-400 transition-all rounded-sm shadow-xs group"
                  aria-label="Download on Apple App Store"
                >
                  <svg className="w-6 h-6 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.95 2.77 1 .08 2.05-.51 2.68-1.27z" />
                  </svg>
                  <div className="text-left flex flex-col">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 leading-none">
                      Download on the
                    </span>
                    <span className="text-xs font-bold text-white tracking-tight leading-tight mt-0.5 font-sans group-hover:text-emerald-400 transition-colors">
                      App Store
                    </span>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="border-t border-neutral-100 pt-8 text-center">
          <p className="text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} Neon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
