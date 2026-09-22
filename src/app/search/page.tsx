import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchTracker } from "@/components/analytics/SearchTracker";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { SearchBar } from "@/components/common/SearchBar";
import {
  MobileFilterButton,
  ProductFilters,
} from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";
import { SortDropdown } from "@/components/product/SortDropdown";
import { searchProducts } from "@/lib/api/products";
import { createSearchMetadata } from "@/lib/seo/metadata";
import {
  getCategoryLabel,
  parseProductSearchParams,
} from "@/lib/utils/product-params";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const SUGGESTIONS = ["Serum", "Moisturizer", "Sunscreen", "Cleanser"];

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const filters = parseProductSearchParams(params);
  return createSearchMetadata(filters.query?.trim());
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const filters = parseProductSearchParams(params);
  const query = filters.query?.trim() ?? "";

  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-8 max-w-2xl space-y-4">
        <h1 className="text-3xl text-foreground sm:text-4xl">Search</h1>
        <SearchBar
          id="search-page-input"
          initialQuery={query}
          placeholder="Search by product, brand, or concern..."
        />
      </header>

      {!query ? (
        <EmptyState
          title="Start searching"
          description="Try serum, moisturizer, sunscreen, or a brand name."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term.toLowerCase())}`}
                  className="btn btn-secondary"
                >
                  {term}
                </Link>
              ))}
            </div>
          }
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <Suspense fallback={null}>
              <ProductFilters basePath="/search" />
            </Suspense>
          </div>

          <div className="min-w-0 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Suspense fallback={null}>
                <MobileFilterButton basePath="/search" />
              </Suspense>
              <Suspense fallback={null}>
                <SortDropdown value={filters.sort} basePath="/search" />
              </Suspense>
            </div>

            <Suspense fallback={<ProductGridSkeleton count={6} />}>
              <SearchResults params={params} query={query} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}

async function SearchResults({
  params,
  query,
}: {
  params: Record<string, string | string[] | undefined>;
  query: string;
}) {
  const filters = parseProductSearchParams(params);
  const result = await searchProducts(query, {
    category: filters.category,
    brand: filters.brand,
    sort: filters.sort,
    page: filters.page,
    pageSize: filters.pageSize,
  });

  const activeFilters = [
    filters.category ? getCategoryLabel(filters.category) : null,
    filters.brand ?? null,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <SearchTracker query={query} resultCount={result.total} />

      {result.items.length === 0 ? (
        <EmptyState
          title={`No results for “${query}”`}
          description="Try searching for one of these popular categories."
          action={
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term.toLowerCase())}`}
                    className="btn btn-secondary"
                  >
                    {term}
                  </Link>
                ))}
              </div>
              <Link href="/products" className="btn btn-primary">
                Browse All Products
              </Link>
            </div>
          }
        />
      ) : (
        <>
          <div>
            <h2 className="text-xl text-foreground">
              Search results for “{query}”
            </h2>
            <p className="mt-1 text-sm text-muted" aria-live="polite">
              {result.total} product{result.total === 1 ? "" : "s"} found
              {activeFilters.length > 0
                ? ` · ${activeFilters.join(" · ")}`
                : ""}
            </p>
          </div>

          <ProductGrid products={result.items} />
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            hrefForPage={(page) => buildSearchHref(params, page)}
          />
        </>
      )}
    </div>
  );
}

function buildSearchHref(
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
  return `/search?${search.toString()}`;
}
