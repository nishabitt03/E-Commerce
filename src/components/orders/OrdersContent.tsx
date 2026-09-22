"use client";

import { useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import { OrderCard } from "@/components/orders/OrderCard";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useOrderStore } from "@/store/order-store";

export function OrdersContent() {
  const mounted = useHasMounted();
  const orders = useOrderStore((state) => state.orders);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!mounted) {
    return (
      <div className="py-16 text-center text-muted" aria-busy="true">
        Loading orders...
      </div>
    );
  }

  const sorted = [...orders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="Once you place an order, you'll see it here."
        action={
          <Link href="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-foreground">My Orders</h1>
        <p className="mt-2 text-muted">
          {sorted.length} order{sorted.length === 1 ? "" : "s"} · demo persistence
          in localStorage
        </p>
      </div>

      <ul className="space-y-4">
        {sorted.map((order) => (
          <li key={order.id}>
            <OrderCard
              order={order}
              expanded={expandedId === order.id}
              onToggle={() =>
                setExpandedId((current) =>
                  current === order.id ? null : order.id
                )
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
