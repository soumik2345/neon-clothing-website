import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/features/settings/context/SettingsContext";
import { CartProvider } from "@/features/cart/context/CartContext";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { BottomNav } from "@/components/layout/BottomNav";
import { getSettings } from "@/features/settings/services/settings.service";

export const metadata: Metadata = {
  title: "NEON | Thrifted & Curated Streetwear",
  description: "Thrifted culture. Curated style. Pieces with a past, made for the present.",
  keywords: ["streetwear", "thrift store", "curated fashion", "hoodies", "vintage tees", "cargo pants"],
  openGraph: {
    title: "NEON | Thrifted & Curated Streetwear",
    description: "Thrifted culture. Curated style. Pieces with a past, made for the present.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = undefined;
  try {
    settings = await getSettings();
  } catch (e) {
    console.error("Failed to load initial settings in RootLayout:", e);
  }

  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased scroll-smooth">
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#fdfdfd] text-[#121212] font-sans antialiased selection:bg-black selection:text-white pb-14 md:pb-0">
        <SettingsProvider initialSettings={settings}>
          <CartProvider>
            {children}
            <CartDrawer />
            <BottomNav />
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
