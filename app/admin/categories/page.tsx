"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { CategoryType } from "@/features/categories/types/category.types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
    order: 1,
  });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      description: "Collection of curated pieces",
      order: categories.length + 1,
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
          fetchCategories();
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
          fetchCategories();
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
        fetchCategories();
      } else {
        alert(json.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Category Management" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl">
        <div className="flex items-center justify-between bg-white p-4 border border-neutral-200 rounded-xs shadow-2xs">
          <div>
            <h2 className="text-sm font-bold uppercase text-black">Shop By Category Section</h2>
            <p className="text-xs text-neutral-500">
              The 5 main category cards displayed on the homepage
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition rounded-xs"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {loading ? (
            <div className="col-span-full py-16 text-center text-xs text-neutral-400">
              Loading categories...
            </div>
          ) : (
            categories.map((c) => (
              <div
                key={c._id || c.slug}
                className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] w-full bg-neutral-900">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover opacity-90"
                    sizes="250px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <h3 className="text-base font-black uppercase text-white font-mono tracking-wider">
                      {c.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50">
                  <span className="text-[11px] font-mono text-neutral-500 uppercase">
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
              </div>
            ))
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
                className="p-1 text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HOODIES"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black"
                />
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 uppercase font-bold hover:bg-neutral-100 rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white uppercase font-bold hover:bg-neutral-800 rounded-xs"
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
