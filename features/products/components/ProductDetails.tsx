"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Shield, Truck, RefreshCw, ShoppingBag, ArrowRight } from "lucide-react";
import { ProductType } from "../types/product.types";
import { formatPrice } from "@/lib/utils/utils";
import { useCart } from "@/features/cart/context/CartContext";

interface ProductDetailsProps {
  product: ProductType;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : "M"
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product._id || product.id || product.slug,
        title: product.title,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        size: selectedSize,
        image: product.images[selectedImage] || product.images[0],
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
        image: product.images[selectedImage] || product.images[0],
        category: product.category,
      },
      quantity
    );
    router.push("/checkout");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
      {/* Left Gallery */}
      <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex md:flex-col gap-3 shrink-0 overflow-x-auto">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-16 h-20 md:w-20 md:h-24 bg-neutral-100 overflow-hidden border-2 transition ${
                  selectedImage === idx ? "border-black" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`${product.title} ${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Main Image */}
        <div className="relative aspect-[4/5] flex-1 bg-neutral-100 overflow-hidden">
          <Image
            src={product.images[selectedImage] || product.images[0]}
            alt={product.title}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />

          {/* Condition Tag */}
          <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
            {product.condition}
          </div>
        </div>
      </div>

      {/* Right Details */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        <div>
          <Link
            href={`/shop?category=${product.category}`}
            className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition"
          >
            {product.category}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black font-mono mt-1">
            {product.title}
          </h1>

          {/* Price & Discount */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-2xl font-black text-black font-mono">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-sm text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 uppercase">
                  SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Taxes included. Free shipping on orders &gt; ₹1499</p>
        </div>

        {/* Description */}
        <div className="border-t border-b border-neutral-200 py-4">
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Size Selection */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-black">
              Select Size: <span className="font-mono">{selectedSize}</span>
            </span>
            <Link href="/size-guide" className="text-[11px] text-neutral-500 hover:underline">
              Size Guide
            </Link>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`min-w-12 h-11 px-3 border text-xs font-bold uppercase tracking-wider transition ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 text-neutral-800 hover:border-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-neutral-300 h-12 px-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-neutral-500 hover:text-black px-2 py-1 font-bold text-base"
              >
                -
              </button>
              <span className="px-3 font-bold text-xs">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="text-neutral-500 hover:text-black px-2 py-1 font-bold text-base"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 h-12 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition flex items-center justify-center gap-2"
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
            className="w-full h-12 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition flex items-center justify-center gap-2"
          >
            BUY IT NOW <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="bg-neutral-50 p-4 border border-neutral-200 space-y-3 text-xs">
          <div className="flex items-center gap-2.5 text-neutral-700">
            <Shield className="w-4 h-4 text-black shrink-0" />
            <span>100% Authentic Handpicked &amp; Quality Checked Thrift</span>
          </div>
          <div className="flex items-center gap-2.5 text-neutral-700">
            <Truck className="w-4 h-4 text-black shrink-0" />
            <span>Dispatched within 24 hours. Express 2-4 day delivery</span>
          </div>
          <div className="flex items-center gap-2.5 text-neutral-700">
            <RefreshCw className="w-4 h-4 text-black shrink-0" />
            <span>7-day easy returns &amp; exchanges</span>
          </div>
        </div>
      </div>
    </div>
  );
}
