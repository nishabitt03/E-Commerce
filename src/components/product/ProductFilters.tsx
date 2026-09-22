"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { brands, categories } from "@/data/products";
import { getCategoryLabel } from "@/lib/utils/product-params";

interface ProductFiltersProps {
  variant?: "sidebar" | "drawer";
  onClose?: () => void;
  basePath?: string;
}

export function ProductFilters({
  variant = "sidebar",
  onClose,
  basePath = "/products",
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") ?? "";
  const selectedBrand = searchParams.get("brand") ?? "";

  function updateFilter(key: "category" | "brand", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    router.push(`${basePath}?${params.toString()}`);
    onClose?.();
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("brand");
    if (basePath === "/products") {
      params.delete("q");
    }
    params.set("page", "1");
    router.push(`${basePath}?${params.toString()}`);
    onClose?.();
  }

  const content = (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-sans text-base font-semibold text-foreground">
          Filters
        </h2>
        <button
          type="button"
          className="text-sm font-medium text-accent hover:underline"
          onClick={clearFilters}
        >
          Clear all
        </button>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-foreground">
          Category
        </legend>
        <div className="space-y-2">
          <FilterOption
            name="category"
            label="All categories"
            checked={selectedCategory === ""}
            onChange={() => updateFilter("category", "")}
          />
          {categories.map((category) => (
            <FilterOption
              key={category}
              name="category"
              label={getCategoryLabel(category)}
              checked={selectedCategory === category}
              onChange={() => updateFilter("category", category)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-foreground">
          Brand
        </legend>
        <div className="space-y-2">
          <FilterOption
            name="brand"
            label="All brands"
            checked={selectedBrand === ""}
            onChange={() => updateFilter("brand", "")}
          />
          {brands.map((brand) => (
            <FilterOption
              key={brand}
              name="brand"
              label={brand}
              checked={selectedBrand === brand}
              onChange={() => updateFilter("brand", brand)}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );

  if (variant === "drawer") {
    return content;
  }

  return (
    <aside className="card-surface h-fit p-5" aria-label="Product filters">
      {content}
    </aside>
  );
}

export function MobileFilterButton({
  basePath = "/products",
}: {
  basePath?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary lg:hidden"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-filters"
      >
        Filters
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          id="mobile-filters"
        >
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-surface p-5 shadow-[var(--shadow-md)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-foreground">Filters</p>
              <button
                type="button"
                className="btn btn-ghost min-h-9 px-3"
                onClick={() => setOpen(false)}
                aria-label="Close filter drawer"
              >
                Close
              </button>
            </div>
            <div className="overflow-y-auto">
              <ProductFilters
                variant="drawer"
                basePath={basePath}
                onClose={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function FilterOption({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="accent-primary"
      />
      <span>{label}</span>
    </label>
  );
}
