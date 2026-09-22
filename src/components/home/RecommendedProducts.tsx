import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types/product";

interface RecommendedProductsProps {
  products: Product[];
  title?: string;
  description?: string;
}

/**
 * Presentational recommendation shelf.
 * Phase 6 will feed this with concern-based matches.
 */
export function RecommendedProducts({
  products,
  title = "Recommended for you",
  description = "High-rated picks based on popularity and skin-friendly formulas",
}: RecommendedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section
      className="border-y border-border bg-surface py-14 sm:py-16"
      aria-labelledby="recommended-heading"
    >
      <div className="container-page">
        <div className="mb-8 max-w-2xl">
          <h2 id="recommended-heading" className="text-3xl text-foreground">
            {title}
          </h2>
          <p className="mt-2 text-muted">{description}</p>
        </div>

        <ProductGrid products={products} className="lg:grid-cols-4 xl:grid-cols-4" />
      </div>
    </section>
  );
}
