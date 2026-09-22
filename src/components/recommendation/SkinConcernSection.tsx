"use client";

import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
  CONCERN_OPTIONS,
  SkinConcernSelector,
} from "@/components/recommendation/SkinConcernSelector";
import { trackEvent } from "@/lib/analytics/analytics";
import { getRecommendedProductsByConcern } from "@/lib/recommendations/product-recommendations";
import type { Product, SkinConcern } from "@/types/product";

interface SkinConcernSectionProps {
  products: Product[];
}

export function SkinConcernSection({ products }: SkinConcernSectionProps) {
  const [concern, setConcern] = useState<SkinConcern | null>(null);

  const recommended = concern
    ? getRecommendedProductsByConcern(products, concern, 4)
    : [];

  const concernLabel =
    CONCERN_OPTIONS.find((option) => option.id === concern)?.label ?? "";

  function handleSelect(next: SkinConcern) {
    setConcern(next);
    trackEvent("skin_concern_selected", { concern: next });
  }

  return (
    <section
      className="border-y border-border bg-accent-soft/40 py-14 sm:py-16"
      aria-labelledby="concern-heading"
    >
      <div className="container-page">
        <div className="mb-8 max-w-2xl">
          <h2 id="concern-heading" className="text-3xl text-foreground">
            What&apos;s your skin concern?
          </h2>
          <p className="mt-2 text-muted">
            Find products that fit your skincare routine — rule-based matches,
            not medical advice.
          </p>
        </div>

        <SkinConcernSelector selected={concern} onSelect={handleSelect} />

        {concern ? (
          <div className="mt-10">
            <h3 className="font-sans text-xl font-semibold text-foreground">
              Recommended for {concernLabel}
            </h3>
            <p className="mt-1 text-sm text-muted">
              Ranked by concern match, rating, and popularity.
            </p>

            {recommended.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="We couldn't find an exact match"
                  description="Explore our full collection to find products for your routine."
                  action={
                    <Link href="/products" className="btn btn-primary">
                      Browse Products
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="mt-6">
                <ProductGrid
                  products={recommended}
                  className="lg:grid-cols-4 xl:grid-cols-4"
                  onProductClick={(product) =>
                    trackEvent("recommendation_click", {
                      concern,
                      productId: product.id,
                      productName: product.name,
                    })
                  }
                />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
