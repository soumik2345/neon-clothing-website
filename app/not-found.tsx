import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-lg mx-auto py-24">
        <span className="text-4xl sm:text-6xl font-black font-mono text-black">404</span>
        <h1 className="text-xl font-bold uppercase tracking-tight text-neutral-800">
          Page Not Found
        </h1>
        <p className="text-xs text-neutral-500">
          The streetwear piece or page you are looking for does not exist or has been archived.
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition inline-block"
          >
            Explore Catalog
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
