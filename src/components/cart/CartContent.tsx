"use client";

import { useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import { CartItemRow } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { calculateCartTotals } from "@/lib/utils/cart";
import { useCartStore } from "@/store/cart-store";
import { useToastStore } from "@/store/toast-store";

export function CartContent() {
  const mounted = useHasMounted();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const showToast = useToastStore((state) => state.show);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!mounted) {
    return (
      <div className="py-16 text-center text-muted" aria-busy="true">
        Loading cart...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Looks like you haven't added anything yet."
        action={
          <Link href="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        }
      />
    );
  }

  const totals = calculateCartTotals(items);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl text-foreground">Your Cart</h1>
          <p className="mt-1 text-sm text-muted">
            {totals.itemCount} item{totals.itemCount === 1 ? "" : "s"}
          </p>
        </div>

        {confirmClear ? (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Confirm clear cart">
            <p className="text-sm text-muted">Clear all items?</p>
            <button
              type="button"
              className="btn btn-secondary min-h-9 px-3 text-sm"
              onClick={() => {
                clearCart();
                setConfirmClear(false);
                showToast("Cart cleared");
              }}
            >
              Yes, clear
            </button>
            <button
              type="button"
              className="btn btn-ghost min-h-9 px-3 text-sm"
              onClick={() => setConfirmClear(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="text-sm font-medium text-danger hover:underline"
            onClick={() => setConfirmClear(true)}
          >
            Clear Cart
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="card-surface px-4 sm:px-5">
          {items.map((item) => (
            <CartItemRow
              key={`${item.productId}-${item.variantId ?? "default"}`}
              item={item}
            />
          ))}
        </div>
        <CartSummary totals={totals} />
      </div>
    </div>
  );
}
