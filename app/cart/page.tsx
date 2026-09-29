"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/features/cart/context/CartContext";
import { formatPrice } from "@/lib/utils/utils";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, MapPin, CheckCircle2, User, UserCheck } from "lucide-react";

interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
  };
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.authenticated && json.user) {
          setCurrentUser(json.user);
        }
      } catch (err) {
        console.error("Failed to load user in cart:", err);
      }
    }
    checkAuth();
  }, []);

  const freeShippingThreshold = 1499;
  const difference = freeShippingThreshold - subtotal;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "NEON10") {
      setDiscount(Math.round(subtotal * 0.1));
      setCouponApplied(true);
    } else {
      alert("Invalid code. Use NEON10 for 10% off.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 w-full">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black font-mono mb-8">
          YOUR SHOPPING BAG ({cart.length})
        </h1>

        {cart.length === 0 ? (
          <div className="py-24 text-center bg-white border border-neutral-200 p-8 max-w-md mx-auto">
            <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4 stroke-1" />
            <h2 className="text-base font-bold uppercase text-black">Your bag is empty</h2>
            <p className="text-xs text-neutral-500 mt-1 mb-6">
              Looks like you haven&apos;t added any curated streetwear yet.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Items Table */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free shipping bar */}
              <div className="bg-neutral-50 p-4 border border-neutral-200">
                <p className="text-xs font-semibold text-neutral-800">
                  {difference <= 0 ? (
                    <span className="text-emerald-700">🎉 Congratulations! You unlocked Free Shipping.</span>
                  ) : (
                    <>
                      Add <span className="font-bold">{formatPrice(difference)}</span> more for Free Shipping
                    </>
                  )}
                </p>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-black h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white border border-neutral-200 divide-y divide-neutral-100">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-24 bg-neutral-100 shrink-0 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-xs sm:text-sm font-bold uppercase text-black hover:underline"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-neutral-500 mt-1 uppercase">
                          Size: <span className="font-bold text-black">{item.size}</span>
                        </p>
                        <p className="text-xs font-mono font-bold text-black mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      <div className="flex items-center border border-neutral-300 h-10 px-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="p-1 text-neutral-500 hover:text-black font-bold text-sm"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-bold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="p-1 text-neutral-500 hover:text-black font-bold text-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black font-mono text-black">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-neutral-400 hover:text-red-600 text-xs inline-flex items-center gap-1 mt-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={clearCart}
                  className="text-xs text-neutral-400 hover:text-neutral-800 underline uppercase"
                >
                  Clear Bag
                </button>
                <Link
                  href="/shop"
                  className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary Box */}
            <div className="lg:col-span-4 space-y-5">
              {/* Delivery Details Card for Logged In User */}
              {currentUser ? (
                <div className="bg-white border border-neutral-200 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-black flex items-center gap-1.5 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-black" /> Delivery Details
                    </span>
                    <Link
                      href="/profile"
                      className="text-[10px] font-bold text-neutral-500 hover:text-black uppercase underline"
                    >
                      Edit Profile
                    </Link>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="font-bold text-black uppercase">
                      {currentUser.name || "Customer Account"}
                    </p>
                    <p className="text-neutral-500 text-[11px]">{currentUser.email}</p>
                    {currentUser.phone && (
                      <p className="text-neutral-600 text-[11px] font-mono">
                        Phone: {currentUser.phone}
                      </p>
                    )}
                    {currentUser.address?.street ? (
                      <p className="text-neutral-700 text-xs pt-1">
                        {currentUser.address.street}
                        {currentUser.address.city && `, ${currentUser.address.city}`}
                        {currentUser.address.postalCode && ` - ${currentUser.address.postalCode}`}
                      </p>
                    ) : (
                      <p className="text-neutral-400 italic text-[11px] pt-1">
                        No address saved yet. You can provide it at checkout.
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Auto-applied to your checkout</span>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-50 border border-neutral-200 p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-black font-mono">
                    <User className="w-3.5 h-3.5 text-neutral-600" /> Fast Checkout
                  </div>
                  <p className="text-neutral-500 text-[11px]">
                    <Link href="/login?redirect=/cart" className="text-black font-bold underline">
                      Sign in
                    </Link>{" "}
                    to auto-load your saved shipping address and phone number.
                  </p>
                </div>
              )}

              <div className="bg-white border border-neutral-200 p-6 space-y-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-3">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-black">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Estimated Shipping</span>
                    <span className="font-mono font-bold text-black">
                      {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                    </span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount (NEON10)</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="border-t border-neutral-200 pt-3 flex justify-between items-center text-sm font-bold text-black">
                    <span>Estimated Total</span>
                    <span className="text-lg font-black font-mono">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyCoupon} className="pt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. NEON10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 p-2 bg-neutral-50 border border-neutral-300 text-xs uppercase font-mono rounded-none outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black"
                  >
                    Apply
                  </button>
                </form>

                <Link
                  href="/checkout"
                  className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
