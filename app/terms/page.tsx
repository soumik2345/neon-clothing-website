import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full space-y-4 text-xs text-neutral-600 leading-relaxed">
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-black font-mono mb-4">
          Terms &amp; Conditions
        </h1>
        <p>
          Welcome to NEON. By accessing our platform and placing orders, you agree to our terms of service.
        </p>
        <p>
          Each item in our catalog is an authentic thrift or curated vintage piece. Subtle distressing or vintage wash is an intended aesthetic feature of archival clothing.
        </p>
      </main>

      <Footer />
    </div>
  );
}
