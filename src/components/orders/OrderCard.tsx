"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import {
  formatOrderDate,
  getStatusBadgeClass,
  OrderTracking,
} from "@/components/orders/OrderTracking";
import type { Order } from "@/types/order";

interface OrderCardProps {
  order: Order;
  expanded?: boolean;
  onToggle?: () => void;
}

export function OrderCard({ order, expanded = false, onToggle }: OrderCardProps) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="card-surface overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 p-5">
        <div>
          <h2 className="font-sans text-base font-semibold text-foreground">
            Order #{order.id}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {formatOrderDate(order.createdAt)} · {itemCount} item
            {itemCount === 1 ? "" : "s"}
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {formatPrice(order.total)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span
            className={`badge ${getStatusBadgeClass(order.status)}`}
          >
            {order.status}
          </span>
          {onToggle ? (
            <button
              type="button"
              className="text-sm font-medium text-primary hover:underline"
              aria-expanded={expanded}
              onClick={onToggle}
            >
              {expanded ? "Hide details" : "View Order"}
            </button>
          ) : null}
        </div>
      </div>

      {expanded ? (
        <div className="border-t border-border bg-background/60 px-5 py-5">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-sans text-sm font-semibold text-foreground">
                Items
              </h3>
              <ul className="mt-3 space-y-3">
                {order.items.map((item) => (
                  <li
                    key={`${order.id}-${item.productId}-${item.variantLabel ?? ""}`}
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
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted">
                        {item.brand}
                        {item.variantLabel ? ` · ${item.variantLabel}` : ""} · Qty{" "}
                        {item.quantity}
                      </p>
                      <p className="text-sm text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-md border border-border bg-surface p-3 text-sm">
                <p className="font-semibold text-foreground">Shipping to</p>
                <p className="mt-1 text-muted">
                  {order.shippingAddress.fullName}
                  <br />
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.pincode}
                  <br />
                  {order.shippingAddress.phone}
                </p>
                <p className="mt-2 text-muted">
                  Payment: {order.paymentMethod.toUpperCase()} ·{" "}
                  {order.paymentStatus}
                  {order.transactionId ? ` · ${order.transactionId}` : ""}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-sans text-sm font-semibold text-foreground">
                Order Status
              </h3>
              <OrderTracking status={order.status} />
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
