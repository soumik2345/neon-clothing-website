import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getOrderById } from "@/features/orders/services/order.service";
import { getSettings } from "@/features/settings/services/settings.service";
import { formatPrice } from "@/lib/utils/utils";
import { CheckCircle2, Package, Truck, ArrowRight, ArrowLeft, Clock, ShieldCheck, ExternalLink } from "lucide-react";
import { OrderPrintButton } from "@/components/orders/OrderPrintButton";

export const revalidate = 0;

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: OrderPageProps) {
  const { id } = await params;
  const [order, settings] = await Promise.all([
    getOrderById(id),
    getSettings(),
  ]);

  if (!order) {
    notFound();
  }

  const plainOrder = JSON.parse(JSON.stringify(order));
  const currency = settings?.currency || "₹";

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return { title: "ORDER DELIVERED", subtitle: "Your package has been safely delivered to your destination." };
      case "shipped":
        return { title: "ORDER SHIPPED & ON THE WAY", subtitle: "Your items are on the road with our courier partner." };
      case "processing":
        return { title: "ORDER PROCESSING", subtitle: "We are carefully curating and packaging your items." };
      case "cancelled":
        return { title: "ORDER CANCELLED", subtitle: "This order has been cancelled." };
      default:
        return { title: "ORDER CONFIRMED", subtitle: "Thank you for shopping with NEON. Your order has been placed successfully." };
    }
  };

  const statusInfo = getStatusText(order.status);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-4 border-b border-neutral-200">
          <Link
            href="/profile"
            className="text-xs font-bold text-neutral-500 hover:text-black uppercase flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
          </Link>

          <div className="flex items-center gap-3">
            <OrderPrintButton order={plainOrder} variant="outline" />

            <Link
              href={`/track-order?orderId=${encodeURIComponent(order.orderNumber)}`}
              className="text-xs font-bold text-black hover:underline flex items-center gap-1.5 uppercase font-mono"
            >
              <span>Live Tracking</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Header Status Banner */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-black">
            <CheckCircle2 className="w-6 h-6 text-black" />
          </div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400">
            Official Receipt #{order.orderNumber}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black font-mono">
            {statusInfo.title}
          </h1>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            {statusInfo.subtitle}
          </p>
        </div>

        {/* Order Status & Progress */}
        <div className="bg-white border border-neutral-200 p-6 rounded-xs shadow-2xs mb-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 flex-wrap gap-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Order Number</p>
              <p className="text-base font-black font-mono text-black">{order.orderNumber}</p>
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Date Placed</p>
              <p className="text-xs font-bold text-neutral-700">
                {new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Payment</p>
              <p className="text-xs font-bold uppercase text-black font-mono">
                {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Status</p>
              <span className="inline-block uppercase text-xs font-bold px-3 py-1 bg-black text-white rounded-xs">
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

        {/* Items List */}
        <div className="bg-white border border-neutral-200 p-6 rounded-xs shadow-2xs mb-6 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-3 font-mono">
            Purchased Items ({order.items.length})
          </h2>

          <div className="space-y-4 divide-y divide-neutral-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-4 first:pt-0 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-20 bg-neutral-100 shrink-0 overflow-hidden border border-neutral-200">
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="64px" />
                  </div>
                  <div>
                    <p className="font-bold text-black uppercase tracking-tight text-xs sm:text-sm">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1 uppercase">
                      Size: <span className="font-bold text-black">{item.size}</span> • Qty:{" "}
                      <span className="font-bold text-black">{item.quantity}</span>
                    </p>
                    <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                      Unit Price: {formatPrice(item.price, currency)}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm text-black shrink-0">
                  {formatPrice(item.price * item.quantity, currency)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Calculation */}
          <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-black">{formatPrice(order.subtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Shipping Charge</span>
              <span className="font-mono font-bold text-black">
                {order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee, currency)}
              </span>
            </div>
            <div className="border-t border-neutral-200 pt-3 flex justify-between items-center text-sm font-bold text-black">
              <span>Total Amount</span>
              <span className="text-xl font-black font-mono">{formatPrice(order.total, currency)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details Card */}
        <div className="bg-white border border-neutral-200 p-6 rounded-xs shadow-2xs mb-8 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-2.5 font-mono">
            Delivery &amp; Customer Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <p className="text-[10px] font-mono text-neutral-400 uppercase">Customer Name</p>
              <p className="font-bold text-black uppercase mt-0.5">{order.customer.name}</p>
              <p className="text-[10px] font-mono text-neutral-400 uppercase mt-2">Email Address</p>
              <p className="text-neutral-700 font-mono mt-0.5">{order.customer.email}</p>
              <p className="text-[10px] font-mono text-neutral-400 uppercase mt-2">Mobile Phone</p>
              <p className="text-neutral-700 font-mono mt-0.5">{order.customer.phone}</p>
            </div>

            <div>
              <p className="text-[10px] font-mono text-neutral-400 uppercase">Shipping Address</p>
              <p className="text-neutral-800 mt-0.5 font-medium">{order.customer.address}</p>
              <p className="text-neutral-800 font-medium">
                {order.customer.city} - {order.customer.postalCode}
              </p>
              <p className="text-[10px] font-mono text-neutral-400 uppercase mt-2">Payment Method</p>
              <p className="text-neutral-800 font-bold uppercase mt-0.5">
                {order.paymentMethod === "cod" ? "Cash On Delivery" : "Online Gateway"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <OrderPrintButton order={order} variant="primary" />

          <Link
            href={`/track-order?orderId=${encodeURIComponent(order.orderNumber)}`}
            className="w-full sm:w-auto px-6 py-3.5 border border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition flex items-center justify-center gap-2 rounded-xs"
          >
            <Truck className="w-4 h-4" /> Track Live Delivery
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3.5 border border-neutral-300 text-black text-xs font-bold uppercase tracking-wider hover:border-black transition flex items-center justify-center gap-2 rounded-xs"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
