export type SkinConcern =
  | "acne"
  | "dryness"
  | "pigmentation"
  | "sun-protection"
  | "sensitive-skin"
  | "dullness";

export interface ProductVariant {
  id: string;
  label: string;
  sku: string;
  price: number;
  stock: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  howToUse: string[];
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  images: string[];
  variants: ProductVariant[];
  stock: number;
  concerns: SkinConcern[];
  isBestSeller: boolean;
  isNewArrival: boolean;
  reviews: Review[];
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  concern?: SkinConcern;
  query?: string;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

export type ProductSort =
  | "featured"
  | "popular"
  | "price-low"
  | "price-high"
  | "rating"
  | "newest";

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
