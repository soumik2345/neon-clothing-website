import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Layers,
  Sliders,
  Settings,
} from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { getOrders } from "@/features/orders/services/order.service";
import { getProducts } from "@/features/products/services/product.service";
import { getCategories } from "@/features/categories/services/category.service";
import { getSettings } from "@/features/settings/services/settings.service";
import { formatPrice } from "@/lib/utils/utils";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [orders, products, categories, settings] = await Promise.all([
    getOrders(),
    getProducts(),
    getCategories(),
    getSettings(),
  ]);

  const currency = settings.currency || "₹";
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Dashboard Overview" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1 max-w-7xl">
        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Revenue */}
          <div className="bg-white p-5 border border-neutral-200 rounded-xs shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Total Revenue
              </span>
              <div className="p-2 bg-neutral-100 rounded-xs">
                <TrendingUp className="w-4 h-4 text-neutral-800" />
              </div>
            </div>
            <p className="text-2xl font-black text-black mt-3 font-mono">
              {formatPrice(totalRevenue, currency)}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              Active Store Sales
            </p>
          </div>

          {/* Orders */}
          <div className="bg-white p-5 border border-neutral-200 rounded-xs shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Total Orders
              </span>
              <div className="p-2 bg-neutral-100 rounded-xs">
                <Package className="w-4 h-4 text-neutral-800" />
              </div>
            </div>
            <p className="text-2xl font-black text-black mt-3 font-mono">{totalOrders}</p>
            <p className="text-[11px] text-neutral-500 mt-1">Processed orders</p>
          </div>

          {/* Products */}
          <div className="bg-white p-5 border border-neutral-200 rounded-xs shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Total Products
              </span>
              <div className="p-2 bg-neutral-100 rounded-xs">
                <ShoppingBag className="w-4 h-4 text-neutral-800" />
              </div>
            </div>
            <p className="text-2xl font-black text-black mt-3 font-mono">{totalProducts}</p>
            <p className="text-[11px] text-neutral-500 mt-1">Across {categories.length} categories</p>
          </div>

          {/* Low Stock Warning */}
          <div className="bg-white p-5 border border-neutral-200 rounded-xs shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Low Stock Alert
              </span>
              <div className="p-2 bg-amber-50 rounded-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600 mt-3 font-mono">
              {lowStockProducts.length}
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Items need restocking</p>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">
            Quick Site Management
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href="/admin/products"
              className="p-4 border border-neutral-200 hover:border-black transition rounded-xs text-left group"
            >
              <ShoppingBag className="w-5 h-5 text-neutral-700 group-hover:text-black mb-2" />
              <p className="text-xs font-bold uppercase text-black">Manage Products</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Add, edit prices &amp; stock</p>
            </Link>

            <Link
              href="/admin/categories"
              className="p-4 border border-neutral-200 hover:border-black transition rounded-xs text-left group"
            >
              <Layers className="w-5 h-5 text-neutral-700 group-hover:text-black mb-2" />
              <p className="text-xs font-bold uppercase text-black">Categories</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Edit 5 main categories</p>
            </Link>

            <Link
              href="/admin/banners"
              className="p-4 border border-neutral-200 hover:border-black transition rounded-xs text-left group"
            >
              <Sliders className="w-5 h-5 text-neutral-700 group-hover:text-black mb-2" />
              <p className="text-xs font-bold uppercase text-black">Banners &amp; Hero</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Announcement &amp; promos</p>
            </Link>

            <Link
              href="/admin/settings"
              className="p-4 border border-neutral-200 hover:border-black transition rounded-xs text-left group"
            >
              <Settings className="w-5 h-5 text-neutral-700 group-hover:text-black mb-2" />
              <p className="text-xs font-bold uppercase text-black">Store Settings</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Threshold &amp; contact info</p>
            </Link>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white border border-neutral-200 rounded-xs shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                Recent Customer Orders
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Live customer orders from checkout
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 uppercase text-[11px] font-bold text-neutral-600 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.orderNumber} className="hover:bg-neutral-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-black">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-neutral-900">{order.customer.name}</p>
                      <p className="text-[11px] text-neutral-400">{order.customer.city}</p>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">
                      {order.items.length} item(s)
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900 font-mono">
                      {formatPrice(order.total, currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-xs">
                        {order.paymentMethod}
                      </span>
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
                            : "bg-neutral-100 text-neutral-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders?view=${order.orderNumber}`}
                        className="text-xs font-bold uppercase text-black hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
