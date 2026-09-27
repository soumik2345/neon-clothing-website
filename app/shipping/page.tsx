import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full space-y-6 text-xs text-neutral-600 leading-relaxed">
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-black font-mono mb-4">
          Shipping &amp; Delivery Policy
        </h1>
        <p>
          At NEON, all orders are processed and dispatched within 24 to 48 hours of order confirmation.
        </p>
        <h2 className="text-sm font-bold uppercase text-black pt-4">Domestic Shipping Rates</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Orders above ₹1,499:</strong> FREE STANDARD EXPRESS SHIPPING.</li>
          <li><strong>Orders below ₹1,499:</strong> Flat shipping fee of ₹99 applies.</li>
        </ul>
        <h2 className="text-sm font-bold uppercase text-black pt-4">Delivery Timelines</h2>
        <p>
          Metros &amp; Major Cities: 2 - 4 business days.<br />
          Rest of India: 3 - 6 business days.
        </p>
        <h2 className="text-sm font-bold uppercase text-black pt-4">Packaging</h2>
        <p>
          All items are shipped in biodegradable, tamper-proof premium packaging to protect vintage garments.
        </p>
      </main>

      <Footer />
    </div>
  );
}
