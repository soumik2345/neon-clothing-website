import React from "react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { connectDB } from "@/lib/db/mongodb";
import { About } from "@/lib/db/models/About";
import { initialAbout } from "@/lib/db/seed-data";

export const dynamic = "force-dynamic";

async function getAboutData() {
  try {
    await connectDB();
    const doc = await About.findOne({ identifier: "site_about" }).lean();
    if (doc) {
      return JSON.parse(JSON.stringify(doc));
    }
  } catch (error) {
    console.error("Error fetching about data:", error);
  }
  return initialAbout;
}

export default async function AboutPage() {
  const about = await getAboutData();

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full space-y-12">
        {/* Title Section */}
        <div className="text-center space-y-2">
          {about.badge && (
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              {about.badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black font-mono">
            {about.title || "THRIFTED CULTURE. CURATED STYLE."}
          </h1>
          {about.subtitle && (
            <p className="text-xs text-neutral-500 max-w-xl mx-auto">
              {about.subtitle}
            </p>
          )}
        </div>

        {/* Hero / Banner Image */}
        {about.bannerImage && (
          <div className="relative aspect-[16/9] w-full bg-neutral-900 overflow-hidden rounded-xs shadow-sm">
            <Image
              src={about.bannerImage}
              alt={about.title || "About NEON Streetwear"}
              fill
              className="object-cover opacity-90"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
          </div>
        )}

        {/* Feature Pillars */}
        {about.pillars && about.pillars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed text-neutral-600">
            {about.pillars.map((pillar: { number?: string; title: string; description: string }, idx: number) => (
              <div key={idx} className="space-y-2 p-5 bg-white border border-neutral-200 rounded-xs shadow-2xs">
                <h3 className="font-black uppercase text-black font-mono text-sm tracking-tight">
                  {pillar.number ? `${pillar.number} ` : `${String(idx + 1).padStart(2, "0")}. `}
                  {pillar.title}
                </h3>
                <p className="text-neutral-600 leading-normal">{pillar.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Vision / Story Section */}
        {about.storyContent && (
          <div className="p-8 bg-neutral-900 text-white rounded-xs space-y-3">
            <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-neutral-300">
              {about.storyTitle || "THE NEON STORY"}
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl whitespace-pre-wrap">
              {about.storyContent}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
