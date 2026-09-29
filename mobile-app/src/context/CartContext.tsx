import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItemType, OrderType, OrderCustomerType } from "../types";
import { useSettings } from "./SettingsContext";
import { api } from "../services/api";

interface CartContextType {
  cart: CartItemType[];
  addToCart: (item: CartItemType) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  total: number;
  orders: OrderType[];
  isPlacingOrder: boolean;
  placeOrder: (
    customer: OrderCustomerType,
    paymentMethod: "cod" | "card"
  ) => Promise<OrderType>;
  fetchUserOrders: (email?: string) => Promise<OrderType[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { freeShippingThreshold } = useSettings();
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Load latest orders from database on startup
  useEffect(() => {
    (async () => {
      try {
        const dbOrders = await api.getOrders();
        if (Array.isArray(dbOrders) && dbOrders.length > 0) {
          setOrders(dbOrders);
        }
      } catch (err) {
        // Silent catch for initial load if offline or backend unavailable
        console.warn("Could not prefetch orders from database:", err);
      }
    })();
  }, []);

  const addToCart = (item: CartItemType) => {
    setCart((prev) => {
      const index = prev.findIndex(
        (i) => i.productId === item.productId && i.size === item.size
      );
      if (index > -1) {
        const updated = [...prev];
        updated[index].quantity += item.quantity || 1;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  };

  const updateQuantity = (
    productId: string,
    size: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setCouponCode("");
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee =
    subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const applyCoupon = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === "NEON10") {
      setCouponCode("NEON10");
      setDiscount(Math.round(subtotal * 0.1));
      return true;
    }
    return false;
  };

  const placeOrder = async (
    customer: OrderCustomerType,
    paymentMethod: "cod" | "card"
  ): Promise<OrderType> => {
    try {
      setIsPlacingOrder(true);

      // Create payload to send to real database endpoint POST /api/orders
      const payload = {
        customer,
        items: cart.map((c) => ({
          productId: c.productId,
          title: c.title,
          price: c.price,
          quantity: c.quantity,
          size: c.size,
          image: c.image,
        })),
        paymentMethod,
      };

      const serverOrder = await api.createOrder(payload);

      // Format created order to match OrderType
      const fullOrder: OrderType = {
        _id: serverOrder._id || serverOrder.id || `ord-${Date.now()}`,
        id: serverOrder._id || serverOrder.id,
        orderNumber: serverOrder.orderNumber || `NEON-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: serverOrder.createdAt || new Date().toISOString(),
        customer: serverOrder.customer || customer,
        items: [...cart],
        subtotal: serverOrder.subtotal || subtotal,
        shippingFee: serverOrder.shippingFee !== undefined ? serverOrder.shippingFee : shippingFee,
        discount,
        total: serverOrder.total || total,
        status: serverOrder.status || "pending",
        paymentMethod,
        paymentStatus: serverOrder.paymentStatus || (paymentMethod === "card" ? "paid" : "pending"),
      };

      setOrders((prev) => [fullOrder, ...prev]);
      clearCart();
      return fullOrder;
    } catch (error) {
      console.error("Order creation failed on API:", error);
      throw error;
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const fetchUserOrders = async (email?: string): Promise<OrderType[]> => {
    try {
      const fetched = await api.getOrders(email);
      if (Array.isArray(fetched)) {
        setOrders(fetched);
        return fetched;
      }
      return orders;
    } catch (err) {
      console.warn("Failed to fetch user orders:", err);
      return orders;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        discount,
        couponCode,
        applyCoupon,
        total,
        orders,
        isPlacingOrder,
        placeOrder,
        fetchUserOrders,
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
