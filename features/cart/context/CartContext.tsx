"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItemType, CartContextType } from "../types/cart.types";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("neon_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out legacy demo items if any
        const cleaned = Array.isArray(parsed)
          ? parsed.filter(
              (item: CartItemType) =>
                item.productId !== "prod_1" && item.productId !== "prod_2"
            )
          : [];
        setCart(cleaned);
      } else {
        setCart([]);
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
      setCart([]);
    } finally {
      setIsLoaded(true);
    }

    // Cross-tab synchronization
    const handleStorageChange = (e: any) => {
      if (e?.key === "neon_cart" && e?.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setCart(updated);
          }
        } catch {}
      } else if (e?.key === "neon_cart" && !e?.newValue) {
        setCart([]);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("neon_cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = (item: Omit<CartItemType, "quantity">, qty: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && i.size === item.size
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += qty;
        return next;
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.productId === productId && i.size === size ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("neon_cart");
    } catch (e) {
      console.error("Failed to remove cart from localStorage", e);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
