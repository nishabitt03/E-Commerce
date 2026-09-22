"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useToastStore } from "@/store/toast-store";
import type { CartItem } from "@/types/cart";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const showToast = useToastStore((state) => state.show);

  const lineTotal = item.price * item.quantity;
  const atMax = item.quantity >= item.maxStock;

  function handleIncrease() {
    const result = increaseQuantity(item.productId, item.variantId);
    if (!result.ok) showToast(result.message);
  }

  return (
    <article className="flex gap-4 border-b border-border py-5 last:border-b-0">
      <Link
        href={`/products/${item.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-accent-soft sm:h-28 sm:w-28"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="112px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">
              {item.brand}
            </p>
            <h2 className="font-sans text-base font-semibold text-foreground">
              <Link
                href={`/products/${item.slug}`}
                className="hover:text-primary"
              >
                {item.name}
              </Link>
            </h2>
            {item.variantLabel ? (
              <p className="mt-1 text-sm text-muted">{item.variantLabel}</p>
            ) : null}
          </div>

          <div className="text-right">
            <p className="font-semibold text-foreground">
              {formatPrice(item.price)}
            </p>
            {item.originalPrice > item.price ? (
              <p className="text-sm text-muted line-through">
                {formatPrice(item.originalPrice)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <div
            className="inline-flex items-center rounded-md border border-border"
            role="group"
            aria-label={`Quantity for ${item.name}`}
          >
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center disabled:opacity-40"
              aria-label={`Decrease quantity of ${item.name}`}
              disabled={item.quantity <= 1}
              onClick={() => decreaseQuantity(item.productId, item.variantId)}
            >
              −
            </button>
            <span className="min-w-8 text-center text-sm font-semibold" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center disabled:opacity-40"
              aria-label={`Increase quantity of ${item.name}`}
              disabled={atMax}
              onClick={handleIncrease}
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm font-semibold text-foreground">
              Subtotal: {formatPrice(lineTotal)}
            </p>
            <button
              type="button"
              className="text-sm font-medium text-danger hover:underline"
              aria-label={`Remove ${item.name} from cart`}
              onClick={() => {
                removeItem(item.productId, item.variantId);
                showToast("Removed from cart");
              }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
