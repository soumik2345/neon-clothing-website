"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Check, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderId: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", orderId: "", message: "" });
      } else {
        setError(json.error || "Failed to submit form. Please try again.");
      }
    } catch (err) {
      console.error("Contact submit error:", err);
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black font-mono">
            CONTACT NEON
          </h1>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Have a question about a drop, sizing, or your order? Send us a message or reach our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Info */}
          <div className="space-y-6 text-xs text-neutral-600">
            <div className="p-6 bg-white border border-neutral-200 space-y-4 rounded-xs shadow-2xs">
              <h2 className="text-sm font-bold uppercase text-black font-mono">Customer Support</h2>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-black shrink-0" />
                <span>support@neonthrift.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-black shrink-0" />
                <span>+91 98765 43210 (10 AM - 7 PM IST)</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-black shrink-0" />
                <span>NEON Streetwear Vault, Fashion District, Mumbai, India</span>
              </div>
            </div>

            <div className="p-6 bg-neutral-900 text-white space-y-2 rounded-xs shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider">Thrift Drop Inquiries</h3>
              <p className="text-neutral-400 text-xs">
                Want to sell vintage pieces or collaborate with NEON? Email us directly with photos at{" "}
                <span className="text-white underline">drops@neonthrift.com</span>.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-2xs">
            {submitted ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold uppercase text-black font-mono">Message Sent!</h3>
                <p className="text-xs text-neutral-500">
                  Thanks for reaching out. Your inquiry has been forwarded to our team and logged in our admin support desk.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 border border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 rounded-xs transition"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black transition"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black transition"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1">
                    Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NEON-1082"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black uppercase font-mono transition"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-neutral-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your inquiry or question here..."
                    className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition rounded-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
