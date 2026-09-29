"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useSettings } from "@/features/settings/context/SettingsContext";
import {
  User as UserIcon,
  Package,
  MapPin,
  LogOut,
  ExternalLink,
  Edit2,
  Check,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  Eye,
  FileText,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

interface OrderItem {
  productId: string;
  title: string;
  slug: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: "cod" | "card";
  total: number;
  shippingFee: number;
  subtotal: number;
  items: OrderItem[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { formatPrice } = useSettings();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [savingAddress, setSavingAddress] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchProfileAndOrders = useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();

      if (!meData.authenticated || !meData.user) {
        router.push("/login?redirect=/profile");
        return;
      }

      setUser(meData.user);
      setAddressForm({
        name: meData.user.name || "",
        phone: meData.user.phone || "",
        street: meData.user.address?.street || "",
        city: meData.user.address?.city || "",
        state: meData.user.address?.state || "",
        postalCode: meData.user.address?.postalCode || "",
        country: meData.user.address?.country || "India",
      });

      // Fetch user's orders
      const ordersRes = await fetch(`/api/orders?email=${encodeURIComponent(meData.user.email)}`);
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        setOrders(ordersData.data || []);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfileAndOrders();
  }, [fetchProfileAndOrders]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addressForm.name,
          phone: addressForm.phone,
          address: {
            street: addressForm.street,
            city: addressForm.city,
            state: addressForm.state,
            postalCode: addressForm.postalCode,
            country: addressForm.country,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setIsEditingAddress(false);
        setStatusMessage("Profile updated successfully!");
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/user/logout", { method: "POST" });
      window.dispatchEvent(new Event("neon-auth-change"));
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-xs">
            <CheckCircle className="w-3 h-3" /> Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-xs">
            <Truck className="w-3 h-3" /> In Transit
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-xs">
            <Check className="w-3 h-3" /> Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded-xs">
            <AlertCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-xs">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fafafa]">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-neutral-200 w-48 rounded-xs" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-64 bg-neutral-200 rounded-xs" />
              <div className="h-64 bg-neutral-200 col-span-2 rounded-xs" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Page Top Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-1">
              ACCOUNT DASHBOARD
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-black uppercase">
              WELCOME, {user.name.split(" ")[0]}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="px-4 py-2 border border-neutral-300 hover:border-black text-xs font-bold uppercase tracking-wider transition bg-white"
            >
              Browse Shop
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile & Shipping Details */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white border border-neutral-200 p-6 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-800 font-mono font-black text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-black uppercase">{user.name}</h2>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                  <span className="inline-block mt-1 text-[9px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2 py-0.5">
                    {user.role} ACCOUNT
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black">
                    <MapPin className="w-4 h-4 text-neutral-500" />
                    <span>Shipping Address</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1 underline"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{isEditingAddress ? "Cancel" : "Edit"}</span>
                  </button>
                </div>

                {!isEditingAddress ? (
                  <div className="text-xs text-neutral-600 space-y-1 bg-[#fcfcfc] p-3 border border-neutral-100">
                    <p className="font-semibold text-black">{user.name}</p>
                    <p>{user.phone || "No phone number added"}</p>
                    {user.address?.street ? (
                      <>
                        <p>{user.address.street}</p>
                        <p>
                          {user.address.city}, {user.address.state} {user.address.postalCode}
                        </p>
                        <p>{user.address.country || "India"}</p>
                      </>
                    ) : (
                      <p className="text-neutral-400 italic">No default address saved yet.</p>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={addressForm.name}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, name: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-[#fcfcfc] border border-neutral-300 focus:border-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, phone: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-[#fcfcfc] border border-neutral-300 focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={addressForm.street}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, street: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-[#fcfcfc] border border-neutral-300 focus:border-black"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, city: e.target.value })
                          }
                          className="w-full text-xs p-2 bg-[#fcfcfc] border border-neutral-300 focus:border-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, state: e.target.value })
                          }
                          className="w-full text-xs p-2 bg-[#fcfcfc] border border-neutral-300 focus:border-black"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={addressForm.postalCode}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, postalCode: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-[#fcfcfc] border border-neutral-300 focus:border-black"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="w-full py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
                    >
                      {savingAddress ? "Saving..." : "Save Address"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white border border-neutral-200 p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">
                Quick Assistance
              </h3>
              <Link
                href="/track-order"
                className="flex items-center justify-between text-xs text-neutral-700 hover:text-black py-1.5 border-b border-neutral-100"
              >
                <span>Track an Order with Number</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-between text-xs text-neutral-700 hover:text-black py-1.5 border-b border-neutral-100"
              >
                <span>Customer Care & Returns</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
              <Link
                href="/shop"
                className="flex items-center justify-between text-xs text-neutral-700 hover:text-black py-1.5"
              >
                <span>Latest Streetwear Drops</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-neutral-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-black font-mono">
                    ORDER HISTORY ({orders.length})
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Track current parcels and view past streetwear acquisitions.
                  </p>
                </div>
                <Package className="w-5 h-5 text-neutral-400" />
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-black uppercase">No Orders Found</h3>
                    <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                      You haven&apos;t placed any orders yet. Explore our curated thrift collections!
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    className="inline-block px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order._id || order.orderNumber}
                      className="border border-neutral-200 p-4 sm:p-5 hover:border-black transition"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                            Order Reference
                          </span>
                          <span className="text-xs font-mono font-black text-black">
                            #{order.orderNumber}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                            Date Placed
                          </span>
                          <span className="text-xs text-neutral-700">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                            Total
                          </span>
                          <span className="text-xs font-bold text-black font-mono">
                            {formatPrice(order.total)}
                          </span>
                        </div>

                        <div>{getStatusBadge(order.status)}</div>
                      </div>

                      {/* Items List */}
                      <div className="py-3 divide-y divide-neutral-100">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-14 bg-neutral-100 overflow-hidden shrink-0">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                                    IMG
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                                  {item.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                                  <span>Size: {item.size}</span>
                                  <span>&bull;</span>
                                  <span>Qty: {item.quantity}</span>
                                </div>
                              </div>
                            </div>

                            <span className="text-xs font-bold text-neutral-900 font-mono shrink-0">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer & Actions */}
                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between flex-wrap gap-3">
                        <span className="text-[11px] text-neutral-500 capitalize">
                          Payment: <span className="font-semibold text-black">{order.paymentMethod.toUpperCase()}</span> ({order.paymentStatus})
                        </span>

                        <div className="flex items-center gap-3">
                          <Link
                            href={`/orders/${encodeURIComponent(order.orderNumber)}`}
                            className="px-3 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition inline-flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </Link>

                          <Link
                            href={`/track-order?orderId=${encodeURIComponent(order.orderNumber)}`}
                            className="px-3 py-1.5 border border-neutral-300 text-neutral-700 hover:text-black hover:border-black text-xs font-bold uppercase tracking-wider transition inline-flex items-center gap-1"
                          >
                            <span>Track</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
