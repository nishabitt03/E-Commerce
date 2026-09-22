"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types/order";

interface CheckoutSuccessProps {
  order: Order;
}

export function CheckoutSuccess({ order }: CheckoutSuccessProps) {
  return (
    <div className="mx-auto max-w-lg rounded-lg border border-border bg-surface px-6 py-12 text-center shadow-[var(--shadow-sm)]">
      <p className="text-4xl text-success" aria-hidden="true">
        ✓
      </p>
      <h1 className="mt-4 text-3xl text-foreground">Order Placed Successfully</h1>
      <p className="mt-2 text-muted">Thank you for your order.</p>

      <dl className="mt-8 space-y-3 text-left text-sm">
        <div className="flex justify-between gap-4 border-b border-border pb-3">
          <dt className="text-muted">Order ID</dt>
          <dd className="font-semibold text-foreground">{order.id}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-border pb-3">
          <dt className="text-muted">Payment</dt>
          <dd className="font-medium uppercase text-foreground">
            {order.paymentMethod}
          </dd>
        </div>
        {order.transactionId ? (
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted">Transaction</dt>
            <dd className="font-mono text-xs text-foreground">
              {order.transactionId}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 border-b border-border pb-3">
          <dt className="text-muted">Total</dt>
          <dd className="font-semibold text-foreground">
            {formatPrice(order.total)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Estimated delivery</dt>
          <dd className="text-foreground">3–5 business days</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/orders" className="btn btn-primary">
          View Order
        </Link>
        <Link href="/products" className="btn btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
