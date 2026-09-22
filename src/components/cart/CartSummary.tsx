"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { CartTotals } from "@/types/cart";

interface CartSummaryProps {
  totals: CartTotals;
}

export function CartSummary({ totals }: CartSummaryProps) {
  return (
    <aside className="card-surface h-fit p-5" aria-label="Order summary">
      <h2 className="font-sans text-lg font-semibold text-foreground">
        Order Summary
      </h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-medium text-foreground">
            {formatPrice(totals.subtotal)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Discount</dt>
          <dd className="font-medium text-success">
            {totals.discount > 0
              ? `−${formatPrice(totals.discount)}`
              : formatPrice(0)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Shipping</dt>
          <dd className="font-medium text-foreground">
            {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-3 text-base">
          <dt className="font-semibold text-foreground">Total</dt>
          <dd className="font-semibold text-foreground">
            {formatPrice(totals.total)}
          </dd>
        </div>
      </dl>

      <Link href="/checkout" className="btn btn-primary mt-6 w-full">
        Proceed to Checkout
      </Link>

      <Link
        href="/products"
        className="mt-3 block text-center text-sm font-medium text-primary hover:underline"
      >
        Continue shopping
      </Link>
    </aside>
  );
}
