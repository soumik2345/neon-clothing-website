"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Save,
  Check,
  LayoutGrid,
  Plus,
  Trash2,
  Sliders,
  Palette,
  Image as ImageIcon,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import {
  BannerContentType,
  HeroSlideType,
  FeaturedCategorySectionType,
} from "@/features/banners/types/banner.types";
import { CategoryType } from "@/features/categories/types/category.types";
import { ProductType } from "@/features/products/types/product.types";
import { ImageUploadInput } from "@/components/ui/ImageUploadInput";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerContentType | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [banRes, catRes, prodRes] = await Promise.all([
        fetch("/api/banners"),
        fetch("/api/categories"),
        fetch("/api/products?limit=100"),
      ]);
      const banJson = await banRes.json();
      const catJson = await catRes.json();
      const prodJson = await prodRes.json();

      if (prodJson.success) {
        setProducts(prodJson.data);
      }

      if (banJson.success) {
        const heroSlides: HeroSlideType[] =
          banJson.data.heroSlides && banJson.data.heroSlides.length > 0
            ? banJson.data.heroSlides
            : [
                {
                  tag: banJson.data.hero?.tag || "NEW ARRIVALS",
                  title: banJson.data.hero?.title || "THRIFTED.\nCURATED.",
                  subtitle:
                    banJson.data.hero?.subtitle ||
                    "Premium thrifted pieces. Handpicked for quality. Priced for you.",
                  ctaText: banJson.data.hero?.ctaText || "SHOP NOW",
                  ctaLink: banJson.data.hero?.ctaLink || "/shop",
                  bgType: "image",
                  image:
                    banJson.data.hero?.image ||
                    "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80",
                  bgColor: "#0c0c0c",
                  textColor: "white",
                },
              ];

        const featuredCategorySections: FeaturedCategorySectionType[] =
          banJson.data.featuredCategorySections && banJson.data.featuredCategorySections.length > 0
            ? banJson.data.featuredCategorySections
            : [
                {
                  id: "sec_hoodies_1",
                  enabled: true,
                  categorySlug: "hoodies",
                  title: "HOODIES",
                  limit: 12,
                  selectedProductIds: [],
                },
                {
                  id: "sec_tshirts_2",
                  enabled: true,
                  categorySlug: "t-shirts",
                  title: "T-SHIRTS",
                  limit: 12,
                  selectedProductIds: [],
                },
                {
                  id: "sec_pants_3",
                  enabled: true,
                  categorySlug: "pants",
                  title: "PANTS",
                  limit: 12,
                  selectedProductIds: [],
                },
              ];

        setBanners({
          ...banJson.data,
          heroSlides,
          featuredCategorySections,
          featuredCategorySection: featuredCategorySections[0],
          shopByCategorySection: banJson.data.shopByCategorySection || {
            enabled: true,
            title: "SHOP BY CATEGORY",
            limit: 5,
            selectedCategories: catJson.data?.slice(0, 5).map((c: CategoryType) => c.slug) || [],
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
      const firstSlide = banners.heroSlides?.[0];
      const firstSpotlight = banners.featuredCategorySections?.[0];
      const payload: BannerContentType = {
        ...banners,
        featuredCategorySection: firstSpotlight || banners.featuredCategorySection,
        featuredCategorySections: banners.featuredCategorySections,
        categoryTabbedSection: banners.categoryTabbedSection,
        hero: firstSlide
          ? {
              tag: firstSlide.tag || banners.hero?.tag || "NEW ARRIVALS",
              title: firstSlide.title || banners.hero?.title || "THRIFTED.\nCURATED.",
              subtitle: firstSlide.subtitle || banners.hero?.subtitle || "",
              ctaText: firstSlide.ctaText || banners.hero?.ctaText || "SHOP NOW",
              ctaLink: firstSlide.ctaLink || banners.hero?.ctaLink || "/shop",
              image: firstSlide.image || banners.hero?.image || "",
            }
          : banners.hero,
      };

      const res = await fetch("/api/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const handleAddSlide = () => {
    if (!banners) return;
    const newSlide: HeroSlideType = {
      tag: "NEW DROP",
      title: "EXCLUSIVE\nCOLLECTION",
      subtitle: "Curated streetwear pieces tailored for street aesthetics.",
      ctaText: "EXPLORE NOW",
      ctaLink: "/shop",
      bgType: "color",
      bgColor: "#14151a",
      textColor: "white",
      image: "",
    };
    setBanners({
      ...banners,
      heroSlides: [...(banners.heroSlides || []), newSlide],
    });
  };

  const handleRemoveSlide = (index: number) => {
    if (!banners || !banners.heroSlides) return;
    if (banners.heroSlides.length <= 1) {
      alert("At least one slide is required in the Hero Carousel.");
      return;
    }
    const updated = banners.heroSlides.filter((_, i) => i !== index);
    setBanners({
      ...banners,
      heroSlides: updated,
    });
  };

  const handleUpdateSlide = (index: number, fields: Partial<HeroSlideType>) => {
    if (!banners || !banners.heroSlides) return;
    const updated = [...banners.heroSlides];
    updated[index] = { ...updated[index], ...fields };
    setBanners({
      ...banners,
      heroSlides: updated,
    });
  };

  // Handlers for Homepage Category Sections
  const handleAddSpotlightSection = () => {
    if (!banners || categories.length === 0) return;
    const existingSlugs = new Set((banners.featuredCategorySections || []).map((s) => s.categorySlug));
    const nextCat = categories.find((c) => !existingSlugs.has(c.slug)) || categories[0];
    const newSection: FeaturedCategorySectionType = {
      id: `sec_${Date.now()}`,
      enabled: true,
      categorySlug: nextCat ? nextCat.slug : "hoodies",
      title: nextCat ? nextCat.name.toUpperCase() : "HOODIES",
      limit: 12,
      selectedProductIds: [],
    };
    setBanners({
      ...banners,
      featuredCategorySections: [
        ...(banners.featuredCategorySections || []),
        newSection,
      ],
    });
  };

  const handleRemoveSpotlightSection = (index: number) => {
    if (!banners || !banners.featuredCategorySections) return;
    if (banners.featuredCategorySections.length <= 1) {
      alert("At least one Category Spotlight section should remain, or toggle its status to 'Disabled'.");
      return;
    }
    if (!confirm("Are you sure you want to delete this Category Spotlight section?")) return;
    const updated = banners.featuredCategorySections.filter((_, i) => i !== index);
    setBanners({
      ...banners,
      featuredCategorySections: updated,
    });
  };

  const handleUpdateSpotlightSection = (
    index: number,
    fields: Partial<FeaturedCategorySectionType>
  ) => {
    if (!banners || !banners.featuredCategorySections) return;
    const updated = [...banners.featuredCategorySections];
    updated[index] = { ...updated[index], ...fields };
    setBanners({
      ...banners,
      featuredCategorySections: updated,
    });
  };

  const handleMoveSpotlightSection = (index: number, direction: "up" | "down") => {
    if (!banners || !banners.featuredCategorySections) return;
    const list = [...banners.featuredCategorySections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setBanners({
      ...banners,
      featuredCategorySections: list,
    });
  };

  const handleToggleProductInSpotlight = (sectionIndex: number, productId: string) => {
    if (!banners || !banners.featuredCategorySections) return;
    const section = banners.featuredCategorySections[sectionIndex];
    if (!section) return;
    const currentIds = section.selectedProductIds || [];
    const updatedIds = currentIds.includes(productId)
      ? currentIds.filter((id) => id !== productId)
      : [...currentIds, productId];
    handleUpdateSpotlightSection(sectionIndex, { selectedProductIds: updatedIds });
  };


  if (loading || !banners) {
    return (
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Banners & Content" />
        <div className="p-12 text-center text-xs text-neutral-400">Loading banner configs...</div>
      </div>
    );
  }

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
                value={banners.announcementText || ""}
                onChange={(e) =>
                  setBanners({ ...banners, announcementText: e.target.value })
                }
                className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-xs font-semibold rounded-xs outline-none focus:border-black uppercase tracking-wider"
              />
            </div>
          </div>

          {/* Shop By Category Homepage Section (Mobile Slider & Desktop Grid) */}
          <div className="bg-white p-6 border-2 border-black rounded-xs shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-black" />
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-black font-mono">
                    Homepage &quot;Shop By Category&quot; Section
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Mobile slider (shows 2–3 items initially with smooth auto-slide) &amp; desktop grid. Select fixed limit (e.g. 5 or 6) and choose categories.
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs uppercase font-mono">
                <input
                  type="checkbox"
                  checked={banners.shopByCategorySection?.enabled !== false}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      shopByCategorySection: {
                        enabled: e.target.checked,
                        title: banners.shopByCategorySection?.title || "SHOP BY CATEGORY",
                        limit: banners.shopByCategorySection?.limit || 5,
                        selectedCategories: banners.shopByCategorySection?.selectedCategories || [],
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
                <label className="block uppercase font-bold text-neutral-700 mb-1 font-mono">
                  Section Title
                </label>
                <input
                  type="text"
                  value={banners.shopByCategorySection?.title || "SHOP BY CATEGORY"}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      shopByCategorySection: {
                        ...banners.shopByCategorySection,
                        title: e.target.value,
                        limit: banners.shopByCategorySection?.limit || 5,
                        selectedCategories: banners.shopByCategorySection?.selectedCategories || [],
                      },
                    })
                  }
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1 font-mono">
                  Number of Categories to Display (Fixed Limit) *
                </label>
                <select
                  value={banners.shopByCategorySection?.limit || 5}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      shopByCategorySection: {
                        ...banners.shopByCategorySection,
                        limit: Number(e.target.value),
                        title: banners.shopByCategorySection?.title || "SHOP BY CATEGORY",
                        selectedCategories: banners.shopByCategorySection?.selectedCategories || [],
                      },
                    })
                  }
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono font-bold"
                >
                  <option value={3}>3 Categories</option>
                  <option value={4}>4 Categories</option>
                  <option value={5}>5 Categories (Standard)</option>
                  <option value={6}>6 Categories</option>
                  <option value={8}>8 Categories</option>
                  <option value={10}>10 Categories</option>
                </select>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Selected: {(banners.shopByCategorySection?.selectedCategories || []).length} / {banners.shopByCategorySection?.limit || 5}
                </p>
              </div>
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-700 mb-2 font-mono text-xs">
                Select Categories to Display on Homepage:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
                {categories.map((c) => {
                  const selected = (banners.shopByCategorySection?.selectedCategories || []).includes(c.slug);
                  return (
                    <label
                      key={c.slug}
                      className={`flex items-center gap-2 p-2 border rounded-xs cursor-pointer transition ${
                        selected
                          ? "bg-black text-white border-black font-bold shadow-2xs"
                          : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => {
                          const current = banners.shopByCategorySection?.selectedCategories || [];
                          const updated = e.target.checked
                            ? [...current, c.slug]
                            : current.filter((s) => s !== c.slug);
                          setBanners({
                            ...banners,
                            shopByCategorySection: {
                              ...banners.shopByCategorySection,
                              title: banners.shopByCategorySection?.title || "SHOP BY CATEGORY",
                              limit: banners.shopByCategorySection?.limit || 5,
                              selectedCategories: updated,
                            },
                          });
                        }}
                        className="w-3.5 h-3.5 rounded text-black"
                      />
                      <span className="truncate uppercase text-[11px] font-mono">{c.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Homepage Category Sections (Hoodies, T-Shirts, Pants etc. - Displayed like Trending Now) */}
          <div className="bg-white p-6 border-2 border-black rounded-xs shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <LayoutGrid className="w-5 h-5 text-black" />
                  <h2 className="text-base font-black uppercase tracking-tight text-black font-mono">
                    Homepage Category Sections (ক্যাটাগরি অনুযায়ী প্রোডাক্ট সেকশন)
                  </h2>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  হোমপেজে ট্রেন্ডিং নাউ-এর মতো প্রতিটি ক্যাটাগরির (যেমন: HOODIES, T-SHIRTS, PANTS) জন্য আলাদা সেকশন তৈরি করুন। ক্যাটাগরি সিলেক্ট করুন, টাইটেল দিন এবং কোন কোন প্রোডাক্ট দেখাবেন তা সিলেক্ট করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSpotlightSection}
                className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition rounded-xs cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Add Category Section
              </button>
            </div>

            {/* List of Spotlight Sections */}
            <div className="space-y-6">
              {(banners.featuredCategorySections || []).map((sec, secIdx) => {
                const categoryProducts = products.filter(
                  (p) => p.category?.toLowerCase() === sec.categorySlug?.toLowerCase()
                );
                const selectedCount = (sec.selectedProductIds || []).length;

                return (
                  <div
                    key={sec.id || secIdx}
                    className={`border rounded-xs p-5 transition space-y-5 ${
                      sec.enabled
                        ? "border-neutral-900 bg-neutral-50/40 shadow-xs"
                        : "border-neutral-200 bg-neutral-100/50 opacity-70"
                    }`}
                  >
                    {/* Top Row: Index, Tag, Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-200">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold font-mono flex items-center justify-center">
                          {secIdx + 1}
                        </span>
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 block">
                            {sec.tag || "CATEGORY SPOTLIGHT"}
                          </span>
                          <h3 className="text-sm font-black uppercase text-black font-mono">
                            {sec.title || "Untitled Collection"}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Move Up/Down */}
                        <div className="flex items-center border border-neutral-300 rounded-xs overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => handleMoveSpotlightSection(secIdx, "up")}
                            disabled={secIdx === 0}
                            className="p-1.5 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                            title="Move section up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveSpotlightSection(secIdx, "down")}
                            disabled={secIdx === (banners.featuredCategorySections?.length || 1) - 1}
                            className="p-1.5 hover:bg-neutral-100 disabled:opacity-30 border-l border-neutral-200 cursor-pointer"
                            title="Move section down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Active Toggle */}
                        <label className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase cursor-pointer px-2.5 py-1 bg-white border border-neutral-300 rounded-xs">
                          <input
                            type="checkbox"
                            checked={sec.enabled !== false}
                            onChange={(e) =>
                              handleUpdateSpotlightSection(secIdx, { enabled: e.target.checked })
                            }
                            className="w-3.5 h-3.5 rounded text-black"
                          />
                          <span>{sec.enabled ? "Active" : "Disabled"}</span>
                        </label>

                        {/* Delete Section */}
                        <button
                          type="button"
                          onClick={() => handleRemoveSpotlightSection(secIdx)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xs transition cursor-pointer"
                          title="Delete this spotlight section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Section Configuration Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block uppercase font-bold text-neutral-700 mb-1 font-mono">
                          Select Category *
                        </label>
                        <select
                          value={sec.categorySlug || ""}
                          onChange={(e) => {
                            const newSlug = e.target.value;
                            const catObj = categories.find((c) => c.slug === newSlug);
                            handleUpdateSpotlightSection(secIdx, {
                              categorySlug: newSlug,
                              title: catObj ? catObj.name.toUpperCase() : newSlug.toUpperCase(),
                              selectedProductIds: [],
                            });
                          }}
                          className="w-full p-2.5 bg-white border border-neutral-300 rounded-xs outline-none focus:border-black font-mono font-bold uppercase"
                        >
                          {categories.map((c) => (
                            <option key={c.slug} value={c.slug}>
                              {c.name} (/{c.slug})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block uppercase font-bold text-neutral-700 mb-1 font-mono">
                          Section Title *
                        </label>
                        <input
                          type="text"
                          value={sec.title || ""}
                          onChange={(e) =>
                            handleUpdateSpotlightSection(secIdx, { title: e.target.value })
                          }
                          placeholder="e.g. HOODIES, T-SHIRTS, PANTS"
                          className="w-full p-2.5 bg-white border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block uppercase font-bold text-neutral-700 mb-1 font-mono">
                          Display Limit (Carousel Items) *
                        </label>
                        <select
                          value={sec.limit || 12}
                          onChange={(e) =>
                            handleUpdateSpotlightSection(secIdx, { limit: Number(e.target.value) })
                          }
                          className="w-full p-2.5 bg-white border border-neutral-300 rounded-xs outline-none focus:border-black font-mono font-bold"
                        >
                          <option value={4}>4 Products</option>
                          <option value={6}>6 Products</option>
                          <option value={8}>8 Products</option>
                          <option value={10}>10 Products</option>
                          <option value={12}>12 Products (Standard)</option>
                          <option value={16}>16 Products</option>
                          <option value={20}>20 Products</option>
                        </select>
                      </div>
                    </div>

                    {/* Curated Product Selection for this category */}
                    <div className="pt-3 border-t border-neutral-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <label className="block uppercase font-bold text-neutral-800 font-mono text-xs">
                            Select Curated Products to Showcase:
                          </label>
                          <p className="text-[11px] text-neutral-500">
                            {selectedCount > 0 ? (
                              <span className="font-bold text-black font-mono">
                                {selectedCount} specific products selected (Only these chosen products will be displayed)
                              </span>
                            ) : (
                              <span className="font-mono text-neutral-500">
                                No products specifically selected — all products in this category will be shown up to the limit ({sec.limit || 10}).
                              </span>
                            )}
                          </p>
                        </div>

                        {categoryProducts.length > 0 && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                const allIds = categoryProducts.map((p) => p._id || p.id).filter(Boolean) as string[];
                                handleUpdateSpotlightSection(secIdx, { selectedProductIds: allIds });
                              }}
                              className="text-[10px] font-mono text-neutral-600 hover:text-black underline cursor-pointer"
                            >
                              Select All ({categoryProducts.length})
                            </button>
                            <span className="text-neutral-300 text-xs">|</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateSpotlightSection(secIdx, { selectedProductIds: [] })
                              }
                              className="text-[10px] font-mono text-neutral-600 hover:text-black underline cursor-pointer"
                            >
                              Clear Selection
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Products Grid Picker */}
                      {categoryProducts.length === 0 ? (
                        <div className="p-4 bg-white border border-neutral-200 rounded-xs text-center text-xs text-neutral-500 font-mono">
                          No products found in category &quot;/{sec.categorySlug}&quot;. Add products to this category in the Products Manager.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 max-h-72 overflow-y-auto p-2 bg-white border border-neutral-200 rounded-xs">
                          {categoryProducts.map((p) => {
                            const pId = p._id || p.id || "";
                            const isChecked = (sec.selectedProductIds || []).includes(pId);

                            return (
                              <button
                                key={pId}
                                type="button"
                                onClick={() => handleToggleProductInSpotlight(secIdx, pId)}
                                className={`p-2 border rounded-xs flex items-center gap-2 text-left transition cursor-pointer ${
                                  isChecked
                                    ? "bg-black text-white border-black shadow-2xs"
                                    : "bg-neutral-50 border-neutral-200 text-neutral-800 hover:border-neutral-400"
                                }`}
                              >
                                <div className="relative w-9 h-9 rounded-2xs overflow-hidden shrink-0 bg-neutral-200">
                                  {p.images?.[0] ? (
                                    <Image
                                      src={p.images[0]}
                                      alt={p.title}
                                      fill
                                      className="object-cover"
                                      sizes="36px"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-neutral-300" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[10px] font-bold uppercase truncate font-mono">
                                    {p.title}
                                  </p>
                                  <p className="text-[9px] opacity-75 font-mono">
                                    ₹{p.price}
                                  </p>
                                </div>
                                {isChecked ? (
                                  <Check className="w-4 h-4 text-green-400 shrink-0" />
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-2xs border border-neutral-300 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {(banners.featuredCategorySections || []).length === 0 && (
                <div className="py-8 text-center bg-neutral-50 border border-dashed border-neutral-300 rounded-xs space-y-2">
                  <p className="text-xs text-neutral-500 font-mono">
                    No Category Spotlight sections active. Click below to add one.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddSpotlightSection}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Spotlight Section
                  </button>
                </div>
              )}
            </div>
          </div>


          {/* Homepage Hero Carousel & Slides Management */}
          <div className="bg-white p-6 border-2 border-black rounded-xs shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-black" />
                  <h2 className="text-base font-black uppercase tracking-tight text-black font-mono">
                    Homepage Hero Section (Slider &amp; Carousel)
                  </h2>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Configure slider slides with Image or Solid Color backgrounds, custom headlines &amp; CTA buttons
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono font-bold bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-xs">
                  {banners.heroSlides?.length || 1} SLIDES
                </span>
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition rounded-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Slide</span>
                </button>
              </div>
            </div>

            {/* Slides List */}
            <div className="space-y-6">
              {(banners.heroSlides || []).map((slide, idx) => {
                const isColor = slide.bgType === "color";
                const isBlackText = slide.textColor === "black";

                return (
                  <div
                    key={idx}
                    className="p-5 border border-neutral-200 rounded-xs bg-[#fafafa] space-y-4 transition hover:border-black"
                  >
                    {/* Slide Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-mono font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider text-black font-mono">
                          Slide #{idx + 1}: {slide.tag || "Untitled"}
                        </span>
                      </div>

                      {(banners.heroSlides || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSlide(idx)}
                          className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 p-1 cursor-pointer"
                          title="Delete this slide"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      )}
                    </div>

                    {/* Background Type Selector */}
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-neutral-700 mb-1.5">
                        Background Mode
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateSlide(idx, { bgType: "image" })}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-xs border transition cursor-pointer ${
                            !isColor
                              ? "bg-black text-white border-black shadow-xs"
                              : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                          }`}
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span>Image Background</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateSlide(idx, {
                              bgType: "color",
                              bgColor: slide.bgColor || "#14151a",
                            })
                          }
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-xs border transition cursor-pointer ${
                            isColor
                              ? "bg-black text-white border-black shadow-xs"
                              : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                          }`}
                        >
                          <Palette className="w-4 h-4" />
                          <span>Solid Color Background</span>
                        </button>
                      </div>
                    </div>

                    {/* Color Settings (if Solid Color is selected) */}
                    {isColor && (
                      <div className="p-4 bg-white border border-neutral-200 rounded-xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <label className="block text-[11px] uppercase font-bold text-neutral-800 mb-1">
                              Pick Solid Background Color
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={slide.bgColor || "#0c0c0c"}
                                onChange={(e) =>
                                  handleUpdateSlide(idx, { bgColor: e.target.value })
                                }
                                className="w-9 h-9 p-0.5 border border-neutral-300 rounded-xs cursor-pointer"
                              />
                              <input
                                type="text"
                                value={slide.bgColor || "#0c0c0c"}
                                onChange={(e) =>
                                  handleUpdateSlide(idx, { bgColor: e.target.value })
                                }
                                placeholder="#0c0c0c"
                                className="w-28 p-2 border border-neutral-300 rounded-xs text-xs font-mono uppercase font-bold"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] uppercase font-bold text-neutral-800 mb-1">
                              Text Contrast
                            </label>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleUpdateSlide(idx, { textColor: "white" })}
                                className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs border transition ${
                                  !isBlackText
                                    ? "bg-black text-white border-black"
                                    : "bg-neutral-100 text-neutral-700 border-neutral-300"
                                }`}
                              >
                                White Text
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateSlide(idx, { textColor: "black" })}
                                className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs border transition ${
                                  isBlackText
                                    ? "bg-black text-white border-black"
                                    : "bg-neutral-100 text-neutral-700 border-neutral-300"
                                }`}
                              >
                                Black Text
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Quick Presets */}
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                            Streetwear Color Presets:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: "Deep Charcoal", hex: "#0c0c0c" },
                              { label: "Slate Midnight", hex: "#14151a" },
                              { label: "Vintage Mocha", hex: "#1a120b" },
                              { label: "Dark Olive", hex: "#0d1f14" },
                              { label: "Crimson Noir", hex: "#220914" },
                              { label: "Cyber Navy", hex: "#0b192c" },
                            ].map((preset) => (
                              <button
                                key={preset.hex}
                                type="button"
                                onClick={() =>
                                  handleUpdateSlide(idx, { bgColor: preset.hex, textColor: "white" })
                                }
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-[11px] font-semibold text-neutral-800 transition cursor-pointer"
                              >
                                <span
                                  className="w-3 h-3 rounded-full border border-black/20"
                                  style={{ backgroundColor: preset.hex }}
                                />
                                <span>{preset.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image Upload or URL */}
                    <div className="p-4 bg-white border border-neutral-200 rounded-xs">
                      <ImageUploadInput
                        label={
                          isColor
                            ? "Featured Model Image (Optional Cutout/Visual on Right)"
                            : "Hero Background Image *"
                        }
                        value={slide.image || ""}
                        onChange={(url) => handleUpdateSlide(idx, { image: url })}
                        description="Upload to Cloudinary or enter direct URL"
                      />
                    </div>

                    {/* Slide Content Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                      <div>
                        <label className="block uppercase font-bold text-neutral-700 mb-1">
                          Tagline Pill Text
                        </label>
                        <input
                          type="text"
                          value={slide.tag || ""}
                          onChange={(e) => handleUpdateSlide(idx, { tag: e.target.value })}
                          placeholder="NEW ARRIVALS"
                          className="w-full p-2.5 bg-white border border-neutral-300 rounded-xs outline-none focus:border-black uppercase tracking-widest font-bold"
                        />
                      </div>

                      <div>
                        <label className="block uppercase font-bold text-neutral-700 mb-1">
                          Main Headline (Use \n for line break)
                        </label>
                        <input
                          type="text"
                          value={slide.title || ""}
                          onChange={(e) => handleUpdateSlide(idx, { title: e.target.value })}
                          placeholder="THRIFTED. CURATED."
                          className="w-full p-2.5 bg-white border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-mono font-bold"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block uppercase font-bold text-neutral-700 mb-1">
                          Subtitle Description
                        </label>
                        <textarea
                          rows={2}
                          value={slide.subtitle || ""}
                          onChange={(e) => handleUpdateSlide(idx, { subtitle: e.target.value })}
                          placeholder="Premium thrifted pieces. Handpicked for quality. Priced for you."
                          className="w-full p-2.5 bg-white border border-neutral-300 rounded-xs outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block uppercase font-bold text-neutral-700 mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={slide.ctaText || ""}
                          onChange={(e) => handleUpdateSlide(idx, { ctaText: e.target.value })}
                          placeholder="SHOP NOW"
                          className="w-full p-2.5 bg-white border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-bold"
                        />
                      </div>

                      <div>
                        <label className="block uppercase font-bold text-neutral-700 mb-1">
                          Button Target Link
                        </label>
                        <input
                          type="text"
                          value={slide.ctaLink || ""}
                          onChange={(e) => handleUpdateSlide(idx, { ctaLink: e.target.value })}
                          placeholder="/shop"
                          className="w-full p-2.5 bg-white border border-neutral-300 rounded-xs outline-none focus:border-black font-mono"
                        />
                      </div>
                    </div>

                    {/* Live Slide Preview Card */}
                    <div className="pt-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                        Slide Preview:
                      </span>
                      <div
                        className="p-4 rounded-xs border border-neutral-300 relative overflow-hidden transition-colors"
                        style={{ backgroundColor: isColor ? slide.bgColor || "#0c0c0c" : "#0c0c0c" }}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="space-y-1 z-10">
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-2xs ${
                                isBlackText ? "bg-black/10 text-black" : "bg-white/10 text-white"
                              }`}
                            >
                              {slide.tag || "TAG"}
                            </span>
                            <h3
                              className={`text-sm sm:text-base font-black font-mono uppercase whitespace-pre-line leading-tight ${
                                isBlackText ? "text-black" : "text-white"
                              }`}
                            >
                              {slide.title || "HEADLINE"}
                            </h3>
                            <p
                              className={`text-[11px] line-clamp-1 max-w-sm ${
                                isBlackText ? "text-neutral-700" : "text-neutral-300"
                              }`}
                            >
                              {slide.subtitle}
                            </p>
                            <span
                              className={`inline-block mt-1 text-[10px] font-bold uppercase px-2.5 py-1 ${
                                isBlackText ? "bg-black text-white" : "bg-white text-black"
                              }`}
                            >
                              {slide.ctaText || "BUTTON"} &rarr;
                            </span>
                          </div>

                          {slide.image && (
                            <div className="relative w-24 h-20 shrink-0 overflow-hidden rounded-xs border border-white/20">
                              <Image
                                src={slide.image}
                                alt="preview"
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                      value={card.tag || ""}
                      onChange={(e) => {
                        const next = [...(banners.promoCards || [])];
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
                      value={card.title || ""}
                      onChange={(e) => {
                        const next = [...(banners.promoCards || [])];
                        next[idx].title = e.target.value;
                        setBanners({ ...banners, promoCards: next });
                      }}
                      className="w-full p-2 border border-neutral-300 rounded-xs bg-white uppercase font-mono font-bold"
                    />
                  </div>

                  <div>
                    <ImageUploadInput
                      label={`Promo Image #${idx + 1} *`}
                      value={card.image || ""}
                      onChange={(url) => {
                        const next = [...(banners.promoCards || [])];
                        next[idx].image = url;
                        setBanners({ ...banners, promoCards: next });
                      }}
                      placeholder="Paste promo image URL"
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
