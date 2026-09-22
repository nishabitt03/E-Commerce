import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types/product";

interface BestSellersProps {
  products: Product[];
}

export function BestSellers({ products }: BestSellersProps) {
  return (
    <section
      className="border-y border-border bg-surface py-14 sm:py-16"
      aria-labelledby="bestsellers-heading"
    >
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="bestsellers-heading" className="text-3xl text-foreground">
              Best Sellers
            </h2>
            <p className="mt-2 text-muted">Shop our most popular products</p>
          </div>
          <Link
            href="/products?sort=popular"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View All
          </Link>
        </div>

        <ProductGrid products={products} className="lg:grid-cols-4 xl:grid-cols-4" />
      </div>
    </section>
  );
}
