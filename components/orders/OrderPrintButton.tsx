"use client";

import React, { useState } from "react";
import { Printer } from "lucide-react";
import { OrderType } from "@/features/orders/types/order.types";
import { OrderInvoiceMemo } from "./OrderInvoiceMemo";

interface OrderPrintButtonProps {
  order: OrderType;
  variant?: "primary" | "outline" | "compact";
}

export function OrderPrintButton({ order, variant = "outline" }: OrderPrintButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {variant === "compact" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 border border-neutral-300 hover:border-black text-neutral-700 hover:text-black rounded-xs transition text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer"
          title="Print Cash Memo"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Print Memo</span>
        </button>
      ) : variant === "primary" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto px-6 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Print Cash Memo / Invoice</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 border border-neutral-300 hover:border-black text-black text-xs font-bold uppercase tracking-wider rounded-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-neutral-600" />
          <span>Download / Print Memo</span>
        </button>
      )}

      <OrderInvoiceMemo
        order={order}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
