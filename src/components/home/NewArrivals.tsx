import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types/product";

interface NewArrivalsProps {
  products: Product[];
}

export function NewArrivals({ products }: NewArrivalsProps) {
  return (
    <section className="container-page py-14 sm:py-16" aria-labelledby="new-heading">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="new-heading" className="text-3xl text-foreground">
            New Arrivals
          </h2>
          <p className="mt-2 text-muted">Fresh formulas just added to the shelf</p>
        </div>
        <Link
          href="/products?sort=newest"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <ProductGrid products={products} className="lg:grid-cols-4 xl:grid-cols-4" />
    </section>
  );
}
