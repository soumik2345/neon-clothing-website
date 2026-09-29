"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Search, Package, ArrowRight, CheckCircle2, Clock, Truck, ShieldCheck, ExternalLink } from "lucide-react";
import { OrderType } from "@/features/orders/types/order.types";
import { useSettings } from "@/features/settings/context/SettingsContext";

function TrackOrderContent() {
  const { formatPrice } = useSettings();
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get("orderId") || searchParams.get("id") || "";

  const [orderNumber, setOrderNumber] = useState(queryOrderId);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderData = useCallback(async (targetNum: string) => {
    if (!targetNum.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(targetNum.trim())}`);
      const json = await res.json();
      if (json.success && json.data) {
        setOrder(json.data);
      } else {
        setError("Order not found. Please double check your order number (e.g. NEON-1082).");
      }
    } catch {
      setError("Failed to fetch order status. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (queryOrderId) {
      setOrderNumber(queryOrderId);
      fetchOrderData(queryOrderId);
    }
  }, [queryOrderId, fetchOrderData]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrderData(orderNumber);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          DELIVERY TRACKING
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black font-mono">
          TRACK YOUR ORDER
        </h1>
        <p className="text-xs text-neutral-500 max-w-md mx-auto">
          Enter your NEON order number (found in your receipt, order history, or confirmation email) to view live status.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleTrack} className="bg-white p-6 border border-neutral-200 shadow-2xs mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              required
              placeholder="e.g. NEON-1082"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 text-xs font-mono font-bold uppercase outline-none focus:border-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {loading ? "Tracking..." : "Track"}
          </button>
        </div>
        {error && <p className="text-xs text-red-600 font-semibold mt-3">{error}</p>}
      </form>

      {/* Tracking Result */}
      {order && (
        <div className="bg-white border border-neutral-200 p-6 rounded-xs shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div>
              <p className="text-xs text-neutral-500 font-medium">Order Number</p>
              <p className="text-base font-black font-mono text-black">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <span className="uppercase text-xs font-bold px-3 py-1 bg-black text-white rounded-xs">
                {order.status}
              </span>
              <p className="text-[10px] text-neutral-400 font-mono mt-1">
                Payment: {order.paymentStatus.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {["pending", "processing", "shipped", "delivered"].map((step, idx) => {
              const stepIndex = ["pending", "processing", "shipped", "delivered"].indexOf(order.status);
              const isPassed = stepIndex >= idx;
              return (
                <div key={step} className="space-y-2">
                  <div
                    className={`h-1.5 rounded-full ${
                      isPassed ? "bg-black" : "bg-neutral-200"
                    }`}
                  />
                  <p
                    className={`uppercase font-bold text-[10px] tracking-wider ${
                      isPassed ? "text-black" : "text-neutral-400"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Order Details Preview */}
          <div className="border-t border-neutral-100 pt-4 text-xs space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-black uppercase">{order.customer.name}</p>
                <p className="text-neutral-600">
                  {order.customer.address}, {order.customer.city} - {order.customer.postalCode}
                </p>
                <p className="text-neutral-500 text-[11px]">Phone: {order.customer.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-neutral-500">
                  Total Items: <span className="font-bold text-black">{order.items.length}</span>
                </p>
                <p className="text-base font-black font-mono text-black mt-1">
                  {formatPrice(order.total)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between flex-wrap gap-3">
            <Link
              href={`/orders/${order.orderNumber}`}
              className="px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition inline-flex items-center gap-1.5"
            >
              <span>View Full Order Details &amp; Invoice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/profile"
              className="text-xs text-neutral-500 hover:text-black uppercase font-medium underline"
            >
              Back to My Profile &amp; Orders
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full">
        <Suspense
          fallback={
            <div className="py-20 text-center text-xs text-neutral-400 font-mono">
              Loading tracking information...
            </div>
          }
        >
          <TrackOrderContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
