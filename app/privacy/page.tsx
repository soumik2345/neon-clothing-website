import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full space-y-4 text-xs text-neutral-600 leading-relaxed">
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-black font-mono mb-4">
          Privacy Policy
        </h1>
        <p>
          NEON is committed to protecting your personal information. When you place an order or subscribe
          to our drop announcements, we securely process your delivery address, email, and contact number.
        </p>
        <p>
          We never sell, rent, or trade your personal data to third parties. All financial data is encrypted
          using standard 256-bit SSL encryption.
        </p>
      </main>

      <Footer />
    </div>
  );
}
