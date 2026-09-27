"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { ProductType } from "../types/product.types";
import { formatPrice } from "@/lib/utils/utils";
import { useCart } from "@/features/cart/context/CartContext";

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : "M"
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    addToCart({
      productId: product._id || product.id || product.slug,
      title: product.title,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      size: selectedSize,
      image: product.images[0],
      category: product.category,
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="group flex flex-col justify-between bg-white text-left transition duration-200">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Product Image Frame */}
        <div className="relative aspect-[4/5] w-full bg-[#f4f4f4] overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />

          {/* Condition or Discount Tag */}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Product Meta */}
        <div className="pt-3 pb-2 space-y-1">
          <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1 group-hover:text-black">
            {product.title}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* ADD TO CART Button - Exactly matching the mockup */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-black text-white py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition duration-150 flex items-center justify-center gap-1.5 rounded-none"
        >
          {isAdding ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              ADDED
            </>
          ) : (
            "ADD TO CART"
          )}
        </button>
      </div>
    </div>
  );
}
