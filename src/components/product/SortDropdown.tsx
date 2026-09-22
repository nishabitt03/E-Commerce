"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ProductSort } from "@/types/product";

const SORT_OPTIONS: Array<{ value: ProductSort; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "popular", label: "Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
];

interface SortDropdownProps {
  value?: ProductSort;
  basePath?: string;
}

export function SortDropdown({
  value = "featured",
  basePath = "/products",
}: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(nextSort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", nextSort);
    params.set("page", "1");
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span className="whitespace-nowrap font-medium text-foreground">Sort by</span>
      <select
        className="input min-h-10 w-full max-w-56 py-2"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
