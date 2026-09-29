"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Check, Save, Sliders, Eye, EyeOff } from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { CategoryType } from "@/features/categories/types/category.types";
import { ImageUploadInput } from "@/components/ui/ImageUploadInput";
import { ShopByCategorySectionType } from "@/features/banners/types/banner.types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  // Shop By Category Section Settings from Banners
  const [sectionConfig, setSectionConfig] = useState<ShopByCategorySectionType>({
    enabled: true,
    title: "SHOP BY CATEGORY",
    limit: 5,
    selectedCategories: [],
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
    order: 1,
    showOnHome: true,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, banRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/banners"),
      ]);

      const catJson = await catRes.json();
      if (catJson.success) setCategories(catJson.data);

      const banJson = await banRes.json();
      if (banJson.success && banJson.data.shopByCategorySection) {
        setSectionConfig({
          enabled: banJson.data.shopByCategorySection.enabled !== false,
          title: banJson.data.shopByCategorySection.title || "SHOP BY CATEGORY",
          limit: Number(banJson.data.shopByCategorySection.limit) || 5,
          selectedCategories:
            banJson.data.shopByCategorySection.selectedCategories &&
            banJson.data.shopByCategorySection.selectedCategories.length > 0
              ? banJson.data.shopByCategorySection.selectedCategories
              : catJson.data?.slice(0, 5).map((c: CategoryType) => c.slug) || [],
        });
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

  // Handle saving Shop By Category Homepage configuration
  const handleSaveSectionConfig = async () => {
    setSavingConfig(true);
    try {
      const res = await fetch("/api/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopByCategorySection: {
            enabled: sectionConfig.enabled,
            title: sectionConfig.title || "SHOP BY CATEGORY",
            limit: Number(sectionConfig.limit) || 5,
            selectedCategories: sectionConfig.selectedCategories,
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setConfigSaved(true);
        setTimeout(() => setConfigSaved(false), 3000);
      } else {
        alert(json.error || "Failed to save section settings");
      }
    } catch (err) {
      console.error("Error saving section config:", err);
      alert("Error saving section config");
    } finally {
      setSavingConfig(false);
    }
  };

  // Toggle category in selectedCategories list
  const toggleCategorySelection = (slug: string) => {
    const current = sectionConfig.selectedCategories || [];
    let updated: string[];
    if (current.includes(slug)) {
      updated = current.filter((s) => s !== slug);
    } else {
      updated = [...current, slug];
    }
    setSectionConfig({ ...sectionConfig, selectedCategories: updated });
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      image: "",
      description: "",
      order: categories.length + 1,
      showOnHome: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CategoryType) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      slug: c.slug,
      image: c.image,
      description: c.description || "",
      order: c.order || 1,
      showOnHome: c.showOnHome !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name.toUpperCase(),
      slug:
        formData.slug.trim() ||
        formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      image: formData.image,
      description: formData.description,
      order: Number(formData.order),
      showOnHome: formData.showOnHome,
    };

    try {
      if (editingCategory) {
        const id = editingCategory._id || editingCategory.id;
        const res = await fetch(`/api/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setIsModalOpen(false);
          fetchData();
        } else {
          alert(json.error || "Failed to update category");
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setIsModalOpen(false);
          fetchData();
        } else {
          alert(json.error || "Failed to create category");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error saving category");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchData();
      } else {
        alert(json.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectedSlugs = sectionConfig.selectedCategories || [];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Category & Shop By Category Management" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl">
        {/* Top Card: Shop By Category Section Homepage Settings */}
        <div className="bg-white border-2 border-black p-5 sm:p-6 rounded-xs shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-black" />
                <h2 className="text-sm sm:text-base font-black uppercase text-black font-mono tracking-wide">
                  Homepage &quot;Shop By Category&quot; Settings
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Configure mobile slider (shows 2–3 items initially with smooth auto-slide) &amp; desktop grid. Select fixed count (5 or 6) and choose which categories to display.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer font-mono font-bold text-xs uppercase bg-neutral-100 px-3 py-1.5 rounded-xs">
                <input
                  type="checkbox"
                  checked={sectionConfig.enabled}
                  onChange={(e) =>
                    setSectionConfig({ ...sectionConfig, enabled: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-black focus:ring-black"
                />
                <span>{sectionConfig.enabled ? "Section Active" : "Section Hidden"}</span>
              </label>

              <button
                type="button"
                onClick={handleSaveSectionConfig}
                disabled={savingConfig}
                className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition rounded-xs disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {configSaved ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{savingConfig ? "Saving..." : "Save Settings"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Configuration Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block uppercase font-bold text-neutral-800 mb-1.5 font-mono">
                Section Heading Title
              </label>
              <input
                type="text"
                value={sectionConfig.title || ""}
                onChange={(e) =>
                  setSectionConfig({ ...sectionConfig, title: e.target.value })
                }
                placeholder="SHOP BY CATEGORY"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono font-bold"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-800 mb-1.5 font-mono">
                Fixed Display Amount (Limit) *
              </label>
              <select
                value={sectionConfig.limit || 5}
                onChange={(e) =>
                  setSectionConfig({ ...sectionConfig, limit: Number(e.target.value) })
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
                Currently configured to display up to {sectionConfig.limit || 5} categories.
              </p>
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-800 mb-1.5 font-mono">
                Selection Status
              </label>
              <div className="p-2.5 bg-neutral-100 border border-neutral-200 rounded-xs font-mono font-bold text-xs flex items-center justify-between">
                <span>Selected Categories:</span>
                <span className="bg-black text-white px-2 py-0.5 rounded-xs">
                  {selectedSlugs.length} / {sectionConfig.limit || 5}
                </span>
              </div>
              <div className="flex gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setSectionConfig({
                      ...sectionConfig,
                      selectedCategories: categories.slice(0, sectionConfig.limit || 5).map((c) => c.slug),
                    })
                  }
                  className="text-[10px] text-neutral-600 hover:text-black font-mono underline"
                >
                  Select First {sectionConfig.limit || 5}
                </button>
                <span className="text-[10px] text-neutral-300">|</span>
                <button
                  type="button"
                  onClick={() =>
                    setSectionConfig({
                      ...sectionConfig,
                      selectedCategories: categories.map((c) => c.slug),
                    })
                  }
                  className="text-[10px] text-neutral-600 hover:text-black font-mono underline"
                >
                  Select All
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Category Selector Checklist */}
          <div>
            <label className="block uppercase font-bold text-neutral-800 mb-2 font-mono text-xs">
              Check / Uncheck Categories to show on Homepage:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {categories.map((cat) => {
                const isSelected = selectedSlugs.includes(cat.slug);
                const orderIndex = selectedSlugs.indexOf(cat.slug);
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => toggleCategorySelection(cat.slug)}
                    className={`p-2.5 border rounded-xs flex items-center gap-2.5 text-left transition cursor-pointer ${
                      isSelected
                        ? "border-black bg-neutral-900 text-white shadow-2xs"
                        : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded-xs overflow-hidden shrink-0 bg-neutral-800">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold uppercase truncate font-mono">
                        {cat.name}
                      </p>
                      <p className="text-[9px] opacity-70 font-mono truncate">
                        /{cat.slug}
                      </p>
                    </div>
                    {isSelected ? (
                      <span className="shrink-0 text-[10px] font-mono font-bold bg-white text-black px-1.5 py-0.5 rounded-2xs">
                        #{orderIndex + 1}
                      </span>
                    ) : (
                      <span className="shrink-0 w-4 h-4 rounded-2xs border border-neutral-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Categories Header & Add Button */}
        <div className="flex items-center justify-between bg-white p-4 border border-neutral-200 rounded-xs shadow-2xs">
          <div>
            <h2 className="text-sm font-bold uppercase text-black font-mono">All Categories</h2>
            <p className="text-xs text-neutral-500">
              Manage store categories, image visuals, descriptions and homepage visibility
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition rounded-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        {/* Categories Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {loading ? (
            <div className="col-span-full py-16 text-center text-xs text-neutral-400 font-mono">
              Loading categories...
            </div>
          ) : (
            categories.map((c) => {
              const isSelected = selectedSlugs.includes(c.slug);
              const orderIndex = selectedSlugs.indexOf(c.slug);

              return (
                <div
                  key={c._id || c.slug}
                  className={`bg-white border rounded-xs overflow-hidden shadow-2xs flex flex-col justify-between transition ${
                    isSelected ? "border-black ring-1 ring-black" : "border-neutral-200"
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full bg-neutral-900">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      className="object-cover opacity-90"
                      sizes="250px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-between p-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        {isSelected ? (
                          <span className="px-2 py-0.5 bg-black text-white text-[9px] font-mono font-bold uppercase rounded-2xs border border-white/40">
                            Homepage #{orderIndex + 1}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-black/60 text-neutral-300 text-[9px] font-mono uppercase rounded-2xs">
                            Hidden from Home
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-black uppercase text-white font-mono tracking-wider">
                        {c.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col gap-2.5 border-t border-neutral-100 bg-neutral-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-neutral-500 uppercase truncate">
                        slug: /{c.slug}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-200 rounded-xs transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id || c.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xs transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Quick 1-click Toggle Homepage Visibility */}
                    <button
                      type="button"
                      onClick={() => toggleCategorySelection(c.slug)}
                      className={`w-full py-1.5 px-2 text-[10px] font-mono font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition ${
                        isSelected
                          ? "bg-black text-white hover:bg-neutral-800"
                          : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Eye className="w-3 h-3 text-green-400" /> On Homepage
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-neutral-400" /> Click to Add to Home
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-md shadow-2xl p-6 overflow-hidden rounded-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-black font-mono">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1 font-mono">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HOODIES"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-bold font-mono"
                />
              </div>

              <div>
                <ImageUploadInput
                  label="Category Image *"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  description="Upload file or enter direct URL"
                  placeholder="Paste category image URL"
                  aspectRatioClass="aspect-square"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1 font-mono">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description"
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1 font-mono">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-700">
                    <input
                      type="checkbox"
                      checked={formData.showOnHome}
                      onChange={(e) => setFormData({ ...formData, showOnHome: e.target.checked })}
                      className="w-4 h-4 rounded text-black focus:ring-black"
                    />
                    <span>Show on Home</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 uppercase font-bold hover:bg-neutral-100 rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white uppercase font-bold hover:bg-neutral-800 rounded-xs cursor-pointer"
                >
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
