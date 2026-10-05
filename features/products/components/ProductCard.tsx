"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Plus } from "lucide-react";
import { ProductType } from "../types/product.types";
import { formatPrice as baseFormatPrice } from "@/lib/utils/utils";
import { useCart } from "@/features/cart/context/CartContext";
import { useSettings } from "@/features/settings/context/SettingsContext";

interface ProductCardProps {
  product: ProductType;
  currency?: string;
}

export function ProductCard({ product, currency }: ProductCardProps) {
  const { cart, addToCart, updateQuantity } = useCart();
  const { formatPrice: contextFormatPrice } = useSettings();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : "M"
  );

  const cartItem = cart.find(
    (item) => item.productId === (product._id || product.id || product.slug)
  );
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const displayPrice = (val: number) =>
    currency ? baseFormatPrice(val, currency) : contextFormatPrice(val);

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
        <div className="relative aspect-[4/5] w-full bg-[#f4f4f4] overflow-hidden rounded-xs">
          <Image
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.title}
            fill
            className={`object-cover object-center transition-all duration-500 ${
              product.images[1] ? "group-hover:opacity-0" : "group-hover:scale-105"
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />

          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.title} alternate view`}
              fill
              className="object-cover object-center transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />
          )}

          {/* Multiple Photos Badge */}
          {product.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-2xs opacity-80 group-hover:opacity-100 transition">
              +{product.images.length - 1} photos
            </div>
          )}

          {/* Condition or Discount Tag */}
          {typeof product.originalPrice === "number" && product.originalPrice > product.price ? (
            <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-2xs">
              SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          ) : null}
        </div>

        {/* Product Meta */}
        <div className="pt-3 pb-2 space-y-1">
          <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1 group-hover:text-black">
            {product.title}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-neutral-900">
              {displayPrice(product.price)}
            </span>
            {typeof product.originalPrice === "number" && product.originalPrice > product.price ? (
              <span className="text-[11px] text-neutral-400 line-through">
                {displayPrice(product.originalPrice)}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      {/* ADD TO CART or Inline Quantity Controller */}
      <div className="pt-1">
        {quantityInCart > 0 && cartItem ? (
          <div className="flex items-center justify-between bg-black text-white h-9 px-1 rounded-none">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateQuantity(cartItem.productId, cartItem.size, cartItem.quantity - 1);
              }}
              className="w-8 h-7 flex items-center justify-center hover:bg-neutral-800 transition cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-bold tracking-wider">
              {quantityInCart} IN BAG
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateQuantity(cartItem.productId, cartItem.size, cartItem.quantity + 1);
              }}
              className="w-8 h-7 flex items-center justify-center hover:bg-neutral-800 transition cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-black text-white py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition duration-150 flex items-center justify-center gap-1.5 rounded-none cursor-pointer"
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
        )}
      </div>
    </div>
  );
}
