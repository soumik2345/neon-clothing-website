import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 space-y-4">
      <div className="w-10 h-10 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
        LOADING NEON...
      </span>
    </div>
  );
}
