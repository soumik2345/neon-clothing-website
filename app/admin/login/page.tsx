"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (json.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(json.error || "Authentication failed. Invalid admin credentials.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <span className="text-3xl sm:text-4xl font-black tracking-widest text-white uppercase font-mono">
              NEON
            </span>
          </Link>
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
              ADMIN CONTROL PANEL
            </span>
          </div>
          <p className="text-xs text-neutral-500 pt-1">
            Restricted access. Authorized store administrators only.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#141414] border border-neutral-800 p-8 rounded-xs shadow-2xl space-y-6">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xs flex items-center gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#0c0c0c] border border-neutral-700 text-white placeholder-neutral-500 outline-none focus:border-white transition rounded-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#0c0c0c] border border-neutral-700 text-white placeholder-neutral-500 outline-none focus:border-white transition rounded-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-white transition uppercase font-medium"
          >
            ← Return to Neon Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
