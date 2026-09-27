import React from "react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            OUR PHILOSOPHY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black font-mono">
            THRIFTED CULTURE. CURATED STYLE.
          </h1>
          <p className="text-xs text-neutral-500 max-w-xl mx-auto">
            Pieces with a past, made for the present. Founded in 2024 to redefine vintage streetwear.
          </p>
        </div>

        <div className="relative aspect-[16/9] w-full bg-neutral-900 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80"
            alt="NEON Warehouse Curation"
            fill
            className="object-cover opacity-90"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed text-neutral-600">
          <div className="space-y-2">
            <h3 className="font-black uppercase text-black font-mono text-sm">01. HANDPICKED</h3>
            <p>
              Every garment in our catalog is hand-selected from vintage markets, thrift vaults, and
              private collections across the globe. We check seams, zippers, prints, and fabric weight.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-black uppercase text-black font-mono text-sm">02. RESTORED</h3>
            <p>
              Each item undergoes eco-friendly deep cleaning, conditioning, and quality grading before
              it hits our virtual drops. We preserve the authentic vintage character while ensuring modern wearability.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-black uppercase text-black font-mono text-sm">03. ACCESSIBLE</h3>
            <p>
              Streetwear should not cost an arm and a leg. We price our drops fairly, offering true
              archival fits, heavy french terry cotton, and drop-shoulder silhouettes at realistic prices.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
