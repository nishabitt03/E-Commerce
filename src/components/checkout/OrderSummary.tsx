"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types/cart";
import type { CartTotals } from "@/types/cart";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  totals: CartTotals;
}

export function CheckoutOrderSummary({
  items,
  totals,
}: CheckoutOrderSummaryProps) {
  return (
    <aside className="card-surface h-fit p-5" aria-label="Order summary">
      <h2 className="font-sans text-lg font-semibold text-foreground">
        Order Summary
      </h2>

      <ul className="mt-4 space-y-3 border-b border-border pb-4">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.variantId ?? "default"}`}
            className="flex gap-3"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-accent-soft">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {item.name}
              </p>
              <p className="text-xs text-muted">
                Qty {item.quantity}
                {item.variantLabel ? ` · ${item.variantLabel}` : ""}
              </p>
            </div>
            <p className="text-sm font-medium text-foreground">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Subtotal</dt>
          <dd>{formatPrice(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Discount</dt>
          <dd className="text-success">
            {totals.discount > 0
              ? `−${formatPrice(totals.discount)}`
              : formatPrice(0)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Shipping</dt>
          <dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-border pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(totals.total)}</dd>
        </div>
      </dl>
    </aside>
  );
}
