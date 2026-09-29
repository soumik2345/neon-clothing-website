import { Platform } from "react-native";
import {
  ProductType,
  CategoryType,
  BannersDataType,
  SiteSettingsType,
  OrderType,
  CreateOrderPayload,
} from "../types";

// Determine primary and fallback API base URLs based on platform
const DEFAULT_LOCAL_IP = "192.168.0.174";

const PRIMARY_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === "web"
    ? "http://localhost:3000/api"
    : `http://${DEFAULT_LOCAL_IP}:3000/api`);

const FALLBACK_URLS =
  Platform.OS === "web"
    ? ["http://127.0.0.1:3000/api"]
    : Platform.OS === "android"
    ? ["http://10.0.2.2:3000/api", "http://localhost:3000/api"]
    : ["http://localhost:3000/api", "http://127.0.0.1:3000/api"];

let activeBaseUrl = PRIMARY_URL;

export function getActiveApiUrl(): string {
  return activeBaseUrl;
}

export function setActiveApiUrl(newUrl: string) {
  let cleaned = newUrl.trim();
  if (!cleaned.endsWith("/api")) {
    cleaned = cleaned.replace(/\/+$/, "") + "/api";
  }
  activeBaseUrl = cleaned;
}

async function requestWithFailover<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const urlsToTry = [
    activeBaseUrl,
    ...FALLBACK_URLS.filter((u) => u !== activeBaseUrl),
  ];

  let lastError: unknown = null;

  for (const baseUrl of urlsToTry) {
    try {
      const fullUrl = `${baseUrl}${cleanEndpoint}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(fullUrl, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(options?.headers || {}),
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}`
        );
      }

      const json = await response.json();
      if (!json.success && json.error) {
        throw new Error(
          typeof json.error === "string"
            ? json.error
            : JSON.stringify(json.error)
        );
      }

      // If successful, remember this working baseUrl
      activeBaseUrl = baseUrl;
      return json.data as T;
    } catch (err: unknown) {
      lastError = err;
      // Continue to next URL candidate
    }
  }

  throw lastError || new Error("Failed to connect to backend server");
}

export const api = {
  // PRODUCTS
  async getProducts(params?: {
    category?: string;
    search?: string;
    isTrending?: boolean;
    isFeatured?: boolean;
    sort?: "price-asc" | "price-desc" | "newest" | "popular";
    limit?: number;
    ids?: string[];
  }): Promise<ProductType[]> {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== "all") {
      searchParams.set("category", params.category);
    }
    if (params?.search) {
      searchParams.set("search", params.search);
    }
    if (params?.isTrending !== undefined) {
      searchParams.set("isTrending", String(params.isTrending));
    }
    if (params?.isFeatured !== undefined) {
      searchParams.set("isFeatured", String(params.isFeatured));
    }
    if (params?.sort) {
      searchParams.set("sort", params.sort);
    }
    if (params?.limit) {
      searchParams.set("limit", String(params.limit));
    }
    if (params?.ids && params.ids.length > 0) {
      searchParams.set("ids", params.ids.join(","));
    }

    const queryStr = searchParams.toString();
    const endpoint = `/products${queryStr ? `?${queryStr}` : ""}`;
    return requestWithFailover<ProductType[]>(endpoint);
  },

  async getProductByIdOrSlug(idOrSlug: string): Promise<ProductType> {
    return requestWithFailover<ProductType>(`/products/${encodeURIComponent(idOrSlug)}`);
  },

  // CATEGORIES
  async getCategories(): Promise<CategoryType[]> {
    return requestWithFailover<CategoryType[]>("/categories");
  },

  // BANNERS & HOME SECTIONS
  async getBanners(): Promise<BannersDataType> {
    return requestWithFailover<BannersDataType>("/banners");
  },

  // SITE SETTINGS (Currency, Free shipping threshold, Store info)
  async getSettings(): Promise<SiteSettingsType> {
    return requestWithFailover<SiteSettingsType>("/settings");
  },

  // ORDERS
  async createOrder(payload: CreateOrderPayload): Promise<OrderType> {
    return requestWithFailover<OrderType>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getOrderById(idOrOrderNumber: string): Promise<OrderType> {
    return requestWithFailover<OrderType>(
      `/orders/${encodeURIComponent(idOrOrderNumber.trim())}`
    );
  },

  async getOrders(email?: string): Promise<OrderType[]> {
    const endpoint = email
      ? `/orders?email=${encodeURIComponent(email.trim())}`
      : "/orders";
    return requestWithFailover<OrderType[]>(endpoint);
  },
};
