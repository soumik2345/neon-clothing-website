export interface ProductType {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  condition: string;
  fabricSilhouette?: string;
  careGuide?: string;
  images: string[];
  sizes?: string[];
  size?: string[];
  stock?: number;
  inStock?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  createdAt?: string;
}

export interface CategoryType {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  itemCount?: number;
  order?: number;
  showOnHome?: boolean;
}

export interface CartItemType {
  productId: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  size: string;
  quantity: number;
  image: string;
  category: string;
}

export interface OrderCustomerType {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface OrderType {
  _id: string;
  id?: string;
  orderNumber: string;
  createdAt: string;
  customer: OrderCustomerType;
  items: CartItemType[];
  subtotal: number;
  shippingFee: number;
  discount?: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "cod" | "card";
  paymentStatus: "pending" | "paid" | "failed";
}

export interface SiteSettingsType {
  _id?: string;
  storeName: string;
  tagline: string;
  currency: string;
  freeShippingThreshold: number;
  supportEmail: string;
  supportPhone: string;
  instagramHandle: string;
  address: string;
}

export interface BannerSlideType {
  tag?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  image: string;
  bgType?: string;
  bgColor?: string;
  textColor?: string;
}

export interface ValuePropType {
  title: string;
  subtitle: string;
  icon?: string;
}

export interface PromoCardType {
  tag?: string;
  title: string;
  ctaText?: string;
  ctaLink?: string;
  image: string;
}

export interface BannersDataType {
  _id?: string;
  announcementText?: string;
  hero?: BannerSlideType;
  heroSlides?: BannerSlideType[];
  valueProps?: ValuePropType[];
  promoCards?: PromoCardType[];
  featuredCategorySections?: Array<{
    id: string;
    enabled: boolean;
    categorySlug: string;
    title: string;
    limit?: number;
  }>;
}

export interface CreateOrderPayload {
  customer: OrderCustomerType;
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
  }>;
  paymentMethod: "cod" | "card";
}
