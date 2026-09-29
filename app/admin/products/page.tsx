"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Search, X, Check, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { ProductType } from "@/features/products/types/product.types";
import { CategoryType } from "@/features/categories/types/category.types";
import { formatPrice } from "@/lib/utils/utils";
import { ImageUploadInput } from "@/components/ui/ImageUploadInput";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: 0,
    originalPrice: 0,
    category: "",
    description: "",
    condition: "",
    image: "",
    sizes: "",
    stock: 1,
    isTrending: false,
    isFeatured: false,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const prodJson = await prodRes.json();
      const catJson = await catRes.json();
      if (prodJson.success) setProducts(prodJson.data);
      if (catJson.success) setCategories(catJson.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      slug: "",
      price: 0,
      originalPrice: 0,
      category: categories[0]?.slug || "",
      description: "",
      condition: "",
      image: "",
      sizes: "",
      stock: 1,
      isTrending: false,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductType) => {
    setEditingProduct(p);
    setFormData({
      title: p.title,
      slug: p.slug,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      category: p.category,
      description: p.description,
      condition: p.condition || "",
      image: p.images[0] || "",
      sizes: p.sizes ? p.sizes.join(", ") : "",
      stock: p.stock,
      isTrending: p.isTrending,
      isFeatured: p.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      slug:
        formData.slug.trim() ||
        formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      category: formData.category.toLowerCase(),
      description: formData.description,
      condition: formData.condition,
      images: [formData.image],
      sizes: formData.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stock: Number(formData.stock),
      isTrending: formData.isTrending,
      isFeatured: formData.isFeatured,
      isNewArrival: true,
    };

    try {
      if (editingProduct) {
        const id = editingProduct._id || editingProduct.id;
        const res = await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setIsModalOpen(false);
          fetchData();
        } else {
          alert(json.error || "Failed to update product");
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setIsModalOpen(false);
          fetchData();
        } else {
          alert(json.error || "Failed to create product");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "all" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Product Management" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 border border-neutral-200 rounded-xs shadow-2xs">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 text-xs rounded-xs outline-none focus:border-black transition"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 bg-neutral-50 border border-neutral-200 text-xs rounded-xs outline-none focus:border-black uppercase font-medium"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition rounded-xs shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white border border-neutral-200 rounded-xs shadow-2xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-neutral-400">Loading catalog...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm font-semibold text-neutral-700">No products found.</p>
              <p className="text-xs text-neutral-400 mt-1">Try changing filters or add a new product.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 uppercase text-[11px] font-bold text-neutral-600 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Trending</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {paginatedProducts.map((p) => (
                    <tr key={p._id || p.id} className="hover:bg-neutral-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 bg-neutral-100 shrink-0 overflow-hidden rounded-xs">
                            <Image
                              src={p.images[0]}
                              alt={p.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-black uppercase tracking-tight line-clamp-1">
                              {p.title}
                            </p>
                            <p className="text-[11px] text-neutral-400 font-mono">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="uppercase text-[11px] font-bold px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded-xs">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-black font-mono">
                        {formatPrice(p.price)}
                        {typeof p.originalPrice === "number" && p.originalPrice > p.price ? (
                          <span className="text-[10px] text-neutral-400 line-through ml-1.5 font-normal">
                            {formatPrice(p.originalPrice)}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-xs text-[11px] ${
                            p.stock <= 5
                              ? "bg-amber-100 text-amber-900"
                              : "bg-neutral-100 text-neutral-800"
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.isTrending ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs">
                            <Check className="w-3 h-3" /> Yes
                          </span>
                        ) : (
                          <span className="text-neutral-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-xs transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id || p.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xs transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Toolbar */}
          {!loading && filteredProducts.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-neutral-200 bg-neutral-50/50 text-xs text-neutral-600">
              <div className="flex items-center gap-3">
                <span>
                  Showing <span className="font-bold text-neutral-900">{startIndex + 1}</span> to{" "}
                  <span className="font-bold text-neutral-900">{endIndex}</span> of{" "}
                  <span className="font-bold text-neutral-900">{filteredProducts.length}</span> products
                </span>
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="text-neutral-400">Per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-neutral-200 px-2 py-1 rounded-xs text-xs font-bold outline-none focus:border-black cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={safeCurrentPage === 1}
                    className="p-1.5 border border-neutral-200 rounded-xs bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      if (totalPages <= 5) return true;
                      if (page === 1 || page === totalPages) return true;
                      return Math.abs(page - safeCurrentPage) <= 1;
                    })
                    .map((page, idx, arr) => {
                      const prev = arr[idx - 1];
                      return (
                        <React.Fragment key={page}>
                          {prev && page - prev > 1 && (
                            <span className="px-1 text-neutral-400 select-none">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`w-7 h-7 flex items-center justify-center text-xs font-mono font-bold rounded-xs transition cursor-pointer ${
                              safeCurrentPage === page
                                ? "bg-black text-white"
                                : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={safeCurrentPage === totalPages}
                    className="p-1.5 border border-neutral-200 rounded-xs bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col rounded-xs">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-black font-mono">
                {editingProduct ? "Edit Product" : "Add New Streetwear Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Product Title"
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, originalPrice: Number(e.target.value) })
                    }
                    className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-medium"
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono"
                  />
                </div>
              </div>

              <div>
                <ImageUploadInput
                  label="Product Image *"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  description="Upload file or enter direct URL"
                  placeholder="Paste product image URL"
                  aspectRatioClass="aspect-[4/5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1">
                    Condition Rating
                  </label>
                  <input
                    type="text"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    placeholder="e.g. Mint Condition (9/10)"
                    className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1">
                    Sizes (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="e.g. S, M, L, XL"
                    className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter detailed description of the item"
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="w-4 h-4 rounded text-black focus:ring-black"
                  />
                  <span>Show in TRENDING NOW (Homepage)</span>
                </label>
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
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
