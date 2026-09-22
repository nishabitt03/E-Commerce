"use client";

import type { Order, OrderStatus } from "@/types/order";

const STEPS: OrderStatus[] = [
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

interface OrderTrackingProps {
  status: OrderStatus;
}

export function OrderTracking({ status }: OrderTrackingProps) {
  const currentIndex = STEPS.indexOf(status);

  return (
    <ol className="space-y-0" aria-label="Order status timeline">
      {STEPS.map((step, index) => {
        const complete = index < currentIndex;
        const current = index === currentIndex;

        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={
                  complete || current
                    ? "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                    : "flex h-7 w-7 items-center justify-center rounded-full border border-border text-xs text-muted"
                }
                aria-hidden="true"
              >
                {complete ? "✓" : current ? "●" : "○"}
              </span>
              {index < STEPS.length - 1 ? (
                <span
                  className={
                    complete
                      ? "my-1 w-px flex-1 bg-primary"
                      : "my-1 w-px flex-1 bg-border"
                  }
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <div className={index < STEPS.length - 1 ? "pb-4" : ""}>
              <p
                className={
                  current
                    ? "font-semibold text-foreground"
                    : complete
                      ? "text-foreground"
                      : "text-muted"
                }
              >
                {step}
                {current ? (
                  <span className="sr-only"> (current status)</span>
                ) : null}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function getStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case "Delivered":
      return "bg-success/15 text-success";
    case "Out for Delivery":
      return "bg-warning/15 text-warning";
    case "Shipped":
      return "bg-accent-soft text-accent";
    default:
      return "bg-border/60 text-foreground";
  }
}

export function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export type { Order };
