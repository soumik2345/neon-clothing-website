"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Check, ExternalLink, Sparkles, Package, Flame, Tag, Radio } from "lucide-react";
import { NotificationItem } from "@/features/notifications/types/notification.types";

interface NotificationBellDropdownProps {
  currentUserEmail?: string;
}

export function NotificationBellDropdown({
  currentUserEmail,
}: NotificationBellDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastKnownIdRef = useRef<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const storedEmail = typeof window !== "undefined" ? localStorage.getItem("neon_customer_email") : null;
      const targetEmail = currentUserEmail || storedEmail || undefined;
      const emailParam = targetEmail ? `?email=${encodeURIComponent(targetEmail)}` : "";
      const res = await fetch(`/api/notifications${emailParam}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const list: NotificationItem[] = data.data;

        // If new notifications arrived while user is browsing and permission is granted, trigger browser notification
        if (
          lastKnownIdRef.current &&
          list.length > 0 &&
          (list[0].id || list[0]._id) !== lastKnownIdRef.current
        ) {
          const newest = list[0];
          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            try {
              new Notification(newest.title, {
                body: newest.message,
                icon: "/favicon.ico",
              });
            } catch {
              // ignore
            }
          }
        }

        if (list.length > 0) {
          lastKnownIdRef.current = list[0].id || list[0]._id || null;
        }

        // Apply local read status from localStorage as fallback
        const readIds = JSON.parse(localStorage.getItem("neon_read_notifications") || "[]");
        const mapped = list.map((n) => {
          const id = n.id || n._id || "";
          return {
            ...n,
            isRead: n.isRead || readIds.includes(id),
          };
        });

        setNotifications(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [currentUserEmail]);

  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds for live drop & order updates
    const interval = setInterval(fetchNotifications, 30000);

    const handleNotifEnabled = () => {
      fetchNotifications();
    };

    window.addEventListener("neon-notifications-enabled", handleNotifEnabled);

    return () => {
      clearInterval(interval);
      window.removeEventListener("neon-notifications-enabled", handleNotifEnabled);
    };
  }, [fetchNotifications]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    const allIds = notifications.map((n) => n.id || n._id || "");
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);

    if (typeof window !== "undefined") {
      localStorage.setItem("neon_read_notifications", JSON.stringify(allIds));
    }

    // Call API for each
    for (const notif of notifications) {
      const id = notif.id || notif._id;
      if (id) {
        fetch(`/api/notifications/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: currentUserEmail }),
        }).catch(() => {});
      }
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    const id = notif.id || notif._id || "";
    // Mark as read locally
    setNotifications((prev) =>
      prev.map((n) => ((n.id || n._id) === id ? { ...n, isRead: true } : n))
    );

    if (typeof window !== "undefined") {
      const readIds = JSON.parse(localStorage.getItem("neon_read_notifications") || "[]");
      if (!readIds.includes(id)) {
        readIds.push(id);
        localStorage.setItem("neon_read_notifications", JSON.stringify(readIds));
      }
    }

    if (id) {
      fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: currentUserEmail }),
      }).catch(() => {});
    }

    setIsOpen(false);

    if (notif.targetUrl) {
      router.push(notif.targetUrl);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
      if (diff < 60) return "Just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    } catch {
      return "Recent";
    }
  };

  const renderTypeIcon = (type: string) => {
    switch (type) {
      case "drop":
        return <Flame className="w-3.5 h-3.5 text-cyan-500" />;
      case "order":
        return <Package className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-neutral-800 hover:text-black transition-colors relative"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5 stroke-[1.75]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-black text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-50">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 shadow-2xl py-0 z-50 rounded-xs overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-[#0c0c0c] text-white flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase tracking-wider">
                NOTIFICATIONS
              </span>
              {unreadCount > 0 && (
                <span className="bg-amber-400 text-black text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs">
                  {unreadCount} NEW
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[10px] font-mono text-neutral-400 hover:text-white transition flex items-center gap-1 uppercase"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-neutral-100">
            {notifications.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <Bell className="w-6 h-6 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs font-mono font-bold uppercase text-neutral-600">
                  NO NOTIFICATIONS YET
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  You will receive alerts here for drops and order shipping updates.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const id = notif.id || notif._id || "";
                return (
                  <div
                    key={id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 hover:bg-neutral-50 cursor-pointer transition flex items-start gap-3 text-left ${
                      !notif.isRead ? "bg-amber-50/40" : ""
                    }`}
                  >
                    <div className="p-1.5 bg-neutral-100 rounded-xs shrink-0 mt-0.5">
                      {renderTypeIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                          {notif.type}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-400">
                          {formatTimeAgo(notif.createdAt)}
                        </span>
                      </div>

                      <h4
                        className={`text-xs mt-0.5 line-clamp-1 ${
                          !notif.isRead
                            ? "font-black text-black font-mono"
                            : "font-semibold text-neutral-800"
                        }`}
                      >
                        {notif.title}
                      </h4>

                      <p className="text-[11px] text-neutral-600 mt-1 line-clamp-2 leading-tight">
                        {notif.message}
                      </p>

                      {notif.targetUrl && (
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-mono font-bold text-neutral-900 uppercase">
                          <span>View Details</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    {!notif.isRead && (
                      <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-500">
            <span>NEON ARCHIVE ALERTS</span>
            <Link
              href="/shop"
              onClick={() => setIsOpen(false)}
              className="font-bold text-black hover:underline uppercase"
            >
              Shop All Drops &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
