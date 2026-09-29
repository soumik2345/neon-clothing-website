"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Eye, EyeOff, ArrowRight, UserPlus, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country.trim() || "India",
        },
      };

      const res = await fetch("/api/auth/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create account");
      }

      // Notify other components (Header) about auth state change
      window.dispatchEvent(new Event("neon-auth-change"));

      router.push("/profile");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-xl bg-white border border-neutral-200 p-8 sm:p-12 shadow-xs">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-1">
              EXCLUSIVE MEMBERSHIP
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-black uppercase">
              CREATE ACCOUNT
            </h1>
            <p className="text-xs text-neutral-500 mt-2">
              Join the NEON club for exclusive drops, order tracking, and faster checkout.
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-[#fcfcfc] border border-neutral-300 focus:border-black focus:ring-0 px-3.5 py-2.5 text-xs text-black placeholder:text-neutral-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full bg-[#fcfcfc] border border-neutral-300 focus:border-black focus:ring-0 px-3.5 py-2.5 text-xs text-black placeholder:text-neutral-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-[#fcfcfc] border border-neutral-300 focus:border-black focus:ring-0 px-3.5 py-2.5 text-xs text-black placeholder:text-neutral-400 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full bg-[#fcfcfc] border border-neutral-300 focus:border-black focus:ring-0 px-3.5 py-2.5 text-xs text-black placeholder:text-neutral-400 transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="w-full bg-[#fcfcfc] border border-neutral-300 focus:border-black focus:ring-0 px-3.5 py-2.5 text-xs text-black placeholder:text-neutral-400 transition"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100">
              <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block mb-3">
                DEFAULT SHIPPING ADDRESS (OPTIONAL)
              </span>

              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Street Address, Apt / Suite"
                    className="w-full bg-[#fcfcfc] border border-neutral-300 focus:border-black focus:ring-0 px-3.5 py-2.5 text-xs text-black placeholder:text-neutral-400 transition"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full bg-[#fcfcfc] border border-neutral-300 focus:border-black focus:ring-0 px-3.5 py-2.5 text-xs text-black placeholder:text-neutral-400 transition"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full bg-[#fcfcfc] border border-neutral-300 focus:border-black focus:ring-0 px-3.5 py-2.5 text-xs text-black placeholder:text-neutral-400 transition"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="PIN / Zip"
                      className="w-full bg-[#fcfcfc] border border-neutral-300 focus:border-black focus:ring-0 px-3.5 py-2.5 text-xs text-black placeholder:text-neutral-400 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-neutral-800 disabled:opacity-50 py-3 text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>REGISTER ACCOUNT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-black underline underline-offset-4 hover:text-neutral-700"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
