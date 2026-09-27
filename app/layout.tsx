import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/features/cart/context/CartContext";
import { CartDrawer } from "@/features/cart/components/CartDrawer";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#fdfdfd] text-[#121212] font-sans antialiased selection:bg-black selection:text-white">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
