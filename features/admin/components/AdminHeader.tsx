"use client";

import React, { useState, useEffect } from "react";
import { Menu, RefreshCw, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  title: string;
  onOpenMobileSidebar?: () => void;
}

export function AdminHeader({ title, onOpenMobileSidebar }: AdminHeaderProps) {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<string>("Checking...");

  useEffect(() => {
    fetch("/api/db-status")
      .then((res) => res.json())
      .then((data) => setDbStatus(data.connected ? "MongoDB Connected" : "Local Storage Mode"))
      .catch(() => setDbStatus("Local Storage Mode"));
  }, []);

  const handleSeedDatabase = async () => {
    if (!confirm("This will reset/populate the database with the exact Mockup dataset. Continue?")) {
      return;
    }

    setIsSeeding(true);
    setSeedMessage(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setSeedMessage("Mockup data seeded!");
        setTimeout(() => {
          setSeedMessage(null);
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      alert("Seeding failed");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <header className="h-16 md:h-20 bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-neutral-600 hover:text-black"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg md:text-xl font-black uppercase tracking-tight text-black font-mono">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* DB Status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-[11px] font-medium text-neutral-700 rounded-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{dbStatus}</span>
        </div>

        {/* 1-Click Seed Button */}
        <button
          onClick={handleSeedDatabase}
          disabled={isSeeding}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition disabled:opacity-50 rounded-xs"
          title="Reset & Seed with exact mockup products, categories & banners"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? "animate-spin" : ""}`} />
          <span>{isSeeding ? "Seeding..." : "Seed Mockup Data"}</span>
        </button>

        {seedMessage && (
          <span className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <CheckCircle className="w-3.5 h-3.5" />
            {seedMessage}
          </span>
        )}

        {/* Visit store shortcut */}
        <Link
          href="/"
          target="_blank"
          className="p-2 text-neutral-500 hover:text-black transition"
          title="Open Live Store in New Tab"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
