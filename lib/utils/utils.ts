import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "₹"): string {
  const sym = (currency || "₹").trim();
  const isTextCurrency = /^[a-zA-Z.]+$/.test(sym);
  return `${sym}${isTextCurrency ? " " : ""}${(price || 0).toLocaleString("en-IN")}`;
}
