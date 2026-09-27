import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getOrderById } from "@/features/orders/services/order.service";
import { formatPrice } from "@/lib/utils/utils";
import { CheckCircle2, Package, Truck, ArrowRight } from "lucide-react";

export const revalidate = 0;

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full">
        {/* Success Banner */}
        <div className="text-center space-y-3 mb-10">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Order Placed Successfully
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black font-mono">
            THANK YOU FOR YOUR ORDER
          </h1>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            We have received your order #{order.orderNumber}. A confirmation email has been sent to{" "}
            <span className="font-semibold text-black">{order.customer.email}</span>.
          </p>
        </div>

        {/* Tracking Status Card */}
        <div className="bg-white border border-neutral-200 p-6 rounded-xs shadow-2xs mb-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Order Number</p>
              <p className="text-base font-black font-mono text-black">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Status</p>
              <span className="inline-block uppercase text-xs font-bold px-2.5 py-0.5 bg-neutral-900 text-white rounded-xs">
                {order.status}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
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
        </div>

        {/* Items and Details */}
        <div className="bg-white border border-neutral-200 p-6 rounded-xs shadow-2xs space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 divide-y divide-neutral-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-14 bg-neutral-100 shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="48px" />
                  </div>
                  <div>
                    <p className="font-bold text-black uppercase">{item.title}</p>
                    <p className="text-[11px] text-neutral-500">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-black">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-black">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Shipping</span>
              <span className="font-mono font-bold text-black">
                {order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="border-t border-neutral-200 pt-3 flex justify-between text-sm font-bold text-black">
              <span>Total Paid / Due</span>
              <span className="text-lg font-black font-mono">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-neutral-50 p-4 border border-neutral-100 text-xs space-y-1">
            <p className="font-bold uppercase tracking-wider text-black">Delivery Details</p>
            <p className="text-neutral-700">{order.customer.name}</p>
            <p className="text-neutral-600">{order.customer.address}, {order.customer.city} - {order.customer.postalCode}</p>
            <p className="text-neutral-600">Phone: {order.customer.phone}</p>
            <p className="text-neutral-600">Payment: <span className="uppercase font-bold">{order.paymentMethod}</span></p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/shop"
            className="px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition flex items-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
