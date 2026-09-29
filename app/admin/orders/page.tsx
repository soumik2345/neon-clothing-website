"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Package, Search, CheckCircle, Clock, Truck, AlertCircle, ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { OrderType } from "@/features/orders/types/order.types";
import { formatPrice } from "@/lib/utils/utils";
import { OrderInvoiceMemo } from "@/components/orders/OrderInvoiceMemo";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isPrintMemoOpen, setIsPrintMemoOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const json = await res.json();
      if (json.success) setOrders(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (
    id?: string,
    newStatus?: OrderType["status"],
    newPayment?: OrderType["paymentStatus"]
  ) => {
    if (!id || !newStatus) return;

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, paymentStatus: newPayment }),
      });
      const json = await res.json();
      if (json.success) {
        if (selectedOrder && (selectedOrder._id === id || selectedOrder.id === id)) {
          setSelectedOrder(json.data);
        }
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, search]);

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filterStatus === "all" || o.status === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredOrders.length);
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Order Management" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 border border-neutral-200 rounded-xs shadow-2xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by order ID, name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 text-xs rounded-xs outline-none focus:border-black transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs transition whitespace-nowrap ${
                    filterStatus === st
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xs shadow-2xs overflow-hidden">
            {loading ? (
              <div className="py-20 text-center text-xs text-neutral-400">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm font-semibold text-neutral-700">No orders found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 uppercase text-[11px] font-bold text-neutral-600 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium">
                    {paginatedOrders.map((order) => {
                      const isSelected = selectedOrder?.orderNumber === order.orderNumber;
                      return (
                        <tr
                          key={order.orderNumber}
                          onClick={() => setSelectedOrder(order)}
                          className={`cursor-pointer transition ${
                            isSelected ? "bg-neutral-100/90" : "hover:bg-neutral-50/80"
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-black">
                            {order.orderNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-neutral-900">{order.customer.name}</p>
                            <p className="text-[11px] text-neutral-400">{order.customer.email}</p>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-500 text-[11px]">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : "Recent"}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-black font-mono">
                            {formatPrice(order.total)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`uppercase text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                                order.status === "delivered"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "processing"
                                  ? "bg-amber-100 text-amber-800"
                                  : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-neutral-100 text-neutral-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && filteredOrders.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t border-neutral-200 bg-neutral-50/50 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <span>
                    Showing <span className="font-bold text-neutral-900">{startIndex + 1}</span>-
                    <span className="font-bold text-neutral-900">{endIndex}</span> of{" "}
                    <span className="font-bold text-neutral-900">{filteredOrders.length}</span>
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="ml-1 bg-white border border-neutral-200 px-2 py-0.5 rounded-xs text-[11px] font-bold outline-none focus:border-black cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={safeCurrentPage === 1}
                      className="p-1 border border-neutral-200 rounded-xs bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        if (totalPages <= 5) return true;
                        if (page === 1 || page === totalPages) return true;
                        return Math.abs(page - safeCurrentPage) <= 1;
                      })
                      .map((page, idx, arr) => {
                        const prev = arr[idx - 1];
                        return (
                          <React.Fragment key={page}>
                            {prev && page - prev > 1 && (
                              <span className="px-1 text-neutral-400 select-none">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`w-6 h-6 flex items-center justify-center text-[11px] font-mono font-bold rounded-xs transition cursor-pointer ${
                                safeCurrentPage === page
                                  ? "bg-black text-white"
                                  : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={safeCurrentPage === totalPages}
                      className="p-1 border border-neutral-200 rounded-xs bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Details Panel */}
          <div className="bg-white border border-neutral-200 rounded-xs shadow-2xs p-5 space-y-5">
            {selectedOrder ? (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <div>
                    <h3 className="text-sm font-black font-mono uppercase text-black">
                      {selectedOrder.orderNumber}
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Placed on {new Date(selectedOrder.createdAt || Date.now()).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`uppercase text-[10px] font-bold px-2.5 py-1 rounded-xs ${
                      selectedOrder.status === "delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-neutral-900 text-white"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Status Updater */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 block">
                    Update Order Status
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleUpdateStatus(
                        selectedOrder._id || selectedOrder.id,
                        e.target.value as OrderType["status"]
                      )
                    }
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-xs font-bold uppercase tracking-wider rounded-xs outline-none focus:border-black"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Customer Details */}
                <div className="space-y-1.5 text-xs bg-neutral-50 p-3.5 rounded-xs border border-neutral-100">
                  <p className="font-bold text-neutral-900 uppercase tracking-tight">
                    {selectedOrder.customer.name}
                  </p>
                  <p className="text-neutral-600">{selectedOrder.customer.email}</p>
                  <p className="text-neutral-600">{selectedOrder.customer.phone}</p>
                  <p className="text-neutral-600 pt-1">
                    {selectedOrder.customer.address}, {selectedOrder.customer.city} -{" "}
                    {selectedOrder.customer.postalCode}
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Ordered Items ({selectedOrder.items.length})
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 bg-white border border-neutral-100 rounded-xs"
                      >
                        <div className="relative w-10 h-12 bg-neutral-100 shrink-0 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-black uppercase truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            Size: {item.size} × {item.quantity}
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-black">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financials */}
                <div className="pt-3 border-t border-neutral-200 space-y-1 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping:</span>
                    <span>
                      {selectedOrder.shippingFee === 0 ? "FREE" : formatPrice(selectedOrder.shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-black text-sm pt-1">
                    <span>Total:</span>
                    <span className="font-mono">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Print Cash Memo Action */}
                <div className="pt-3 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setIsPrintMemoOpen(true)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-emerald-400" />
                    Print Cash Memo / Invoice
                  </button>
                </div>
              </>
            ) : (
              <div className="py-24 text-center">
                <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-neutral-500">
                  Select an order to view full details and update status.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Printable Cash Memo Modal */}
      {selectedOrder && (
        <OrderInvoiceMemo
          order={selectedOrder}
          isOpen={isPrintMemoOpen}
          onClose={() => setIsPrintMemoOpen(false)}
        />
      )}
    </div>
  );
}
