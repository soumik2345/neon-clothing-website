"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Shield,
  Truck,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  ChevronDown,
  Info,
} from "lucide-react";
import { ProductType } from "../types/product.types";
import { useCart } from "@/features/cart/context/CartContext";
import { useSettings } from "@/features/settings/context/SettingsContext";

interface ProductDetailsProps {
  product: ProductType;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { formatPrice, freeShippingThreshold } = useSettings();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : "M"
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("fabric");

  const defaultFabricBullets = [
    "Premium heavyweight french terry cotton / vintage washed blend.",
    "Relaxed dropped-shoulder boxy streetwear cut.",
    "Double-needle stitching across collar, cuffs, and hem for archival durability.",
  ];

  const defaultCareBullets = [
    "Turn inside out before washing to protect graphic prints and embroidery.",
    "Machine wash cold on gentle cycle with similar dark colors.",
    "Hang dry in shade. Do not tumble dry to preserve fabric drape.",
  ];

  const parseBullets = (text?: string, fallback: string[] = []) => {
    if (!text || !text.trim()) return fallback;
    const lines = text
      .split("\n")
      .map((line) => line.trim().replace(/^[•\-\*]\s*/, ""))
      .filter(Boolean);
    return lines.length > 0 ? lines : fallback;
  };

  const fabricBullets = parseBullets(product.fabricSilhouette, defaultFabricBullets);
  const careBullets = parseBullets(product.careGuide, defaultCareBullets);

  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.jpg"];

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product._id || product.id || product.slug,
        title: product.title,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        size: selectedSize,
        image: images[selectedImage] || images[0],
        category: product.category,
      },
      quantity
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(
      {
        productId: product._id || product.id || product.slug,
        title: product.title,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        size: selectedSize,
        image: images[selectedImage] || images[0],
        category: product.category,
      },
      quantity
    );
    router.push("/checkout");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
      {/* Left Column: Interactive Multi-Image Gallery */}
      <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
        {/* Thumbnails Strip */}
        {images.length > 1 && (
          <div className="flex md:flex-col gap-2.5 shrink-0 overflow-x-auto no-scrollbar py-1 md:py-0 md:max-h-[600px] md:overflow-y-auto">
            {images.map((img, idx) => {
              const isSelected = selectedImage === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-20 md:w-20 md:h-24 bg-neutral-100 overflow-hidden rounded-xs border-2 transition shrink-0 cursor-pointer ${
                    isSelected
                      ? "border-black ring-1 ring-black shadow-xs opacity-100"
                      : "border-neutral-200 opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/80 text-white text-[8px] font-mono font-bold uppercase text-center py-0.5">
                      Main
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Main Hero Image Frame with Navigation Overlay */}
        <div className="relative aspect-[4/5] flex-1 bg-neutral-100 overflow-hidden rounded-xs border border-neutral-200 group">
          <Image
            src={images[selectedImage] || images[0]}
            alt={product.title}
            fill
            priority
            className="object-cover object-center transition-all duration-300"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />

          {/* Condition Tag at Top Left */}
          {product.condition && (
            <div className="absolute top-4 left-4 z-10 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xs shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{product.condition}</span>
            </div>
          )}

          {/* Image Counter Badge at Top Right */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 z-10 bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-full">
              {selectedImage + 1} / {images.length}
            </div>
          )}

          {/* Previous / Next Arrow Controls */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-black rounded-full flex items-center justify-center shadow-md opacity-80 md:opacity-0 group-hover:opacity-100 transition cursor-pointer active:scale-95"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-black rounded-full flex items-center justify-center shadow-md opacity-80 md:opacity-0 group-hover:opacity-100 transition cursor-pointer active:scale-95"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right Column: Product Content & Purchase Controls */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/shop?category=${product.category}`}
              className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black transition"
            >
              {product.category}
            </Link>

            {/* Stock Urgency Tag */}
            {product.stock <= 5 && product.stock > 0 ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-xs uppercase">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                Only {product.stock} left in stock
              </span>
            ) : product.stock > 5 ? (
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs uppercase">
                In Stock &amp; Ready to Ship
              </span>
            ) : (
              <span className="text-[11px] font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded-xs uppercase">
                Out of Stock
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black font-mono mt-1.5">
            {product.title}
          </h1>

          {/* Pricing & Discount */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-2xl sm:text-3xl font-black text-black font-mono">
              {formatPrice(product.price)}
            </span>
            {typeof product.originalPrice === "number" && product.originalPrice > product.price ? (
              <>
                <span className="text-sm sm:text-base text-neutral-400 line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 uppercase rounded-xs">
                  SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            ) : null}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1 font-mono">
            Taxes included. Free standard shipping on orders over {formatPrice(freeShippingThreshold)}.
          </p>
        </div>

        {/* Description Section */}
        <div className="border-t border-b border-neutral-200 py-4 space-y-2">
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-black">
                Select Size: <span className="font-mono text-neutral-900">{selectedSize}</span>
              </span>
              <Link href="/size-guide" className="text-[11px] text-neutral-500 hover:text-black underline">
                Size Guide
              </Link>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-12 h-11 px-3.5 border text-xs font-bold uppercase tracking-wider rounded-xs transition cursor-pointer ${
                    selectedSize === size
                      ? "border-black bg-black text-white shadow-xs"
                      : "border-neutral-300 text-neutral-800 hover:border-black bg-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity and Purchase Buttons */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-neutral-300 h-12 px-3 rounded-xs bg-white">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-neutral-500 hover:text-black px-2 py-1 font-bold text-base cursor-pointer"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-3 font-mono font-bold text-xs">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="text-neutral-500 hover:text-black px-2 py-1 font-bold text-base cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 h-12 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition flex items-center justify-center gap-2 rounded-xs cursor-pointer active:scale-98"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  ADDED TO BAG
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  ADD TO CART
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full h-12 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition flex items-center justify-center gap-2 rounded-xs cursor-pointer"
          >
            BUY IT NOW <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="bg-neutral-50 p-4 border border-neutral-200 space-y-3 text-xs rounded-xs">
          <div className="flex items-center gap-2.5 text-neutral-700">
            <Shield className="w-4 h-4 text-black shrink-0" />
            <span>100% Verified Authentic Handpicked &amp; Restored Piece</span>
          </div>
          <div className="flex items-center gap-2.5 text-neutral-700">
            <Truck className="w-4 h-4 text-black shrink-0" />
            <span>Dispatched within 24 hours. Express 2-4 day delivery</span>
          </div>
          <div className="flex items-center gap-2.5 text-neutral-700">
            <RefreshCw className="w-4 h-4 text-black shrink-0" />
            <span>7-day easy returns &amp; exchanges on unworn items</span>
          </div>
        </div>

        {/* Expandable Specifications Accordion */}
        <div className="border-t border-neutral-200 divide-y divide-neutral-200 text-xs">
          {/* Fabric & Fit */}
          <div>
            <button
              type="button"
              onClick={() => setOpenAccordion(openAccordion === "fabric" ? null : "fabric")}
              className="w-full py-3.5 flex items-center justify-between font-bold uppercase tracking-wider text-black text-left"
            >
              <span>Fabric &amp; Silhouette</span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-500 transition-transform ${
                  openAccordion === "fabric" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openAccordion === "fabric" && (
              <div className="pb-4 text-neutral-600 space-y-1.5 leading-relaxed">
                {fabricBullets.map((line, idx) => (
                  <p key={idx}>• {line}</p>
                ))}
              </div>
            )}
          </div>

          {/* Care Instructions */}
          <div>
            <button
              type="button"
              onClick={() => setOpenAccordion(openAccordion === "care" ? null : "care")}
              className="w-full py-3.5 flex items-center justify-between font-bold uppercase tracking-wider text-black text-left"
            >
              <span>Care &amp; Wash Guide</span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-500 transition-transform ${
                  openAccordion === "care" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openAccordion === "care" && (
              <div className="pb-4 text-neutral-600 space-y-1.5 leading-relaxed">
                {careBullets.map((line, idx) => (
                  <p key={idx}>• {line}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
