"use client";

import React, { useState, useEffect } from "react";
import { Bell, X, Check, Sparkles } from "lucide-react";

export function NotificationPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");

  useEffect(() => {
    // Only run on client browser
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    // If already granted or denied, don't show prompt
    if (Notification.permission === "granted" || Notification.permission === "denied") {
      return;
    }

    // Check if dismissed recently (e.g. within 3 days)
    const dismissedUntil = localStorage.getItem("neon_notif_dismissed_until");
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
      return;
    }

    // Delay showing slightly so it doesn't jarringly block the initial page paint
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Suppress prompt for 3 days
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "neon_notif_dismissed_until",
        String(Date.now() + 3 * 24 * 60 * 60 * 1000)
      );
    }
  };

  const handleRequestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    setStatus("requesting");
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setStatus("granted");

        // Send subscription endpoint to backend
        try {
          await fetch("/api/notifications/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              endpoint: `web-client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              platform: "web",
            }),
          });
        } catch {
          // Non-blocking
        }

        // Show welcome notification
        try {
          new Notification("⚡ NEON DROP ALERTS ACTIVATED", {
            body: "You're all set! You will now receive instant alerts on secret drops and order status updates.",
            icon: "/favicon.ico",
          });
        } catch {
          // ignore
        }

        // Trigger global event so Header or other components know
        window.dispatchEvent(new Event("neon-notifications-enabled"));

        setTimeout(() => {
          setIsVisible(false);
        }, 1800);
      } else {
        setStatus("denied");
        handleDismiss();
      }
    } catch (err) {
      console.error("Failed to request notification permission:", err);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Notification Permission"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#0c0c0c] text-white border border-neutral-700 shadow-2xl p-4 sm:p-5 rounded-xs animate-in slide-in-from-bottom duration-300 font-sans"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-xs shrink-0 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
          </div>
          <div>
            <h3 className="text-xs font-black font-mono uppercase tracking-wider text-white">
              DROP ALERTS &amp; UPDATES
            </h3>
            <span className="text-[10px] font-mono text-neutral-400">
              OFFICIAL ARCHIVE ALERTS
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="text-neutral-500 hover:text-neutral-300 p-1 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-neutral-300 mt-3 leading-relaxed">
        Enable push notifications to receive instant alerts when your orders are shipped or delivered, plus secret streetwear drops &amp; flash sales.
      </p>

      <div className="mt-4 flex items-center gap-2">
        {status === "granted" ? (
          <div className="w-full py-2 bg-emerald-600 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" />
            ALERTS ACTIVATED
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleRequestPermission}
              disabled={status === "requesting"}
              className="flex-1 bg-white hover:bg-neutral-200 text-black py-2.5 px-3 text-xs font-mono font-bold uppercase tracking-wider transition rounded-xs text-center flex items-center justify-center gap-1.5"
            >
              {status === "requesting" ? (
                "REQUESTING..."
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  ALLOW ALERTS
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="py-2.5 px-3 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider transition"
            >
              LATER
            </button>
          </>
        )}
      </div>
    </div>
  );
}
