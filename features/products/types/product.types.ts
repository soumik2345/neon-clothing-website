export interface ProductType {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  condition: string;
  images: string[];
  sizes: string[];
  stock: number;
  isTrending: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ProductFilterParams {
  ids?: string[];
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isTrending?: boolean;
  isFeatured?: boolean;
  sort?: "price-asc" | "price-desc" | "newest" | "popular";
  page?: number;
  limit?: number;
}
