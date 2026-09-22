"use client";

import { useRouter } from "next/navigation";
import { WishlistButton } from "@/components/product/WishlistButton";
import { useCartStore } from "@/store/cart-store";
import { useToastStore } from "@/store/toast-store";
import type { Product, ProductVariant } from "@/types/product";

interface ProductActionsProps {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
  disabled?: boolean;
}

export function ProductActions({
  product,
  quantity,
  variant,
  disabled = false,
}: ProductActionsProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.show);

  function handleAddToCart() {
    const result = addItem({ product, quantity, variant });
    showToast(result.message);
  }

  function handleBuyNow() {
    const result = addItem({ product, quantity, variant });
    showToast(result.message);
    if (result.ok) {
      router.push("/checkout");
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="btn btn-primary"
          disabled={disabled}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={disabled}
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>

      <WishlistButton product={product} variant="button" />
    </div>
  );
}
