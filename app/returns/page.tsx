import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full space-y-6 text-xs text-neutral-600 leading-relaxed">
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-black font-mono mb-4">
          Returns &amp; Refunds Policy
        </h1>
        <p>
          We want you to love your curated pieces. We offer a hassle-free 7-day return and exchange window from the date of delivery.
        </p>
        <h2 className="text-sm font-bold uppercase text-black pt-4">Return Eligibility</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Garment must be unworn and in the same condition as received.</li>
          <li>Original NEON security tags must remain intact.</li>
          <li>Receipt or order number must be provided.</li>
        </ul>
        <h2 className="text-sm font-bold uppercase text-black pt-4">Refund Process</h2>
        <p>
          Refunds are initiated back to the original payment method or issued as store credits within 48 hours of return receipt and inspection.
        </p>
      </main>

      <Footer />
    </div>
  );
}
