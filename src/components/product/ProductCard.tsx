"use client";

import Image from "next/image";
import Link from "next/link";
import { Rating } from "@/components/common/Rating";
import { WishlistButton } from "@/components/product/WishlistButton";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useToastStore } from "@/store/toast-store";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onProductClick?: () => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.show);
  const outOfStock = product.stock <= 0;
  const defaultVariant = product.variants[0];

  function handleAddToCart() {
    const result = addItem({
      product,
      quantity: 1,
      variant: defaultVariant,
    });
    showToast(result.message);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow-sm)] transition-shadow duration-200 hover:shadow-[var(--shadow-md)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-accent-soft">
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0"
          aria-label={`View ${product.name}`}
          onClick={onProductClick}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </Link>

        {product.discountPercentage > 0 ? (
          <span className="badge absolute top-3 left-3 bg-primary text-primary-foreground">
            {product.discountPercentage}% OFF
          </span>
        ) : null}

        <div className="absolute top-3 right-3 z-10">
          <WishlistButton product={product} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
            {product.brand}
          </p>
          <h3 className="mt-1 font-sans text-base font-semibold text-foreground">
            <Link
              href={`/products/${product.slug}`}
              className="transition-colors hover:text-primary"
              onClick={onProductClick}
            >
              {product.name}
            </Link>
          </h3>
        </div>

        <Rating value={product.rating} reviewCount={product.reviewCount} />

        <div className="mt-auto flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price ? (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          className="btn btn-primary w-full"
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}

