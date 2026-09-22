import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  className?: string;
  onProductClick?: (product: Product) => void;
}

export function ProductGrid({
  products,
  className,
  onProductClick,
}: ProductGridProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            onProductClick={
              onProductClick ? () => onProductClick(product) : undefined
            }
          />
        </li>
      ))}
    </ul>
  );
}
