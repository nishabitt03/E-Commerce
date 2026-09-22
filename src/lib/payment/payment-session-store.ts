import type {
  GatewayPaymentStatus,
  PendingPaymentSession,
} from "@/lib/payment/payment-types";

/**
 * In-memory payment session store for the portfolio demo.
 * Production apps would persist this in a database.
 */
const sessions = new Map<string, PendingPaymentSession>();
const processedWebhookEvents = new Set<string>();

export function savePaymentSession(session: PendingPaymentSession): void {
  sessions.set(session.razorpayOrderId, session);
}

export function getPaymentSession(
  razorpayOrderId: string
): PendingPaymentSession | undefined {
  return sessions.get(razorpayOrderId);
}

export function updatePaymentSession(
  razorpayOrderId: string,
  patch: Partial<PendingPaymentSession>
): PendingPaymentSession | undefined {
  const existing = sessions.get(razorpayOrderId);
  if (!existing) return undefined;
  const next = { ...existing, ...patch };
  sessions.set(razorpayOrderId, next);
  return next;
}

export function markPaymentStatus(
  razorpayOrderId: string,
  paymentStatus: GatewayPaymentStatus,
  extras?: Partial<PendingPaymentSession>
): PendingPaymentSession | undefined {
  return updatePaymentSession(razorpayOrderId, {
    paymentStatus,
    ...extras,
  });
}

export function hasProcessedWebhookEvent(eventId: string): boolean {
  return processedWebhookEvents.has(eventId);
}

export function markWebhookEventProcessed(eventId: string): void {
  processedWebhookEvents.add(eventId);
}

/** Test helper — clears in-memory state between unit tests. */
export function resetPaymentStoreForTests(): void {
  sessions.clear();
  processedWebhookEvents.clear();
}
