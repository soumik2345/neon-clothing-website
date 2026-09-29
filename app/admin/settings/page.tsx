"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Save, Check } from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { SiteSettingsType } from "@/features/settings/types/settings.types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (json.success) setSettings(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Store Settings" />
        <div className="p-12 text-center text-xs text-neutral-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Store Configuration" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-2xs space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                General Store Identity
              </h2>
              <p className="text-xs text-neutral-500">
                Core branding and global currency parameters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Brand / Store Name
                </label>
                <input
                  type="text"
                  required
                  value={settings.storeName || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, storeName: e.target.value.toUpperCase() })
                  }
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  required
                  value={settings.currency || ""}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline || ""}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Free Shipping Minimum (₹)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={settings.freeShippingThreshold ?? 1499}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      freeShippingThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={settings.instagramHandle || ""}
                  onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings.supportEmail || ""}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Support Phone
                </label>
                <input
                  type="text"
                  value={settings.supportPhone || ""}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Store / Vault Address
                </label>
                <input
                  type="text"
                  value={settings.address || ""}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Cloudinary Integration Settings */}
          <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-2xs space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                Cloudinary Media Storage (Optional)
              </h2>
              <p className="text-xs text-neutral-500">
                Configure your Cloudinary credentials for cloud-hosted images, CDN optimization, and direct file uploads.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  Cloud Name
                </label>
                <input
                  type="text"
                  value={settings.cloudinaryCloudName || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, cloudinaryCloudName: e.target.value })
                  }
                  placeholder="e.g. your-cloud-name"
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  API Key
                </label>
                <input
                  type="text"
                  value={settings.cloudinaryApiKey || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, cloudinaryApiKey: e.target.value })
                  }
                  placeholder="e.g. 123456789012345"
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-700 mb-1">
                  API Secret
                </label>
                <input
                  type="password"
                  value={settings.cloudinaryApiSecret || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, cloudinaryApiSecret: e.target.value })
                  }
                  placeholder="••••••••••••••••"
                  className="w-full p-2.5 border border-neutral-300 rounded-xs outline-none focus:border-black font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            {savedSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <Check className="w-4 h-4" /> Settings updated successfully!
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition rounded-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
