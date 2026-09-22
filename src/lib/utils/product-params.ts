import type { ProductFilters, ProductSort } from "@/types/product";

const SORT_VALUES: ProductSort[] = [
  "featured",
  "popular",
  "price-low",
  "price-high",
  "rating",
  "newest",
];

export function parseProductSearchParams(
  params: Record<string, string | string[] | undefined>
): ProductFilters {
  const get = (key: string): string | undefined => {
    const value = params[key];
    if (Array.isArray(value)) return value[0];
    return value || undefined;
  };

  const sortParam = get("sort");
  const sort = SORT_VALUES.includes(sortParam as ProductSort)
    ? (sortParam as ProductSort)
    : "featured";

  return {
    query: get("q"),
    category: get("category"),
    brand: get("brand"),
    sort,
    page: Number(get("page") ?? 1) || 1,
    pageSize: Number(get("pageSize") ?? 9) || 9,
    minPrice: parseOptionalNumber(get("minPrice")),
    maxPrice: parseOptionalNumber(get("maxPrice")),
    minRating: parseOptionalNumber(get("minRating")),
  };
}

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export const CATEGORY_LABELS: Record<string, string> = {
  serum: "Serums",
  moisturizer: "Moisturizers",
  sunscreen: "Sun Care",
  cleanser: "Cleansers",
  toner: "Toners",
  treatment: "Treatments",
  balm: "Balms",
  "eye-care": "Eye Care",
  mask: "Masks",
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}
