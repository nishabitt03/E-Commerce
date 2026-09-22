import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types/product";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <div className="mb-6">
        <h2 id="related-heading" className="text-2xl text-foreground">
          Related products
        </h2>
        <p className="mt-2 text-muted">
          More picks from a similar category, brand, or skin concern
        </p>
      </div>
      <ProductGrid products={products} className="lg:grid-cols-4 xl:grid-cols-4" />
    </section>
  );
}
