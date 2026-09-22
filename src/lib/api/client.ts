import type { PaginatedProducts, Product, ProductFilters } from "@/types/product";
import { getApiUrl } from "@/lib/constants";
import { ApiError } from "@/lib/api/errors";

/**
 * Browser-side REST client used by TanStack Query in later phases.
 * Server Components should prefer lib/api/products.ts directly.
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${getApiUrl()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(0, "Network request failed", "NETWORK_ERROR");
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
      code?: string;
    } | null;

    throw new ApiError(
      response.status,
      payload?.error ?? "Request failed",
      payload?.code ?? "HTTP_ERROR"
    );
  }

  return response.json() as Promise<T>;
}

function toQueryString(filters: ProductFilters = {}): string {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.category) params.set("category", filters.category);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.concern) params.set("concern", filters.concern);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (typeof filters.minPrice === "number") {
    params.set("minPrice", String(filters.minPrice));
  }
  if (typeof filters.maxPrice === "number") {
    params.set("maxPrice", String(filters.maxPrice));
  }
  if (typeof filters.minRating === "number") {
    params.set("minRating", String(filters.minRating));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function fetchProducts(
  filters: ProductFilters = {}
): Promise<PaginatedProducts> {
  return apiFetch<PaginatedProducts>(`/products${toQueryString(filters)}`);
}

export function fetchProductBySlug(slug: string): Promise<Product> {
  return apiFetch<Product>(`/products/${slug}`);
}

export function fetchSearchResults(
  query: string,
  filters: Omit<ProductFilters, "query"> = {}
): Promise<PaginatedProducts> {
  return apiFetch<PaginatedProducts>(
    `/search${toQueryString({ ...filters, query })}`
  );
}
