"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/features/cart/context/CartContext";
import { useSettings } from "@/features/settings/context/SettingsContext";
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const { formatPrice, freeShippingThreshold } = useSettings();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: { street?: string; city?: string; postalCode?: string };
  } | null>(null);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");

  // Load logged-in user profile to avoid redundant typing
  React.useEffect(() => {
    async function loadUserProfile() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.authenticated && json.user) {
          setUserProfile(json.user);
          setCustomer({
            name: json.user.name || "",
            email: json.user.email || "",
            phone: json.user.phone || "",
            address: json.user.address?.street || "",
            city: json.user.address?.city || "",
            postalCode: json.user.address?.postalCode || "",
          });
        }
      } catch (err) {
        console.error("Failed to load user profile in checkout:", err);
      }
    }
    loadUserProfile();
  }, []);

  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer,
        items: cart.map((i) => ({
          productId: i.productId,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          size: i.size,
          image: i.image,
        })),
        paymentMethod,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        clearCart();
        router.push(`/orders/${json.data.orderNumber}`);
      } else {
        alert(json.error || "Failed to process order");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
        <Header />
        <main className="flex-1 max-w-lg mx-auto px-4 py-20 text-center">
          <h1 className="text-xl font-black uppercase text-black font-mono">Your Cart is Empty</h1>
          <p className="text-xs text-neutral-500 mt-2 mb-6">
            Please add streetwear items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider"
          >
            Go to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 w-full">
        <div className="mb-8">
          <Link
            href="/cart"
            className="text-xs text-neutral-500 hover:text-black flex items-center gap-1.5 uppercase font-medium mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Bag
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black font-mono">
            SECURE CHECKOUT
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Customer & Shipping Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* Logged in User Saved Address Banner */}
            {userProfile && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xs text-xs flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold uppercase tracking-wider text-emerald-950 font-mono">
                    Signed in as {userProfile.name || userProfile.email}
                  </p>
                  <p className="text-emerald-800 mt-0.5">
                    Your profile contact &amp; shipping details have been auto-filled below. You can update or edit them anytime before placing the order.
                  </p>
                </div>
              </div>
            )}

            {/* Contact Details */}
            <div className="bg-white p-6 border border-neutral-200 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-3">
                1. Customer Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-none outline-none focus:border-black placeholder:text-neutral-400"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-none outline-none focus:border-black placeholder:text-neutral-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block uppercase font-bold text-neutral-700 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-none outline-none focus:border-black placeholder:text-neutral-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 border border-neutral-200 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-3">
                2. Delivery Address
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1">
                    Street Address &amp; Apartment *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House / flat no., street, area"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-none outline-none focus:border-black placeholder:text-neutral-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase font-bold text-neutral-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="City / District"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded-none outline-none focus:border-black placeholder:text-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-neutral-700 mb-1">
                      Postal Code / PIN *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="6-digit PIN code"
                      value={customer.postalCode}
                      onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded-none outline-none focus:border-black font-mono placeholder:text-neutral-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white p-6 border border-neutral-200 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-3">
                3. Payment Method
              </h2>

              <div className="space-y-3 text-xs">
                <label
                  className={`flex items-start gap-3 p-3.5 border cursor-pointer transition ${
                    paymentMethod === "cod" ? "border-black bg-neutral-50" : "border-neutral-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="font-bold text-black uppercase">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-neutral-500">Pay cash upon package handover at your doorstep.</p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-3.5 border cursor-pointer transition ${
                    paymentMethod === "card" ? "border-black bg-neutral-50" : "border-neutral-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="font-bold text-black uppercase">Card / UPI Online Payment</p>
                    <p className="text-[11px] text-neutral-500">Fast simulation checkout with 100% encrypted gateway.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Review Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-neutral-200 p-6 space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-3">
                Order Review ({cart.length})
              </h2>

              <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-neutral-100">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-neutral-100 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-black uppercase line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-neutral-500">
                          Qty: {item.quantity} • Size: {item.size}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-black">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-black">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span className="font-mono font-bold text-black">
                    {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-3 flex justify-between text-sm font-bold text-black">
                  <span>Total Amount</span>
                  <span className="text-lg font-black font-mono">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition disabled:opacity-50"
              >
                {loading ? "Processing Order..." : `Confirm & Place Order (${formatPrice(total)})`}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>SSL Encrypted 256-bit Secure Checkout</span>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
