"use client";

import { useQuery } from "@tanstack/react-query";
import type { Order } from "@/types/order";

async function fetchCatalogOrders(): Promise<Order[]> {
  const response = await fetch("/api/orders");
  if (!response.ok) {
    throw new Error("Unable to load catalog orders");
  }
  return response.json() as Promise<Order[]>;
}

/**
 * Demonstrates TanStack Query against the mock REST orders API.
 * Checkout-created orders remain in Zustand; this shows shared API caching.
 */
export function CatalogOrdersPanel() {
  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["orders", "catalog"],
    queryFn: fetchCatalogOrders,
  });

  return (
    <section
      className="card-surface p-5"
      aria-labelledby="catalog-orders-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="catalog-orders-heading"
            className="font-sans text-lg font-semibold text-foreground"
          >
            Sample store orders
          </h2>
          <p className="mt-1 text-sm text-muted">
            Loaded with TanStack Query from the mock{" "}
            <code className="text-xs">/api/orders</code> route.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary min-h-9 px-3 text-sm"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {isPending ? (
        <p className="mt-4 text-sm text-muted" aria-busy="true">
          Loading sample orders…
        </p>
      ) : null}

      {isError ? (
        <p className="mt-4 text-sm text-danger" role="alert">
          Could not load sample orders. Try refreshing.
        </p>
      ) : null}

      {data && data.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {data.slice(0, 3).map((order) => (
            <li
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-2 text-sm last:border-0"
            >
              <span className="font-medium text-foreground">{order.id}</span>
              <span className="text-muted capitalize">{order.status}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
