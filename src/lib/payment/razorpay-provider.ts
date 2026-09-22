import crypto from "crypto";
import Razorpay from "razorpay";
import {
  validatePaymentVerification,
  validateWebhookSignature,
} from "razorpay/dist/utils/razorpay-utils";
import type {
  CreatePaymentOrderResponse,
  PendingPaymentSession,
  PaymentProviderName,
  VerifyPaymentRequest,
} from "@/lib/payment/payment-types";
import { toPaise } from "@/lib/payment/trusted-cart";
import type { CartTotals } from "@/types/cart";
import type { OrderItem, ShippingAddress } from "@/types/order";

export function getPaymentProviderName(): PaymentProviderName {
  const mode = process.env.PAYMENT_MODE?.toLowerCase();
  if (mode === "mock") return "mock";
  if (mode === "razorpay") return "razorpay";

  // Default: use Razorpay when secrets are present, otherwise mock for local/CI.
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    return "razorpay";
  }
  return "mock";
}

export function getRazorpayKeyId(): string {
  return (
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID ||
    "rzp_test_mock_key"
  );
}

function getRazorpayKeySecret(): string {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured.");
  }
  return secret;
}

function getWebhookSecret(): string {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("RAZORPAY_WEBHOOK_SECRET is not configured.");
  }
  return secret;
}

function createRazorpayClient(): Razorpay {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: getRazorpayKeySecret(),
  });
}

export async function createRazorpayGatewayOrder(input: {
  amountInr: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string }> {
  const amountPaise = toPaise(input.amountInr);
  const client = createRazorpayClient();
  const order = await client.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: input.receipt,
    notes: input.notes,
  });

  return {
    id: String(order.id),
    amount: Number(order.amount),
    currency: String(order.currency),
  };
}

export function verifyRazorpayPaymentSignature(
  payload: VerifyPaymentRequest
): boolean {
  return validatePaymentVerification(
    {
      order_id: payload.razorpay_order_id,
      payment_id: payload.razorpay_payment_id,
    },
    payload.razorpay_signature,
    getRazorpayKeySecret()
  );
}

export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  return validateWebhookSignature(rawBody, signature, getWebhookSecret());
}

/** Deterministic mock order for CI / local without Razorpay credentials. */
export function createMockGatewayOrder(input: {
  amountInr: number;
  receipt: string;
}): CreatePaymentOrderResponse {
  const amountPaise = toPaise(input.amountInr);
  const razorpayOrderId = `order_mock_${crypto.randomBytes(6).toString("hex")}`;

  return {
    provider: "mock",
    keyId: getRazorpayKeyId(),
    razorpayOrderId,
    amountPaise,
    currency: "INR",
    receipt: input.receipt,
    totals: {
      subtotal: 0,
      discount: 0,
      shipping: 0,
      total: input.amountInr,
      itemCount: 0,
    },
  };
}

export function createMockPaymentSignature(
  orderId: string,
  paymentId: string
): string {
  const secret =
    process.env.RAZORPAY_KEY_SECRET || "mock_razorpay_key_secret_for_tests";
  return crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

export function verifyMockPaymentSignature(payload: VerifyPaymentRequest): boolean {
  const expected = createMockPaymentSignature(
    payload.razorpay_order_id,
    payload.razorpay_payment_id
  );
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(payload.razorpay_signature)
    );
  } catch {
    return false;
  }
}

export function buildPendingSession(input: {
  receipt: string;
  razorpayOrderId: string;
  amountPaise: number;
  totals: CartTotals;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
}): PendingPaymentSession {
  return {
    receipt: input.receipt,
    razorpayOrderId: input.razorpayOrderId,
    amountPaise: input.amountPaise,
    currency: "INR",
    totals: input.totals,
    items: input.items,
    shippingAddress: input.shippingAddress,
    paymentStatus: "created",
    createdAt: new Date().toISOString(),
  };
}
