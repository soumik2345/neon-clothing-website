"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Save,
  Check,
  Plus,
  Trash2,
  Sliders,
  Palette,
  Image as ImageIcon,
  MoveUp,
  MoveDown,
  Edit2,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import {
  BannerContentType,
  HeroSlideType,
  FeaturedCategorySectionType,
  PromoCardType,
} from "@/features/banners/types/banner.types";
import { CategoryType } from "@/features/categories/types/category.types";
import { ProductType } from "@/features/products/types/product.types";
import { ImageUploadInput } from "@/components/ui/ImageUploadInput";

const DEFAULT_SLIDE: HeroSlideType = {
  tag: "NEW ARRIVALS",
  title: "THRIFTED.\nCURATED.",
  subtitle: "Premium thrifted pieces. Handpicked for quality. Priced for you.",
  ctaText: "SHOP NOW",
  ctaLink: "/shop",
  bgType: "image",
  image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80",
  bgColor: "#0c0c0c",
  textColor: "white",
};

const DEFAULT_PROMO: PromoCardType = {
  tag: "EXCLUSIVE",
  title: "VINTAGE HOODIES",
  ctaText: "EXPLORE",
  ctaLink: "/shop",
  image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerContentType | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Modal States
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlideIdx, setEditingSlideIdx] = useState<number>(-1);
  const [slideFormData, setSlideFormData] = useState<HeroSlideType>(DEFAULT_SLIDE);

  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromoIdx, setEditingPromoIdx] = useState<number>(-1);
  const [promoFormData, setPromoFormData] = useState<PromoCardType>(DEFAULT_PROMO);

  const [isSpotlightModalOpen, setIsSpotlightModalOpen] = useState(false);
  const [editingSpotlightIdx, setEditingSpotlightIdx] = useState<number>(-1);
  const [spotlightFormData, setSpotlightFormData] = useState<FeaturedCategorySectionType>({
    id: `sec_${Date.now()}`,
    enabled: true,
    categorySlug: "hoodies",
    title: "HOODIES",
    limit: 12,
    selectedProductIds: [],
  });

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

      if (prodJson.success) setProducts(prodJson.data);
      if (catJson.success) setCategories(catJson.data);

      if (banJson.success) {
        const heroSlides: HeroSlideType[] =
          banJson.data.heroSlides && banJson.data.heroSlides.length > 0
            ? banJson.data.heroSlides
            : [DEFAULT_SLIDE];

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
              ];

        setBanners({
          ...banJson.data,
          heroSlides,
          featuredCategorySections,
          promoCards: banJson.data.promoCards || [
            {
              tag: "NEW DROPS",
              title: "Every Week",
              ctaText: "EXPLORE",
              ctaLink: "/shop",
              image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
            },
            {
              tag: "PREMIUM THRIFT",
              title: "Hand Curated",
              ctaText: "SHOP NOW",
              ctaLink: "/shop",
              image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
            },
          ],
        });
      }
    } catch (err) {
      console.error("Failed to load banner configs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Direct Auto-Save to Backend API
  const saveBannersState = async (updatedBanners: BannerContentType) => {
    setSaving(true);
    try {
      const firstSlide = updatedBanners.heroSlides?.[0];
      const payload: Partial<BannerContentType> = {
        ...updatedBanners,
        hero: firstSlide
          ? {
              tag: firstSlide.tag || "NEW ARRIVALS",
              title: firstSlide.title || "THRIFTED.\nCURATED.",
              subtitle: firstSlide.subtitle || "",
              ctaText: firstSlide.ctaText || "SHOP NOW",
              ctaLink: firstSlide.ctaLink || "/shop",
              image: firstSlide.image || "",
            }
          : updatedBanners.hero,
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
      alert("Failed to save banner changes");
    } finally {
      setSaving(false);
    }
  };

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banners) return;
    await saveBannersState(banners);
  };

  // --- HERO SLIDE MODAL HANDLERS ---
  const handleOpenAddSlide = () => {
    setEditingSlideIdx(-1);
    setSlideFormData({
      tag: "NEW DROP",
      title: "EXCLUSIVE\nCOLLECTION",
      subtitle: "Curated vintage streetwear pieces handpicked for quality.",
      ctaText: "EXPLORE NOW",
      ctaLink: "/shop",
      bgType: "image",
      image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80",
      bgColor: "#0c0c0c",
      textColor: "white",
    });
    setIsSlideModalOpen(true);
  };

  const handleOpenEditSlide = (idx: number) => {
    if (!banners || !banners.heroSlides?.[idx]) return;
    setEditingSlideIdx(idx);
    setSlideFormData({ ...banners.heroSlides[idx] });
    setIsSlideModalOpen(true);
  };

  const handleSaveSlideModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banners) return;

    let updatedSlides = [...(banners.heroSlides || [])];
    if (editingSlideIdx === -1) {
      updatedSlides.push(slideFormData);
    } else {
      updatedSlides[editingSlideIdx] = slideFormData;
    }

    const updatedBanners: BannerContentType = {
      ...banners,
      heroSlides: updatedSlides,
    };

    setBanners(updatedBanners);
    setIsSlideModalOpen(false);
    await saveBannersState(updatedBanners);
  };

  const handleRemoveSlide = async (index: number) => {
    if (!banners || !banners.heroSlides) return;
    if (banners.heroSlides.length <= 1) {
      alert("At least one slide is required in the Hero Carousel.");
      return;
    }
    if (!confirm("Are you sure you want to delete this slide?")) return;

    const updated = banners.heroSlides.filter((_, i) => i !== index);
    const updatedBanners = { ...banners, heroSlides: updated };
    setBanners(updatedBanners);
    await saveBannersState(updatedBanners);
  };

  const handleMoveSlide = async (index: number, direction: "up" | "down") => {
    if (!banners || !banners.heroSlides) return;
    const list = [...banners.heroSlides];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;

    const updatedBanners = { ...banners, heroSlides: list };
    setBanners(updatedBanners);
    await saveBannersState(updatedBanners);
  };

  // --- PROMO CARDS MODAL HANDLERS ---
  const handleOpenEditPromo = (idx: number) => {
    if (!banners || !banners.promoCards?.[idx]) return;
    setEditingPromoIdx(idx);
    setPromoFormData({ ...banners.promoCards[idx] });
    setIsPromoModalOpen(true);
  };

  const handleOpenAddPromo = () => {
    setEditingPromoIdx(-1);
    setPromoFormData({
      tag: "NEW DROP",
      title: "LIMITED PIECES",
      ctaText: "EXPLORE",
      ctaLink: "/shop",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    });
    setIsPromoModalOpen(true);
  };

  const handleSavePromoModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banners) return;

    let updatedPromos = [...(banners.promoCards || [])];
    if (editingPromoIdx === -1) {
      updatedPromos.push(promoFormData);
    } else {
      updatedPromos[editingPromoIdx] = promoFormData;
    }

    const updatedBanners: BannerContentType = {
      ...banners,
      promoCards: updatedPromos,
    };

    setBanners(updatedBanners);
    setIsPromoModalOpen(false);
    await saveBannersState(updatedBanners);
  };

  const handleRemovePromo = async (index: number) => {
    if (!banners || !banners.promoCards) return;
    if (banners.promoCards.length <= 1) {
      alert("At least one promo card must remain.");
      return;
    }
    if (!confirm("Are you sure you want to delete this promo card?")) return;

    const updated = banners.promoCards.filter((_, i) => i !== index);
    const updatedBanners = { ...banners, promoCards: updated };
    setBanners(updatedBanners);
    await saveBannersState(updatedBanners);
  };

  // --- SPOTLIGHT SECTION MODAL HANDLERS ---
  const handleOpenAddSpotlight = () => {
    const existingSlugs = new Set((banners?.featuredCategorySections || []).map((s) => s.categorySlug));
    const nextCat = categories.find((c) => !existingSlugs.has(c.slug)) || categories[0];
    setEditingSpotlightIdx(-1);
    setSpotlightFormData({
      id: `sec_${Date.now()}`,
      enabled: true,
      categorySlug: nextCat ? nextCat.slug : "hoodies",
      title: nextCat ? nextCat.name.toUpperCase() : "HOODIES",
      limit: 12,
      selectedProductIds: [],
    });
    setIsSpotlightModalOpen(true);
  };

  const handleOpenEditSpotlight = (idx: number) => {
    if (!banners || !banners.featuredCategorySections?.[idx]) return;
    setEditingSpotlightIdx(idx);
    setSpotlightFormData({ ...banners.featuredCategorySections[idx] });
    setIsSpotlightModalOpen(true);
  };

  const handleSaveSpotlightModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banners) return;

    let updatedSections = [...(banners.featuredCategorySections || [])];
    if (editingSpotlightIdx === -1) {
      updatedSections.push(spotlightFormData);
    } else {
      updatedSections[editingSpotlightIdx] = spotlightFormData;
    }

    const updatedBanners: BannerContentType = {
      ...banners,
      featuredCategorySections: updatedSections,
    };

    setBanners(updatedBanners);
    setIsSpotlightModalOpen(false);
    await saveBannersState(updatedBanners);
  };

  const handleRemoveSpotlight = async (index: number) => {
    if (!banners || !banners.featuredCategorySections) return;
    if (!confirm("Are you sure you want to delete this Category Spotlight section?")) return;

    const updated = banners.featuredCategorySections.filter((_, i) => i !== index);
    const updatedBanners = { ...banners, featuredCategorySections: updated };
    setBanners(updatedBanners);
    await saveBannersState(updatedBanners);
  };

  if (loading || !banners) {
    return (
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Banners & Content" />
        <div className="p-12 text-center text-xs text-neutral-400 font-mono">
          Loading banner configs...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Banners & Homepage Sections" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1 max-w-5xl">
        <form onSubmit={handleManualSave} className="space-y-8">
          {/* Top Announcement Bar */}
          <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                Top Announcement Bar
              </h2>
              <p className="text-xs text-neutral-500">
                Text shown in the black banner at the very top of the website
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

          {/* 1. HERO BANNER SLIDES MANAGEMENT */}
          <div className="bg-white p-6 border-2 border-black rounded-xs shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-black" />
                  <h2 className="text-base font-black uppercase tracking-tight text-black font-mono">
                    Hero Banner Carousel ({banners.heroSlides?.length || 0} Slides)
                  </h2>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Click &quot;+ Add Slide&quot; or &quot;Edit&quot; to customize slides in a popup modal
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddSlide}
                className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition rounded-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hero Slide</span>
              </button>
            </div>

            {/* Slide Cards Preview List */}
            <div className="space-y-3">
              {(banners.heroSlides || []).map((slide, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-neutral-200 rounded-xs bg-[#fafafa] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-black transition"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold font-mono flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    {/* Thumbnail */}
                    <div className="relative w-20 h-14 bg-neutral-900 overflow-hidden rounded-xs shrink-0 border border-neutral-300">
                      {slide.bgType === "image" && slide.image ? (
                        <Image
                          src={slide.image}
                          alt="preview"
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: slide.bgColor || "#0c0c0c" }}
                        >
                          <span className="text-[9px] font-mono text-white/70 uppercase">
                            SOLID COLOR
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 block truncate">
                        {slide.tag || "ARCHIVE DROP"}
                      </span>
                      <h3 className="text-sm font-black uppercase text-black font-mono truncate">
                        {slide.title?.replace("\n", " ") || "UNTITLED SLIDE"}
                      </h3>
                      <p className="text-xs text-neutral-500 truncate">
                        {slide.subtitle || "No subtitle provided"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveSlide(idx, "up")}
                      disabled={idx === 0}
                      className="p-2 border border-neutral-300 bg-white hover:bg-neutral-100 disabled:opacity-30 rounded-xs cursor-pointer"
                      title="Move up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSlide(idx, "down")}
                      disabled={idx === (banners.heroSlides?.length || 1) - 1}
                      className="p-2 border border-neutral-300 bg-white hover:bg-neutral-100 disabled:opacity-30 rounded-xs cursor-pointer"
                      title="Move down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditSlide(idx)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white text-xs font-bold uppercase rounded-xs hover:bg-black cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {(banners.heroSlides || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSlide(idx)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xs transition cursor-pointer"
                        title="Delete slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. PROMOTIONAL CARDS MANAGEMENT */}
          <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                  Featured Promo Cards ({banners.promoCards?.length || 0})
                </h2>
                <p className="text-xs text-neutral-500">
                  Cards shown in the homepage Featured Drops strip (e.g. &quot;NEW DROPS&quot;, &quot;PREMIUM THRIFT&quot;)
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddPromo}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition rounded-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Promo Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(banners.promoCards || []).map((card, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-neutral-200 rounded-xs bg-neutral-50/50 space-y-3 relative group hover:border-black transition"
                >
                  <div className="relative h-32 w-full bg-neutral-900 rounded-xs overflow-hidden">
                    {card.image ? (
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover opacity-70"
                        sizes="300px"
                      />
                    ) : null}
                    <div className="absolute inset-0 p-3 flex flex-col justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/80">
                        {card.tag}
                      </span>
                      <div>
                        <h4 className="text-sm font-black font-mono uppercase text-white">
                          {card.title}
                        </h4>
                        <span className="text-[9px] font-mono bg-white text-black px-2 py-0.5 mt-1 inline-block">
                          {card.ctaText || "EXPLORE"} &rarr;
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase">
                      Card #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPromo(idx)}
                        className="px-2.5 py-1 bg-black text-white text-[11px] font-bold uppercase rounded-xs hover:bg-neutral-800 cursor-pointer"
                      >
                        Edit
                      </button>
                      {(banners.promoCards || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePromo(idx)}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded-xs cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. CATEGORY SPOTLIGHT SECTIONS */}
          <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                  Category Spotlight Sections ({banners.featuredCategorySections?.length || 0})
                </h2>
                <p className="text-xs text-neutral-500">
                  Dedicated homepage rows showcasing items from specific categories
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddSpotlight}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition rounded-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spotlight</span>
              </button>
            </div>

            <div className="space-y-3">
              {(banners.featuredCategorySections || []).map((sec, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-neutral-200 rounded-xs bg-[#fafafa] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-black transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black font-mono uppercase text-black">
                        {sec.title}
                      </span>
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-2xs ${
                          sec.enabled !== false
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-neutral-200 text-neutral-600"
                        }`}
                      >
                        {sec.enabled !== false ? "Active" : "Disabled"}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-mono mt-0.5">
                      Category: /{sec.categorySlug} • Limit: {sec.limit || 12} items
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditSpotlight(idx)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white text-xs font-bold uppercase rounded-xs hover:bg-black cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Products</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpotlight(idx)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded-xs cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {savedSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <Check className="w-4 h-4" /> All banner changes successfully saved!
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition rounded-xs disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save All Configurations"}
            </button>
          </div>
        </form>
      </main>

      {/* ========================================================================= */}
      {/* 1. HERO SLIDE MODAL POPUP                                                 */}
      {/* ========================================================================= */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-300 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xs shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-400 block">
                  HERO BANNER CONFIGURATION
                </span>
                <h3 className="text-lg font-black font-mono uppercase text-black">
                  {editingSlideIdx === -1 ? "Add New Hero Slide" : `Edit Hero Slide #${editingSlideIdx + 1}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSlideModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-black rounded-xs transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Visual Preview Inside Modal */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                Live Banner Preview
              </span>
              <div
                style={{
                  backgroundColor: slideFormData.bgType === "color" ? slideFormData.bgColor || "#0c0c0c" : "#0c0c0c",
                }}
                className="relative h-44 sm:h-48 w-full overflow-hidden p-6 flex flex-row items-center justify-between border border-neutral-300"
              >
                {slideFormData.bgType === "image" && slideFormData.image ? (
                  <Image
                    src={slideFormData.image}
                    alt="slide preview"
                    fill
                    className="object-cover"
                    sizes="600px"
                  />
                ) : null}

                <div className="relative z-10 max-w-[60%] space-y-1.5">
                  <span
                    className={`inline-block px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest ${
                      slideFormData.textColor === "black" ? "bg-black text-white" : "bg-white text-black"
                    }`}
                  >
                    {slideFormData.tag || "ARCHIVE DROP"}
                  </span>
                  <h4
                    className={`text-lg sm:text-xl font-black font-mono uppercase leading-tight ${
                      slideFormData.textColor === "black" ? "text-black" : "text-white"
                    }`}
                  >
                    {slideFormData.title || "TITLE HERE"}
                  </h4>
                  <p
                    className={`text-[11px] line-clamp-2 ${
                      slideFormData.textColor === "black" ? "text-neutral-800" : "text-neutral-300"
                    }`}
                  >
                    {slideFormData.subtitle || "Banner subtitle description goes here."}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      slideFormData.textColor === "black" ? "bg-black text-white" : "bg-white text-black"
                    }`}
                  >
                    {slideFormData.ctaText || "EXPLORE"} &rarr;
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveSlideModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={slideFormData.tag || ""}
                    onChange={(e) =>
                      setSlideFormData({ ...slideFormData, tag: e.target.value })
                    }
                    placeholder="e.g. NEW ARRIVALS, CURATED DROP"
                    className="w-full p-2.5 bg-[#fcfcfc] border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={slideFormData.ctaText || ""}
                    onChange={(e) =>
                      setSlideFormData({ ...slideFormData, ctaText: e.target.value })
                    }
                    placeholder="e.g. SHOP NOW"
                    className="w-full p-2.5 bg-[#fcfcfc] border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={slideFormData.title || ""}
                  onChange={(e) =>
                    setSlideFormData({ ...slideFormData, title: e.target.value })
                  }
                  placeholder="e.g. THRIFTED. CURATED."
                  className="w-full p-2.5 bg-[#fcfcfc] border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-mono font-black"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Subtitle Description
                </label>
                <textarea
                  rows={2}
                  value={slideFormData.subtitle || ""}
                  onChange={(e) =>
                    setSlideFormData({ ...slideFormData, subtitle: e.target.value })
                  }
                  placeholder="Short description of this drop or promotion"
                  className="w-full p-2.5 bg-[#fcfcfc] border border-neutral-300 rounded-xs outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Button Link / URL
                  </label>
                  <input
                    type="text"
                    value={slideFormData.ctaLink || ""}
                    onChange={(e) =>
                      setSlideFormData({ ...slideFormData, ctaLink: e.target.value })
                    }
                    placeholder="/shop or /shop?category=hoodies"
                    className="w-full p-2.5 bg-[#fcfcfc] border border-neutral-300 rounded-xs outline-none focus:border-black font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Background Mode
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSlideFormData({ ...slideFormData, bgType: "image" })
                      }
                      className={`flex-1 py-2 text-xs font-bold uppercase rounded-xs border ${
                        slideFormData.bgType === "image"
                          ? "bg-black text-white border-black"
                          : "bg-white text-neutral-700 border-neutral-300"
                      }`}
                    >
                      Image
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSlideFormData({ ...slideFormData, bgType: "color" })
                      }
                      className={`flex-1 py-2 text-xs font-bold uppercase rounded-xs border ${
                        slideFormData.bgType === "color"
                          ? "bg-black text-white border-black"
                          : "bg-white text-neutral-700 border-neutral-300"
                      }`}
                    >
                      Solid Color
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Input or Color Picker */}
              {slideFormData.bgType === "image" ? (
                <div>
                  <ImageUploadInput
                    label="Banner Background Image (Supports any Unsplash or external link) *"
                    value={slideFormData.image || ""}
                    onChange={(url) =>
                      setSlideFormData({ ...slideFormData, image: url })
                    }
                    placeholder="https://images.unsplash.com/... or paste image URL"
                  />
                </div>
              ) : (
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block font-bold uppercase text-neutral-700 mb-1">
                        Solid Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={slideFormData.bgColor || "#0c0c0c"}
                          onChange={(e) =>
                            setSlideFormData({ ...slideFormData, bgColor: e.target.value })
                          }
                          className="w-8 h-8 p-0 border border-neutral-300 rounded-xs cursor-pointer"
                        />
                        <input
                          type="text"
                          value={slideFormData.bgColor || "#0c0c0c"}
                          onChange={(e) =>
                            setSlideFormData({ ...slideFormData, bgColor: e.target.value })
                          }
                          className="w-28 p-2 bg-white border border-neutral-300 text-xs font-mono uppercase font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-neutral-700 mb-1">
                        Text Contrast
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSlideFormData({ ...slideFormData, textColor: "white" })
                          }
                          className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs border ${
                            slideFormData.textColor !== "black"
                              ? "bg-black text-white border-black"
                              : "bg-white text-neutral-700 border-neutral-300"
                          }`}
                        >
                          White Text
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setSlideFormData({ ...slideFormData, textColor: "black" })
                          }
                          className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs border ${
                            slideFormData.textColor === "black"
                              ? "bg-black text-white border-black"
                              : "bg-white text-neutral-700 border-neutral-300"
                          }`}
                        >
                          Black Text
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2.5 border border-neutral-300 text-neutral-700 font-bold uppercase text-xs hover:bg-neutral-100 rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-black text-white font-bold uppercase text-xs hover:bg-neutral-800 transition rounded-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save Slide & Apply"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PROMO CARD MODAL POPUP                                                 */}
      {/* ========================================================================= */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-300 w-full max-w-lg rounded-xs shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-400 block">
                  PROMO CARD CONFIGURATION
                </span>
                <h3 className="text-lg font-black font-mono uppercase text-black">
                  {editingPromoIdx === -1 ? "Add Promo Card" : `Edit Promo Card #${editingPromoIdx + 1}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPromoModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-black rounded-xs transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromoModal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Tag / Label *
                </label>
                <input
                  type="text"
                  required
                  value={promoFormData.tag || ""}
                  onChange={(e) =>
                    setPromoFormData({ ...promoFormData, tag: e.target.value })
                  }
                  placeholder="e.g. NEW DROPS, EXCLUSIVE"
                  className="w-full p-2.5 bg-[#fcfcfc] border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-bold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Card Title *
                </label>
                <input
                  type="text"
                  required
                  value={promoFormData.title || ""}
                  onChange={(e) =>
                    setPromoFormData({ ...promoFormData, title: e.target.value })
                  }
                  placeholder="e.g. Vintage Hoodies, Every Week"
                  className="w-full p-2.5 bg-[#fcfcfc] border border-neutral-300 rounded-xs outline-none focus:border-black font-mono font-black uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={promoFormData.ctaText || ""}
                    onChange={(e) =>
                      setPromoFormData({ ...promoFormData, ctaText: e.target.value })
                    }
                    placeholder="EXPLORE"
                    className="w-full p-2.5 bg-[#fcfcfc] border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={promoFormData.ctaLink || ""}
                    onChange={(e) =>
                      setPromoFormData({ ...promoFormData, ctaLink: e.target.value })
                    }
                    placeholder="/shop"
                    className="w-full p-2.5 bg-[#fcfcfc] border border-neutral-300 rounded-xs outline-none focus:border-black font-mono"
                  />
                </div>
              </div>

              <div>
                <ImageUploadInput
                  label="Promo Card Image (Supports any URL) *"
                  value={promoFormData.image || ""}
                  onChange={(url) =>
                    setPromoFormData({ ...promoFormData, image: url })
                  }
                  placeholder="Paste or upload image URL"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="px-4 py-2.5 border border-neutral-300 text-neutral-700 font-bold uppercase text-xs hover:bg-neutral-100 rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-black text-white font-bold uppercase text-xs hover:bg-neutral-800 transition rounded-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save Card & Apply"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SPOTLIGHT SECTION MODAL POPUP                                          */}
      {/* ========================================================================= */}
      {isSpotlightModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-300 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xs shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-400 block">
                  CATEGORY SPOTLIGHT ROW
                </span>
                <h3 className="text-lg font-black font-mono uppercase text-black">
                  {editingSpotlightIdx === -1 ? "Add Category Spotlight" : `Edit ${spotlightFormData.title}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSpotlightModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-black rounded-xs transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSpotlightModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1 font-mono">
                    Select Category *
                  </label>
                  <select
                    value={spotlightFormData.categorySlug || ""}
                    onChange={(e) => {
                      const newSlug = e.target.value;
                      const catObj = categories.find((c) => c.slug === newSlug);
                      setSpotlightFormData({
                        ...spotlightFormData,
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
                    required
                    value={spotlightFormData.title || ""}
                    onChange={(e) =>
                      setSpotlightFormData({ ...spotlightFormData, title: e.target.value })
                    }
                    placeholder="e.g. HOODIES, OVERSIZED TEES"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1 font-mono">
                    Display Limit
                  </label>
                  <select
                    value={spotlightFormData.limit || 12}
                    onChange={(e) =>
                      setSpotlightFormData({
                        ...spotlightFormData,
                        limit: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xs outline-none focus:border-black font-mono font-bold"
                  >
                    <option value={4}>4 Products</option>
                    <option value={6}>6 Products</option>
                    <option value={8}>8 Products</option>
                    <option value={10}>10 Products</option>
                    <option value={12}>12 Products</option>
                    <option value={16}>16 Products</option>
                  </select>
                </div>
              </div>

              {/* Active status */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold uppercase font-mono">
                  <input
                    type="checkbox"
                    checked={spotlightFormData.enabled !== false}
                    onChange={(e) =>
                      setSpotlightFormData({
                        ...spotlightFormData,
                        enabled: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-black"
                  />
                  <span>Active &amp; Visible on Homepage</span>
                </label>
              </div>

              {/* Curated Products Selection Grid */}
              <div className="pt-3 border-t border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase font-mono text-neutral-700">
                    Curated Products for this section:
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {spotlightFormData.selectedProductIds?.length || 0} selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-2 border border-neutral-200 bg-neutral-50 rounded-xs">
                  {products
                    .filter((p) => p.category === spotlightFormData.categorySlug)
                    .map((p) => {
                      const pId = p._id || p.id || "";
                      const isSelected = (spotlightFormData.selectedProductIds || []).includes(pId);

                      return (
                        <button
                          key={pId}
                          type="button"
                          onClick={() => {
                            const current = spotlightFormData.selectedProductIds || [];
                            const next = isSelected
                              ? current.filter((id) => id !== pId)
                              : [...current, pId];
                            setSpotlightFormData({
                              ...spotlightFormData,
                              selectedProductIds: next,
                            });
                          }}
                          className={`p-2 border rounded-xs flex items-center gap-2 text-left transition cursor-pointer ${
                            isSelected
                              ? "bg-black text-white border-black"
                              : "bg-white border-neutral-200 text-neutral-800"
                          }`}
                        >
                          <div className="relative w-8 h-8 rounded-2xs overflow-hidden shrink-0 bg-neutral-200">
                            {p.images?.[0] ? (
                              <Image
                                src={p.images[0]}
                                alt={p.title}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase truncate font-mono">
                              {p.title}
                            </p>
                            <p className="text-[9px] opacity-75 font-mono">₹{p.price}</p>
                          </div>
                          {isSelected ? <Check className="w-3.5 h-3.5 text-green-400 shrink-0" /> : null}
                        </button>
                      );
                    })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsSpotlightModalOpen(false)}
                  className="px-4 py-2.5 border border-neutral-300 text-neutral-700 font-bold uppercase text-xs hover:bg-neutral-100 rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-black text-white font-bold uppercase text-xs hover:bg-neutral-800 transition rounded-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save Section & Apply"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
