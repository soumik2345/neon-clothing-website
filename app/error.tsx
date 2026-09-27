"use client";

import React, { useEffect } from "react";
import Link from "next/link";

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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
        ERROR
      </span>
      <h1 className="text-2xl font-black uppercase text-black font-mono">
        Something went wrong
      </h1>
      <p className="text-xs text-neutral-500 max-w-md">
        An unexpected error occurred while loading this page. Please try again or return to home.
      </p>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 border border-neutral-300 text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
