"use client";

import { useCartStore } from "@/store/cart-store";
import { useToastStore } from "@/store/toast-store";
import type { Product, ProductVariant } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: ProductVariant;
  className?: string;
  label?: string;
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant,
  className = "btn btn-primary w-full",
  label = "Add to Cart",
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.show);
  const outOfStock = (variant?.stock ?? product.stock) <= 0;

  function handleAddToCart() {
    const result = addItem({ product, quantity, variant });
    showToast(result.message);
  }

  return (
    <button
      type="button"
      className={className}
      disabled={outOfStock}
      onClick={handleAddToCart}
    >
      {outOfStock ? "Out of Stock" : label}
    </button>
  );
}
