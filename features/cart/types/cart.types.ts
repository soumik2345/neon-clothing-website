export interface CartItemType {
  productId: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size: string;
  image: string;
  category: string;
}

export interface CartContextType {
  cart: CartItemType[];
  addToCart: (item: Omit<CartItemType, "quantity">, qty?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}
