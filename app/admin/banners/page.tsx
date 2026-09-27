"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Save, Check, LayoutGrid } from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { BannerContentType } from "@/features/banners/types/banner.types";
import { CategoryType } from "@/features/categories/types/category.types";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerContentType | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [banRes, catRes] = await Promise.all([
        fetch("/api/banners"),
        fetch("/api/categories"),
      ]);
      const banJson = await banRes.json();
      const catJson = await catRes.json();
      if (banJson.success) {
        setBanners({
          ...banJson.data,
          featuredCategorySection: banJson.data.featuredCategorySection || {
            enabled: true,
            categorySlug: "hoodies",
            title: "FEATURED COLLECTION: HOODIES",
            subtitle: "Handpicked heavyweight hoodies & vintage drops",
            limit: 10,
          },
        });
      }
      if (catJson.success) {
        setCategories(catJson.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banners) return;

    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch("/api/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banners),
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save banners");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !banners) {
    return (
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Banners & Content" />
        <div className="p-12 text-center text-xs text-neutral-400">Loading banner configs...</div>
      </div>
    );
  }

  const featured = banners.featuredCategorySection || {
    enabled: true,
    categorySlug: "hoodies",
    title: "FEATURED COLLECTION: HOODIES",
    subtitle: "Handpicked heavyweight hoodies & vintage drops",
    limit: 10,
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Banners & Homepage Sections" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1 max-w-5xl">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Top Announcement Bar */}
          <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                Top Announcement Bar
              </h2>
              <p className="text-xs text-neutral-500">
                Text shown in the black banner at the very top of the site
              </p>
            </div>
            <div>
              <input
                type="text"
                value={banners.announcementText}
                onChange={(e) =>
                  setBanners({ ...banners, announcementText: e.target.value })
                }
                className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-xs font-semibold rounded-xs outline-none focus:border-black uppercase tracking-wider"
              />
            </div>
          </div>

          {/* Homepage Category-Based Product Showcase Configuration */}
          <div className="bg-white p-6 border-2 border-black rounded-xs shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-5 h-5 text-black" />
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-black font-mono">
                    Homepage Category-Based Products Section
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Choose which category and how many items (e.g. 10 or 15) to display on the homepage
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs uppercase">
                <input
                  type="checkbox"
                  checked={featured.enabled}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      featuredCategorySection: {
                        ...featured,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-black focus:ring-black"
                />
                <span>Active</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Select Category to Showcase *
                </label>
                <select
                  value={featured.categorySlug}
                  onChange={(e) => {
                    const slug = e.target.value;
                    const catObj = categories.find((c) => c.slug === slug);
                    setBanners({
                      ...banners,
                      featuredCategorySection: {
                        ...featured,
                        categorySlug: slug,
                        title: `FEATURED COLLECTION: ${catObj ? catObj.name : slug.toUpperCase()}`,
                      },
                    });
                  }}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-bold"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} (/{c.slug})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-neutral-500 mt-1">
                  The homepage will automatically load products from this selected category.
                </p>
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Number of Products on Homepage *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={2}
                    max={30}
                    value={featured.limit}
                    onChange={(e) =>
                      setBanners({
                        ...banners,
                        featuredCategorySection: {
                          ...featured,
                          limit: Number(e.target.value) || 10,
                        },
                      })
                    }
                    className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono font-bold text-sm"
                  />
                  <div className="flex gap-1 shrink-0">
                    {[5, 10, 15].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() =>
                          setBanners({
                            ...banners,
                            featuredCategorySection: {
                              ...featured,
                              limit: preset,
                            },
                          })
                        }
                        className={`px-2.5 py-2 text-[11px] font-bold uppercase rounded-xs border transition ${
                          featured.limit === preset
                            ? "bg-black text-white border-black"
                            : "bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200"
                        }`}
                      >
                        {preset} items
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Preset: 10 or 15 products as requested.
                </p>
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={featured.title}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      featuredCategorySection: {
                        ...featured,
                        title: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={featured.subtitle || ""}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      featuredCategorySection: {
                        ...featured,
                        subtitle: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Hero Banner Section */}
          <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                Main Hero Section
              </h2>
              <p className="text-xs text-neutral-500">
                Large dark hero section with headline, description and model photo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Tagline Pill
                </label>
                <input
                  type="text"
                  value={banners.hero.tag}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      hero: { ...banners.hero, tag: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black uppercase tracking-widest font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Main Headline
                </label>
                <textarea
                  rows={2}
                  value={banners.hero.title}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      hero: { ...banners.hero, title: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Subtitle Description
                </label>
                <textarea
                  rows={2}
                  value={banners.hero.subtitle}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      hero: { ...banners.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Hero Image URL (Unsplash)
                </label>
                <input
                  type="url"
                  value={banners.hero.image}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      hero: { ...banners.hero, image: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black"
                />
                {banners.hero.image && (
                  <div className="mt-2 relative w-20 h-16 bg-neutral-900 overflow-hidden rounded-xs border">
                    <Image
                      src={banners.hero.image}
                      alt="Hero preview"
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={banners.hero.ctaText}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      hero: { ...banners.hero, ctaText: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Button Target Link
                </label>
                <input
                  type="text"
                  value={banners.hero.ctaLink}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      hero: { ...banners.hero, ctaLink: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono"
                />
              </div>
            </div>
          </div>

          {/* 3 Promotional Cards */}
          <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                3 Promotional Cards Section
              </h2>
              <p className="text-xs text-neutral-500">
                Cards for &quot;NEW DROPS&quot;, &quot;PREMIUM THRIFT&quot;, and &quot;UP TO 50% OFF&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {banners.promoCards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-neutral-200 rounded-xs bg-neutral-50/50 space-y-3 text-xs"
                >
                  <p className="font-bold uppercase tracking-wider text-black">
                    Card #{idx + 1}
                  </p>

                  <div>
                    <label className="block font-semibold text-neutral-600 mb-1 uppercase">
                      Tag
                    </label>
                    <input
                      type="text"
                      value={card.tag}
                      onChange={(e) => {
                        const next = [...banners.promoCards];
                        next[idx].tag = e.target.value;
                        setBanners({ ...banners, promoCards: next });
                      }}
                      className="w-full p-2 border border-neutral-300 rounded-xs bg-white uppercase font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-600 mb-1 uppercase">
                      Title
                    </label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const next = [...banners.promoCards];
                        next[idx].title = e.target.value;
                        setBanners({ ...banners, promoCards: next });
                      }}
                      className="w-full p-2 border border-neutral-300 rounded-xs bg-white uppercase font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-600 mb-1 uppercase">
                      Image URL (Unsplash)
                    </label>
                    <input
                      type="url"
                      value={card.image}
                      onChange={(e) => {
                        const next = [...banners.promoCards];
                        next[idx].image = e.target.value;
                        setBanners({ ...banners, promoCards: next });
                      }}
                      className="w-full p-2 border border-neutral-300 rounded-xs bg-white text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {savedSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <Check className="w-4 h-4" /> Banners &amp; Category showcase successfully saved!
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition rounded-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save All Configurations"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
