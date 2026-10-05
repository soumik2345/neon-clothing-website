"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SiteSettingsType } from "../types/settings.types";
import { formatPrice as baseFormatPrice } from "@/lib/utils/utils";

interface SettingsContextType {
  settings: SiteSettingsType;
  currency: string;
  freeShippingThreshold: number;
  formatPrice: (amount: number, overrideCurrency?: string) => string;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettingsType = {
  identifier: "site_settings",
  storeName: "NEON",
  tagline: "Thrifted culture. Curated style. Pieces with a past, made for the present.",
  currency: "₹",
  freeShippingThreshold: 1499,
  supportEmail: "support@neonthrift.com",
  supportPhone: "+91 98765 43210",
  instagramHandle: "@neon.thrift",
  address: "Streetwear Vault, Fashion District",
  appDownload: {
    enabled: true,
    title: "DOWNLOAD OUR APP",
    subtitle: "Shop curated vintage streetwear on the go. Get instant drop alerts.",
    playStoreUrl: "",
    appStoreUrl: "",
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: SiteSettingsType;
}) {
  const [settings, setSettings] = useState<SiteSettingsType>(
    initialSettings || defaultSettings
  );

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (json.success && json.data) {
        setSettings(json.data);
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
  }, []);

  useEffect(() => {
    // If not provided from SSR, or whenever settings update event fires
    if (!initialSettings) {
      fetchSettings();
    }

    const handleUpdate = () => {
      fetchSettings();
    };

    window.addEventListener("neon-settings-updated", handleUpdate);
    return () => window.removeEventListener("neon-settings-updated", handleUpdate);
  }, [initialSettings, fetchSettings]);

  const currency = settings.currency || "₹";
  const freeShippingThreshold = settings.freeShippingThreshold ?? 1499;

  const formatPrice = useCallback(
    (amount: number, overrideCurrency?: string) => {
      const activeCurr = overrideCurrency || currency;
      return baseFormatPrice(amount, activeCurr);
    },
    [currency]
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        currency,
        freeShippingThreshold,
        formatPrice,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    return {
      settings: defaultSettings,
      currency: "₹",
      freeShippingThreshold: 1499,
      formatPrice: (amount: number, overrideCurrency?: string) =>
        baseFormatPrice(amount, overrideCurrency || "₹"),
      refreshSettings: async () => {},
    };
  }
  return ctx;
}
