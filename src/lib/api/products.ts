import { products } from "@/data/products";
import { ApiError } from "@/lib/api/errors";
import { getRecommendedProductsByConcern } from "@/lib/recommendations/product-recommendations";
import type {
  PaginatedProducts,
  Product,
  ProductFilters,
  ProductSort,
  SkinConcern,
} from "@/types/product";

const DEFAULT_PAGE_SIZE = 9;

function matchesQuery(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    product.name.toLowerCase().includes(q) ||
    product.brand.toLowerCase().includes(q) ||
    product.category.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q) ||
    product.concerns.some((concern) => concern.includes(q))
  );
}

function sortProducts(items: Product[], sort: ProductSort = "featured"): Product[] {
  const sorted = [...items];

  switch (sort) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.sort((a, b) => Number(b.isNewArrival) - Number(a.isNewArrival));
    case "featured":
    case "popular":
    default:
      return sorted.sort((a, b) => {
        if (a.isBestSeller !== b.isBestSeller) {
          return Number(b.isBestSeller) - Number(a.isBestSeller);
        }
        return b.reviewCount - a.reviewCount;
      });
  }
}

function applyFilters(filters: ProductFilters = {}): Product[] {
  let result = [...products];

  if (filters.query) {
    result = result.filter((product) => matchesQuery(product, filters.query!));
  }

  if (filters.category) {
    result = result.filter(
      (product) => product.category === filters.category?.toLowerCase()
    );
  }

  if (filters.brand) {
    result = result.filter(
      (product) => product.brand.toLowerCase() === filters.brand?.toLowerCase()
    );
  }

  if (typeof filters.minPrice === "number") {
    result = result.filter((product) => product.price >= filters.minPrice!);
  }

  if (typeof filters.maxPrice === "number") {
    result = result.filter((product) => product.price <= filters.maxPrice!);
  }

  if (typeof filters.minRating === "number") {
    result = result.filter((product) => product.rating >= filters.minRating!);
  }

  if (filters.concern) {
    result = result.filter((product) =>
      product.concerns.includes(filters.concern as SkinConcern)
    );
  }

  return sortProducts(result, filters.sort);
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedProducts> {
  // Simulate network latency for realistic loading states in later phases
  await delay(120);

  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE);
  const filtered = applyFilters(filters);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return { items, total, page, pageSize, totalPages };
}

export async function getProductBySlug(slug: string): Promise<Product> {
  await delay(80);

  const product = products.find((item) => item.slug === slug);
  if (!product) {
    throw new ApiError(404, `Product not found: ${slug}`, "PRODUCT_NOT_FOUND");
  }

  return product;
}

export async function searchProducts(
  query: string,
  filters: Omit<ProductFilters, "query"> = {}
): Promise<PaginatedProducts> {
  return getProducts({ ...filters, query });
}

export async function getProductsByCategory(
  category: string,
  filters: Omit<ProductFilters, "category"> = {}
): Promise<PaginatedProducts> {
  return getProducts({ ...filters, category });
}

export async function getProductsByConcern(
  concern: SkinConcern
): Promise<Product[]> {
  await delay(80);
  return getRecommendedProductsByConcern(products, concern, products.length);
}

export async function getRecommendedProducts(
  productId: string,
  limit = 4
): Promise<Product[]> {
  await delay(80);

  const current = products.find((item) => item.id === productId);
  if (!current) return [];

  return products
    .filter((product) => product.id !== productId)
    .map((product) => {
      const sharedConcerns = product.concerns.filter((concern) =>
        current.concerns.includes(concern)
      ).length;
      const sameCategory = product.category === current.category ? 1 : 0;
      const score = sharedConcerns * 3 + sameCategory * 2 + product.rating;

      return { product, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ product }) => product);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  await delay(80);
  return products
    .filter((product) => product.isBestSeller)
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  await delay(80);
  return products
    .filter((product) => product.isNewArrival)
    .slice(0, limit);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
