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
    <div className="min-h-screen bg-[#f8f9fa] text-black flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <span className="text-3xl sm:text-4xl font-black tracking-widest text-black uppercase font-mono">
              NEON
            </span>
          </Link>
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-4 h-4 text-black" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-700">
              ADMIN CONTROL PANEL
            </span>
          </div>
          <p className="text-xs text-neutral-500 pt-1">
            Restricted access. Authorized store administrators only.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-neutral-200 p-8 rounded-xs shadow-md space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xs flex items-center gap-2.5 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@neonthrift.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 text-black placeholder-neutral-400 outline-none focus:border-black transition rounded-none font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 text-black placeholder-neutral-400 outline-none focus:border-black transition rounded-none text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-black transition uppercase font-medium"
          >
            ← Return to Neon Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
