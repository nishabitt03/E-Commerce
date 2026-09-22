"use client";

import { useState } from "react";
import Link from "next/link";
import { BeginCheckoutTracker } from "@/components/analytics/BeginCheckoutTracker";
import { EmptyState } from "@/components/common/EmptyState";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutSuccess } from "@/components/checkout/CheckoutSuccess";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { calculateCartTotals } from "@/lib/utils/cart";
import { useCartStore } from "@/store/cart-store";
import type { Order } from "@/types/order";

export function CheckoutContent() {
  const mounted = useHasMounted();
  const items = useCartStore((state) => state.items);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!mounted) {
    return (
      <div className="py-16 text-center text-muted" aria-busy="true">
        Loading checkout...
      </div>
    );
  }

  if (completedOrder) {
    return <CheckoutSuccess order={completedOrder} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add some products before proceeding to checkout."
        action={
          <Link href="/products" className="btn btn-primary">
            Browse Products
          </Link>
        }
      />
    );
  }

  const totals = calculateCartTotals(items);

  return (
    <div className="space-y-6">
      <BeginCheckoutTracker
        itemCount={totals.itemCount}
        total={totals.total}
      />
      <div>
        <h1 className="text-3xl text-foreground">Checkout</h1>
        <p className="mt-2 text-muted">
          Demo checkout — Cash on Delivery or Razorpay Test Mode. No real money
          is charged.
        </p>
      </div>
      <CheckoutForm onSuccess={setCompletedOrder} />
    </div>
  );
}
