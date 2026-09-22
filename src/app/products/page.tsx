import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import {
  MobileFilterButton,
  ProductFilters,
} from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";
import { SortDropdown } from "@/components/product/SortDropdown";
import { getProducts } from "@/lib/api/products";
import {
  getCategoryLabel,
  parseProductSearchParams,
} from "@/lib/utils/product-params";

export const metadata: Metadata = {
  title: "Shop Skincare & Beauty Products",
  description:
    "Browse Lumina Skin serums, moisturizers, cleansers, and daily SPF with filters for brand and category.",
  alternates: {
    canonical: "/products",
  },
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl text-foreground sm:text-4xl">Products</h1>
        <p className="mt-2 text-muted">
          Filter by category and brand, then sort by what matters for your routine.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <Suspense fallback={<FiltersSkeleton />}>
            <ProductFilters />
          </Suspense>
        </div>

        <div className="min-w-0 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Suspense fallback={null}>
              <MobileFilterButton />
            </Suspense>
            <Suspense fallback={<div className="h-10 w-48 animate-pulse rounded-md bg-border/70" />}>
              <SortDropdown
                value={parseProductSearchParams(params).sort}
              />
            </Suspense>
          </div>

          <Suspense fallback={<ProductGridSkeleton count={6} />}>
            <ProductsResults params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function ProductsResults({
  params,
}: {
  params: Record<string, string | string[] | undefined>;
}) {
  const filters = parseProductSearchParams(params);
  const result = await getProducts(filters);

  const activeFilters = [
    filters.query ? `“${filters.query}”` : null,
    filters.category ? getCategoryLabel(filters.category) : null,
    filters.brand ?? null,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted" aria-live="polite">
        {result.total} product{result.total === 1 ? "" : "s"}
        {activeFilters.length > 0 ? ` for ${activeFilters.join(" · ")}` : ""}
      </p>

      {result.items.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try changing your filters or search terms."
          action={
            <Link href="/products" className="btn btn-primary">
              Clear Filters
            </Link>
          }
        />
      ) : (
        <>
          <ProductGrid products={result.items} />
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            hrefForPage={(page) => buildProductsHref(params, page)}
          />
        </>
      )}
    </div>
  );
}

function buildProductsHref(
  params: Record<string, string | string[] | undefined>,
  page: number
): string {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (key === "page") return;
    if (typeof value === "string" && value) search.set(key, value);
    if (Array.isArray(value) && value[0]) search.set(key, value[0]);
  });

  search.set("page", String(page));
  return `/products?${search.toString()}`;
}

function FiltersSkeleton() {
  return (
    <div className="card-surface h-80 animate-pulse p-5" aria-hidden="true">
      <div className="mb-6 h-4 w-1/3 rounded bg-border/70" />
      <div className="space-y-3">
        <div className="h-3 w-2/3 rounded bg-border/70" />
        <div className="h-3 w-1/2 rounded bg-border/70" />
        <div className="h-3 w-3/5 rounded bg-border/70" />
      </div>
    </div>
  );
}
