import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SiteSettingsType } from "../types";
import { api } from "../services/api";

interface SettingsContextType {
  settings: SiteSettingsType;
  currency: string;
  freeShippingThreshold: number;
  isLoading: boolean;
  formatPrice: (amount: number, overrideCurrency?: string) => string;
  updateCurrency: (newCurrency: string) => void;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettingsType = {
  storeName: "NEON",
  tagline: "Thrifted culture. Curated style. Pieces with a past, made for the present.",
  currency: "Tk",
  freeShippingThreshold: 1499,
  supportEmail: "support@neonthrift.com",
  supportPhone: "+91 98765 43210",
  instagramHandle: "@neon.thrift",
  address: "Fashion District, Streetwear Vault",
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettingsType>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getSettings();
      if (data && data.storeName) {
        setSettings(data);
      }
    } catch (error) {
      console.warn("Could not fetch settings from API, using default store configuration:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const currency = settings.currency || "Tk";
  const freeShippingThreshold = settings.freeShippingThreshold || 1499;

  const formatPrice = (amount: number, overrideCurrency?: string) => {
    const sym = (overrideCurrency || currency || "Tk").trim();
    const isText = /^[a-zA-Z.]+$/.test(sym);
    return `${sym}${isText ? " " : ""}${(amount || 0).toLocaleString("en-IN")}`;
  };

  const updateCurrency = (newCurrency: string) => {
    setSettings((prev) => ({ ...prev, currency: newCurrency }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        currency,
        freeShippingThreshold,
        isLoading,
        formatPrice,
        updateCurrency,
        refreshSettings: loadSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
