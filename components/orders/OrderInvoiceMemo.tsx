"use client";

import React, { useRef } from "react";
import { Printer, X } from "lucide-react";
import { formatPrice } from "@/lib/utils/utils";
import { OrderType } from "@/features/orders/types/order.types";

interface OrderInvoiceMemoProps {
  order: OrderType;
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
  storeEmail?: string;
}

export function OrderInvoiceMemo({
  order,
  isOpen,
  onClose,
  storeName = "NEON STREETWEAR",
  storeAddress = "Streetwear Vault, Fashion District, Mumbai, India",
  storePhone = "+91 98765 43210",
  storeEmail = "support@neonthrift.com",
}: OrderInvoiceMemoProps) {
  const memoRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs print:p-0 print:bg-white print:static print:block">
      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-2xl shadow-2xl rounded-xs overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:w-full print:max-w-none print:rounded-none">
        
        {/* Screen Action Bar (Hidden when printing) */}
        <div className="flex items-center justify-between p-4 bg-neutral-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase font-mono tracking-wider">
              Official Cash Memo / Invoice
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold uppercase tracking-wider rounded-xs transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xs transition cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice / Cash Memo Body */}
        <div
          ref={memoRef}
          className="p-6 sm:p-8 overflow-y-auto print:p-0 print:overflow-visible text-neutral-900 bg-white"
          id="printable-memo"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between border-b-2 border-black pb-5 gap-4">
            <div>
              <h1 className="text-2xl font-black font-mono tracking-tight uppercase text-black">
                {storeName}
              </h1>
              <p className="text-[11px] uppercase tracking-widest text-neutral-500 font-mono">
                Archival &amp; Vintage Curated Drops
              </p>
              <p className="text-xs text-neutral-600 mt-2 max-w-xs leading-tight">
                {storeAddress}
              </p>
              <p className="text-xs text-neutral-600 font-mono">
                Tel: {storePhone} • Email: {storeEmail}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="inline-block px-2.5 py-1 bg-black text-white text-xs font-black uppercase tracking-widest font-mono rounded-xs mb-2">
                CASH MEMO / INVOICE
              </span>
              <p className="text-sm font-bold font-mono text-black">
                #{order.orderNumber}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                Date: {orderDate}
              </p>
              <p className="text-[11px] uppercase font-bold text-neutral-700 mt-0.5">
                Payment: <span className="font-mono">{order.paymentMethod.toUpperCase()} ({order.paymentStatus.toUpperCase()})</span>
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-neutral-200 text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-wider">
                Billed &amp; Shipped To:
              </p>
              <p className="font-bold text-black uppercase text-sm mt-1">
                {order.customer.name}
              </p>
              <p className="text-neutral-600 mt-0.5">{order.customer.phone}</p>
              <p className="text-neutral-600 font-mono">{order.customer.email}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-wider">
                Delivery Address:
              </p>
              <p className="text-neutral-800 mt-1 font-medium leading-relaxed">
                {order.customer.address}, {order.customer.city} - {order.customer.postalCode}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1 font-mono">
                Order Status: <span className="uppercase font-bold text-black">{order.status}</span>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-4">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2 border-black font-bold uppercase text-[11px] font-mono tracking-wider">
                <tr>
                  <th className="py-2.5 px-2 w-8">#</th>
                  <th className="py-2.5 px-2">Item Description</th>
                  <th className="py-2.5 px-2 text-center w-16">Size</th>
                  <th className="py-2.5 px-2 text-center w-14">Qty</th>
                  <th className="py-2.5 px-2 text-right w-24">Rate</th>
                  <th className="py-2.5 px-2 text-right w-24">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-medium">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-2 text-neutral-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-2">
                      <p className="font-bold text-black uppercase">{item.title}</p>
                      <p className="text-[10px] text-neutral-400 font-mono uppercase">
                        SKU: NEON-PROD-{idx + 101}
                      </p>
                    </td>
                    <td className="py-3 px-2 text-center font-bold font-mono uppercase">
                      {item.size}
                    </td>
                    <td className="py-3 px-2 text-center font-mono">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-neutral-700">
                      {formatPrice(item.price)}
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-black">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="border-t-2 border-black pt-3 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-[11px] text-neutral-500 max-w-xs space-y-1">
              <p className="font-bold text-black uppercase font-mono text-xs">Terms &amp; Conditions:</p>
              <p>• Authentic curated vintage streetwear pieces.</p>
              <p>• 7 days exchange policy available on unworn items with tags intact.</p>
              <p>• For inquiries, contact support at {storeEmail}.</p>
            </div>

            <div className="w-full sm:w-60 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold text-black">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping Fee:</span>
                <span className="font-mono font-semibold text-black">
                  {order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="border-t border-black pt-2 flex justify-between items-center text-sm font-black text-black">
                <span className="uppercase font-mono">Grand Total:</span>
                <span className="font-mono text-base">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Signature & Barcode aesthetic */}
          <div className="mt-8 pt-6 border-t border-dashed border-neutral-300 flex items-end justify-between">
            <div className="text-[10px] font-mono text-neutral-400 space-y-1">
              <div className="h-6 w-32 border-b border-black/40 flex items-center justify-center tracking-widest text-[9px]">
                |||||| | |||||||| | |||
              </div>
              <p>AUTH-VERIFIED #{order.orderNumber}</p>
            </div>

            <div className="text-right">
              <div className="w-36 border-b border-black mb-1"></div>
              <p className="text-[10px] uppercase font-bold text-neutral-700 font-mono">
                Authorized Signatory
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
