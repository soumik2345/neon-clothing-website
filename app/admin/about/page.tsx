"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Save, Check, Plus, Trash2, ExternalLink, Loader2, Info } from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { ImageUploadInput } from "@/components/ui/ImageUploadInput";

interface PillarItem {
  number: string;
  title: string;
  description: string;
}

interface AboutData {
  badge: string;
  title: string;
  subtitle: string;
  bannerImage: string;
  storyTitle: string;
  storyContent: string;
  pillars: PillarItem[];
}

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchAbout = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/about");
      const json = await res.json();
      if (json.success && json.data) {
        setData({
          badge: json.data.badge || "",
          title: json.data.title || "",
          subtitle: json.data.subtitle || "",
          bannerImage: json.data.bannerImage || "",
          storyTitle: json.data.storyTitle || "",
          storyContent: json.data.storyContent || "",
          pillars: json.data.pillars || [],
        });
      }
    } catch (err) {
      console.error("Failed to load about data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert(json.error || "Failed to update About Us content");
      }
    } catch (err) {
      console.error("Save about error:", err);
      alert("Error saving About Us content");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPillar = () => {
    if (!data) return;
    const newIdx = data.pillars.length + 1;
    const prefix = `${String(newIdx).padStart(2, "0")}. VALUE`;
    setData({
      ...data,
      pillars: [
        ...data.pillars,
        {
          number: prefix,
          title: "NEW VALUE",
          description: "Describe this aspect of your brand or curation process here.",
        },
      ],
    });
  };

  const handleRemovePillar = (index: number) => {
    if (!data) return;
    setData({
      ...data,
      pillars: data.pillars.filter((_, idx) => idx !== index),
    });
  };

  const handlePillarChange = (
    index: number,
    field: keyof PillarItem,
    value: string
  ) => {
    if (!data) return;
    const nextPillars = [...data.pillars];
    nextPillars[index] = { ...nextPillars[index], [field]: value };
    setData({ ...data, pillars: nextPillars });
  };

  if (loading || !data) {
    return (
      <div className="flex-1 flex flex-col">
        <AdminHeader title="About Us Editor" />
        <div className="p-12 text-center text-xs text-neutral-400">Loading About Us editor...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="About Us Page Editor" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-4xl">
        {/* Quick Info & Live Preview link */}
        <div className="flex items-center justify-between bg-white p-4 border border-neutral-200 rounded-xs shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Info className="w-4 h-4 text-black shrink-0" />
            <span>Customize headlines, narrative, banner image, and core pillars displayed on the public About Us page.</span>
          </div>
          <Link
            href="/about"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xs transition shrink-0 ml-4"
          >
            <span>Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Header Section */}
          <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-2xs space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                Headline & Subtitle
              </h2>
              <p className="text-xs text-neutral-500">
                Main titles that appear at the top of the About Us page
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Tagline / Badge
                </label>
                <input
                  type="text"
                  value={data.badge}
                  onChange={(e) => setData({ ...data, badge: e.target.value.toUpperCase() })}
                  placeholder="e.g. OUR PHILOSOPHY"
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono tracking-wider"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Main Headline *
                </label>
                <input
                  type="text"
                  required
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="e.g. THRIFTED CULTURE. CURATED STYLE."
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Subtitle / Mission Statement
                </label>
                <textarea
                  rows={2}
                  value={data.subtitle}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  placeholder="Brief introductory statement"
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-2xs space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                Cover Banner Image
              </h2>
              <p className="text-xs text-neutral-500">
                High-resolution warehouse, lookbook, or curated rack photography (16:9 recommended)
              </p>
            </div>

            <ImageUploadInput
              label="Banner Image URL / Upload"
              value={data.bannerImage}
              onChange={(url) => setData({ ...data, bannerImage: url })}
              placeholder="Paste banner image URL or upload"
              aspectRatioClass="aspect-[16/9]"
              description="High resolution photo representing your streetwear thrift brand"
            />
          </div>

          {/* Core Pillars / Features */}
          <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                  Core Pillars / Values ({data.pillars.length})
                </h2>
                <p className="text-xs text-neutral-500">
                  Key points highlighting curation, authenticity, restoration, or pricing
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPillar}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 rounded-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Pillar</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-neutral-500 font-mono">
                      Pillar #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePillar(idx)}
                      className="p-1 text-neutral-400 hover:text-red-600 transition"
                      title="Remove pillar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block uppercase font-bold text-neutral-700 mb-1">
                        Number / Prefix
                      </label>
                      <input
                        type="text"
                        value={pillar.number}
                        onChange={(e) => handlePillarChange(idx, "number", e.target.value)}
                        placeholder="e.g. 01. HANDPICKED"
                        className="w-full p-2 bg-white border border-neutral-300 rounded-xs outline-none focus:border-black font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block uppercase font-bold text-neutral-700 mb-1">
                        Pillar Title
                      </label>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => handlePillarChange(idx, "title", e.target.value)}
                        placeholder="e.g. HANDPICKED"
                        className="w-full p-2 bg-white border border-neutral-300 rounded-xs outline-none focus:border-black font-bold uppercase"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block uppercase font-bold text-neutral-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={pillar.description}
                      onChange={(e) => handlePillarChange(idx, "description", e.target.value)}
                      placeholder="Detailed explanation of this pillar..."
                      className="w-full p-2 bg-white border border-neutral-300 rounded-xs outline-none focus:border-black"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Story & Vision Section */}
          <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-2xs space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                Brand Story & Vision
              </h2>
              <p className="text-xs text-neutral-500">
                Narrative block detailing origin, craft, and vision
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Story Title
                </label>
                <input
                  type="text"
                  value={data.storyTitle}
                  onChange={(e) => setData({ ...data, storyTitle: e.target.value })}
                  placeholder="e.g. THE NEON STORY"
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Story Narrative
                </label>
                <textarea
                  rows={4}
                  value={data.storyContent}
                  onChange={(e) => setData({ ...data, storyContent: e.target.value })}
                  placeholder="Tell the story of how the brand came to life, why vintage streetwear matters, and the movement you are building..."
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {savedSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <Check className="w-4 h-4" /> About Us content saved successfully!
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition rounded-xs disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
