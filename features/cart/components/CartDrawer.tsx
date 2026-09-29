"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSettings } from "@/features/settings/context/SettingsContext";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
  } = useCart();
  const { formatPrice, freeShippingThreshold } = useSettings();

  if (!isCartOpen) return null;

  const difference = freeShippingThreshold - subtotal;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-neutral-900 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-base font-bold tracking-tight uppercase">Your Bag ({cart.length})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-100">
            <p className="text-xs font-medium text-neutral-700">
              {difference <= 0 ? (
                <span className="text-emerald-600 font-semibold">🎉 You unlocked FREE SHIPPING!</span>
              ) : (
                <>
                  Add <span className="font-bold text-neutral-900">{formatPrice(difference)}</span> more for Free Shipping
                </>
              )}
            </p>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-neutral-900 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-neutral-100">
            {cart.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <ShoppingBag className="w-12 h-12 text-neutral-300 stroke-1 mb-4" />
                <p className="text-sm font-medium text-neutral-500 mb-4">Your shopping bag is empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="py-4 flex gap-4 first:pt-0">
                  <div className="relative w-20 h-24 bg-neutral-100 shrink-0 overflow-hidden rounded-xs">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs font-bold uppercase tracking-tight text-neutral-900 hover:underline line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-neutral-400 hover:text-red-500 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-medium px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-xs uppercase">
                          Size: {item.size}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-neutral-200 rounded-xs">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-neutral-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 space-y-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-neutral-600">Subtotal</span>
                <span className="text-base font-bold text-neutral-900">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Taxes and shipping calculated at checkout
              </p>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black transition rounded-xs"
                >
                  Checkout Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 border border-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-wider flex items-center justify-center hover:bg-neutral-100 transition rounded-xs"
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
