"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types/product";

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedId: string;
  onChange: (variantId: string) => void;
}

export function ProductVariants({
  variants,
  selectedId,
  onChange,
}: ProductVariantsProps) {
  if (variants.length === 0) return null;

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-foreground">Size</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Product size">
        {variants.map((variant) => {
          const selected = variant.id === selectedId;
          const disabled = variant.stock <= 0;

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(variant.id)}
              className={cn(
                "min-h-10 rounded-md border px-3 text-sm font-medium transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-foreground hover:border-primary",
                disabled && "cursor-not-allowed opacity-45"
              )}
            >
              {variant.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
