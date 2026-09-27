import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function FAQsPage() {
  const faqs = [
    {
      q: "Are all items authentic thrifted streetwear?",
      a: "Yes. Every item in our inventory is thoroughly authenticated and checked for fabric quality, stitching, and brand heritage.",
    },
    {
      q: "How are the vintage clothes cleaned?",
      a: "All items undergo ozone deep-cleaning and gentle botanical conditioning prior to photography and warehousing.",
    },
    {
      q: "How often do you drop new collections?",
      a: "We drop curated thrift collections every Friday at 7 PM IST. Sign up for our newsletter to get early access.",
    },
    {
      q: "How do sizes work for vintage pieces?",
      a: "Because vintage sizing often differs from modern sizing, we specify both the tagged size and the actual fit (e.g. Boxy Oversized) in product details.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full space-y-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-black font-mono">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-5 border border-neutral-200 rounded-xs space-y-2">
              <h3 className="text-xs font-bold uppercase text-black font-mono">{faq.q}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
