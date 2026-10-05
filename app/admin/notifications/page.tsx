"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Send,
  Trash2,
  ExternalLink,
  Sparkles,
  Tag,
  Package,
  Flame,
  Zap,
  CheckCircle2,
  Clock,
  Smartphone,
  Globe,
  Radio,
  RefreshCw,
} from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { NotificationItem, NotificationTypeEnum } from "@/features/notifications/types/notification.types";

const QUICK_TEMPLATES = [
  {
    label: "⚡ Midnight Flash Sale",
    title: "⚡ MIDNIGHT ARCHIVE SALE: 20% OFF",
    message: "Unlock 20% off all heavyweight hoodies and graphic tees for the next 4 hours only.",
    type: "promo" as NotificationTypeEnum,
    targetUrl: "/shop?sort=price_asc",
  },
  {
    label: "🔥 New Streetwear Drop",
    title: "🔥 DROP 04: ARCHIVAL VINTAGE WASHES",
    message: "New oversized hoodies, tactical cargo pants, and vintage tees have just landed.",
    type: "drop" as NotificationTypeEnum,
    targetUrl: "/shop?category=hoodies",
  },
  {
    label: "📦 Free Shipping Weekend",
    title: "📦 ZERO SHIPPING ON ALL ARCHIVE PIECES",
    message: "Enjoy free standard delivery across all domestic orders this weekend only. No min cart value.",
    type: "promo" as NotificationTypeEnum,
    targetUrl: "/shop",
  },
  {
    label: "🚨 Limited Restock Alert",
    title: "🚨 VAULT RESTOCK: HEAVYWEIGHT CUTS",
    message: "Limited quantities restocked in size M, L, and XL. Claim yours before it sells out permanently.",
    type: "drop" as NotificationTypeEnum,
    targetUrl: "/shop",
  },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationTypeEnum>("promo");
  const [targetUrl, setTargetUrl] = useState("/shop");
  const [imageUrl, setImageUrl] = useState("");
  const [targetUserEmail, setTargetUserEmail] = useState("");

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=50");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleApplyTemplate = (tmpl: typeof QUICK_TEMPLATES[0]) => {
    setTitle(tmpl.title);
    setMessage(tmpl.message);
    setType(tmpl.type);
    setTargetUrl(tmpl.targetUrl);
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setStatusMessage({ type: "error", text: "Please enter both Title and Message." });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          type,
          targetUrl: targetUrl.trim() || "/shop",
          imageUrl: imageUrl.trim() || undefined,
          targetUserEmail: targetUserEmail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to broadcast notification.");
      }

      setStatusMessage({
        type: "success",
        text: "Notification broadcast successfully to all subscribers!",
      });

      // Clear form
      setTitle("");
      setMessage("");
      setTargetUrl("/shop");
      setImageUrl("");
      setTargetUserEmail("");

      // Trigger browser notification test if supported
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(title, {
            body: message,
            icon: "/favicon.ico",
          });
        } catch {
          // ignore
        }
      }

      fetchNotifications();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "An error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification broadcast?")) return;
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => (n.id || n._id) !== id));
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleTestBrowserAlert = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification("⚡ NEON ARCHIVE PUSH TEST", {
        body: "Web browser push notifications are active and working perfectly!",
        icon: "/favicon.ico",
      });
    } else {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        new Notification("⚡ NEON ARCHIVE PUSH TEST", {
          body: "Push alerts enabled! You will now receive drops and order status updates.",
          icon: "/favicon.ico",
        });
      } else {
        alert("Notification permission was denied in your browser settings.");
      }
    }
  };

  const promoCount = notifications.filter((n) => n.type === "promo").length;
  const dropCount = notifications.filter((n) => n.type === "drop").length;
  const orderCount = notifications.filter((n) => n.type === "order").length;

  return (
    <div className="flex-1 flex flex-col bg-[#fdfdfd] min-h-screen font-sans">
      <AdminHeader title="Notifications & Broadcasts" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl w-full">
        {/* Top Info Banner & Browser Test */}
        <div className="bg-white border border-neutral-200 p-5 rounded-xs shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
                OMNICHANNEL BROADCAST HUB ACTIVE
              </span>
            </div>
            <p className="text-xs text-neutral-600">
              Broadcast promotional flash sales, drop announcements, and order status updates directly to website users, web push subscribers, and mobile apps.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTestBrowserAlert}
            className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-2 rounded-xs border border-neutral-300 transition shrink-0"
          >
            <Bell className="w-4 h-4 text-black" />
            Test Browser Push
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-neutral-200 p-4 rounded-xs shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase text-neutral-500">Total Broadcasts</span>
            <div className="text-2xl font-black font-mono text-black mt-1">{notifications.length}</div>
          </div>
          <div className="bg-white border border-neutral-200 p-4 rounded-xs shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase text-amber-600">Promo Campaigns</span>
            <div className="text-2xl font-black font-mono text-amber-600 mt-1">{promoCount}</div>
          </div>
          <div className="bg-white border border-neutral-200 p-4 rounded-xs shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase text-cyan-600">Drop &amp; Restock Alerts</span>
            <div className="text-2xl font-black font-mono text-cyan-600 mt-1">{dropCount}</div>
          </div>
          <div className="bg-white border border-neutral-200 p-4 rounded-xs shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-600">Order Updates</span>
            <div className="text-2xl font-black font-mono text-emerald-600 mt-1">{orderCount}</div>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xs text-xs font-mono font-bold uppercase tracking-wide border flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-red-50 border-red-300 text-red-800"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {statusMessage.text}
          </div>
        )}

        {/* Main Grid: Composer & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Composer */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 p-6 rounded-xs shadow-2xs space-y-6">
            <div className="border-b border-neutral-200 pb-4">
              <h2 className="text-sm font-black font-mono uppercase tracking-wider text-black flex items-center gap-2">
                <Send className="w-4 h-4 text-black" />
                COMPOSE NEW BROADCAST
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Select a quick preset or craft a custom push alert for your audience.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600">
                QUICK TEMPLATE PRESETS
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="p-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xs text-left transition flex items-center justify-between"
                  >
                    <span className="text-xs font-mono font-bold text-neutral-800 truncate">
                      {tmpl.label}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-4">
              {/* Type Selector */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  NOTIFICATION TYPE / TAG
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["promo", "drop", "order", "general"] as NotificationTypeEnum[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider border rounded-xs transition ${
                        type === t
                          ? "bg-black text-white border-black"
                          : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  NOTIFICATION TITLE *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ⚡ MIDNIGHT FLASH DROP: 25% OFF"
                  className="w-full bg-neutral-50 border border-neutral-300 text-black px-3.5 py-2.5 text-xs font-mono focus:outline-hidden focus:border-black transition rounded-xs"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  MESSAGE BODY *
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Use code ARCHIVE25 at checkout for the next 2 hours. Shop our heavyweight fleece collection now."
                  className="w-full bg-neutral-50 border border-neutral-300 text-black px-3.5 py-2.5 text-xs font-mono focus:outline-hidden focus:border-black transition rounded-xs resize-none"
                />
              </div>

              {/* Target Link */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  TARGET ACTION LINK (CLICK DESTINATION)
                </label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="/shop or /shop?category=hoodies or /track-order"
                  className="w-full bg-neutral-50 border border-neutral-300 text-black px-3.5 py-2.5 text-xs font-mono focus:outline-hidden focus:border-black transition rounded-xs"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-neutral-500 font-mono self-center mr-1">Quick Links:</span>
                  {["/shop", "/shop?category=hoodies", "/shop?category=t-shirts", "/shop?category=pants", "/track-order"].map((link) => (
                    <button
                      key={link}
                      type="button"
                      onClick={() => setTargetUrl(link)}
                      className="text-[10px] font-mono bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-xs border border-neutral-200"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific User Target (Optional) */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  SPECIFIC USER EMAIL (OPTIONAL - LEAVE BLANK FOR ALL SUBSCRIBERS)
                </label>
                <input
                  type="email"
                  value={targetUserEmail}
                  onChange={(e) => setTargetUserEmail(e.target.value)}
                  placeholder="Leave empty for public broadcast to all users"
                  className="w-full bg-neutral-50 border border-neutral-300 text-black px-3.5 py-2.5 text-xs font-mono focus:outline-hidden focus:border-black transition rounded-xs"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black hover:bg-neutral-800 text-white font-mono font-bold uppercase tracking-wider py-3 px-4 text-xs transition rounded-xs flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    BROADCASTING...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    BROADCAST NOTIFICATION NOW
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Live Mockup Previews */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-neutral-200 p-6 rounded-xs shadow-2xs space-y-4">
              <h3 className="text-xs font-black font-mono uppercase tracking-wider text-black flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-black" />
                LIVE DEVICE PREVIEW
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono">
                How this notification will appear on iOS, Android, and Desktop Browser.
              </p>

              {/* Mockup Card */}
              <div className="bg-[#0c0c0c] border border-neutral-800 p-4 rounded-lg shadow-xl relative space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 bg-white text-black font-mono font-black text-[10px] flex items-center justify-center rounded-xs">
                      N
                    </div>
                    <span className="text-[11px] font-mono font-bold tracking-widest text-neutral-300 uppercase">
                      NEON STORE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">NOW</span>
                </div>

                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-xs bg-neutral-800 text-amber-400">
                      {type}
                    </span>
                    <h4 className="text-xs font-bold font-mono text-white truncate">
                      {title || "⚡ MIDNIGHT FLASH DROP: 20% OFF"}
                    </h4>
                  </div>
                  <p className="text-[11px] text-neutral-300 mt-1.5 leading-relaxed font-sans line-clamp-3">
                    {message || "Use code ARCHIVE20 at checkout for the next 4 hours. Tap to explore our vintage wash collection."}
                  </p>
                </div>

                {targetUrl && (
                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>ACTION: {targetUrl}</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </div>
                )}
              </div>
            </div>

            {/* In-App Bell Dropdown Preview */}
            <div className="bg-white border border-neutral-200 p-6 rounded-xs shadow-2xs space-y-3">
              <h3 className="text-xs font-black font-mono uppercase tracking-wider text-black flex items-center gap-2">
                <Globe className="w-4 h-4 text-black" />
                IN-APP NOTIFICATION CENTER PREVIEW
              </h3>
              <div className="bg-neutral-50 text-black p-3.5 rounded-xs border border-neutral-200">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-neutral-500 mb-1">
                  <span className="text-black font-bold">{type.toUpperCase()} ALERT</span>
                  <span>JUST NOW</span>
                </div>
                <div className="text-xs font-bold text-black font-mono">
                  {title || "⚡ FLASH DROP LIVE"}
                </div>
                <div className="text-[11px] text-neutral-600 mt-0.5">
                  {message || "Click to browse limited collection pieces."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white border border-neutral-200 p-6 rounded-xs shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h3 className="text-sm font-black font-mono uppercase tracking-wider text-black flex items-center gap-2">
              <Clock className="w-4 h-4 text-black" />
              BROADCAST HISTORY ({notifications.length})
            </h3>
            <button
              type="button"
              onClick={fetchNotifications}
              className="text-xs font-mono text-neutral-600 hover:text-black underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs font-mono text-neutral-400">
              LOADING BROADCAST HISTORY...
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-neutral-400">
              NO BROADCASTS SENT YET. CREATE YOUR FIRST CAMPAIGN ABOVE.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 text-[10px] uppercase">
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Title &amp; Message</th>
                    <th className="pb-3 pr-4">Target Link</th>
                    <th className="pb-3 pr-4">Audience</th>
                    <th className="pb-3 pr-4">Date Sent</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {notifications.map((n) => {
                    const id = n.id || n._id || "";
                    return (
                      <tr key={id} className="hover:bg-neutral-50/80 transition">
                        <td className="py-3 pr-4">
                          <span
                            className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-xs ${
                              n.type === "promo"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : n.type === "drop"
                                ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                                : n.type === "order"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-neutral-100 text-neutral-800 border border-neutral-200"
                            }`}
                          >
                            {n.type}
                          </span>
                        </td>
                        <td className="py-3 pr-4 max-w-xs">
                          <div className="font-bold text-black truncate">{n.title}</div>
                          <div className="text-[11px] text-neutral-500 line-clamp-1">{n.message}</div>
                        </td>
                        <td className="py-3 pr-4 text-neutral-700">
                          {n.targetUrl ? (
                            <span className="text-[11px] text-neutral-600 truncate max-w-[150px] inline-block">
                              {n.targetUrl}
                            </span>
                          ) : (
                            <span className="text-neutral-400">-</span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-neutral-600">
                          {n.targetUserEmail ? (
                            <span className="text-emerald-700 font-semibold">{n.targetUserEmail}</span>
                          ) : (
                            <span className="text-neutral-500">All Subscribers</span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-neutral-500">
                          {new Date(n.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 rounded-xs hover:bg-neutral-100 transition"
                            title="Delete broadcast"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
