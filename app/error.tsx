"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Database, AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error boundary caught:", error);
  }, [error]);

  const isDatabaseError =
    error.message?.toLowerCase().includes("mongo") ||
    error.message?.toLowerCase().includes("database") ||
    error.message?.toLowerCase().includes("connect");

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-full text-red-400">
        {isDatabaseError ? (
          <Database className="w-10 h-10 animate-pulse" />
        ) : (
          <AlertTriangle className="w-10 h-10 text-amber-400" />
        )}
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
          {isDatabaseError ? "MONGODB CONNECTION ERROR" : "APPLICATION ERROR"}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-mono tracking-tight">
          {isDatabaseError ? "Database Offline or Blocked" : "Something went wrong"}
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed">
          {isDatabaseError
            ? "Could not connect to MongoDB. Please ensure your MongoDB Atlas IP address is whitelisted in Network Access, or your MongoDB connection string in .env.local is valid."
            : error.message || "An unexpected error occurred while loading this page."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 pt-2 justify-center">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-neutral-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-900 transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
