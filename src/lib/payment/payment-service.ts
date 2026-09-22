import crypto from "crypto";
import {
  createMockGatewayOrder,
  createMockPaymentSignature,
  createRazorpayGatewayOrder,
  getPaymentProviderName,
  getRazorpayKeyId,
  verifyMockPaymentSignature,
  verifyRazorpayPaymentSignature,
  buildPendingSession,
} from "@/lib/payment/razorpay-provider";
import { mockPaymentProvider } from "@/lib/payment/mock-payment-provider";
import {
  getPaymentSession,
  markPaymentStatus,
  savePaymentSession,
} from "@/lib/payment/payment-session-store";
import type {
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  MockProcessPaymentRequest,
  MockProcessPaymentResult,
  PaymentVerificationResult,
  VerifyPaymentRequest,
  VerifiedApplicationOrder,
} from "@/lib/payment/payment-types";
import {
  resolveTrustedCart,
  toPaise,
  TrustedCartError,
} from "@/lib/payment/trusted-cart";

function createReceipt(): string {
  return `rcpt_${Date.now().toString(36)}_${crypto.randomBytes(3).toString("hex")}`;
}

function createApplicationOrderId(): string {
  const date = new Date();
  const ymd = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const suffix = Math.floor(100 + Math.random() * 900);
  return `ORD-${ymd}-${suffix}`;
}

/**
 * COD / legacy mock path used by automated tests and cash-on-delivery.
 */
export async function processPayment(
  request: MockProcessPaymentRequest
): Promise<MockProcessPaymentResult> {
  return mockPaymentProvider(request);
}

/**
 * Create a gateway order from trusted catalog pricing.
 * Client-claimed totals are validated; amounts are never taken at face value.
 */
export async function createPaymentOrder(
  request: CreatePaymentOrderRequest
): Promise<CreatePaymentOrderResponse> {
  const { totals, orderItems } = resolveTrustedCart(request.lines);

  if (Math.round(request.claimedTotal) !== Math.round(totals.total)) {
    throw new TrustedCartError(
      "Cart total mismatch. Refresh the page and try again."
    );
  }

  const receipt = createReceipt();
  const provider = getPaymentProviderName();
  const amountPaise = toPaise(totals.total);

  let razorpayOrderId: string;

  if (provider === "razorpay") {
    const gatewayOrder = await createRazorpayGatewayOrder({
      amountInr: totals.total,
      receipt,
      notes: {
        receipt,
        itemCount: String(totals.itemCount),
      },
    });
    razorpayOrderId = gatewayOrder.id;
  } else {
    const mockOrder = createMockGatewayOrder({
      amountInr: totals.total,
      receipt,
    });
    razorpayOrderId = mockOrder.razorpayOrderId;
  }

  savePaymentSession(
    buildPendingSession({
      receipt,
      razorpayOrderId,
      amountPaise,
      totals,
      items: orderItems,
      shippingAddress: request.shippingAddress,
    })
  );

  markPaymentStatus(razorpayOrderId, "pending");

  return {
    provider,
    keyId: getRazorpayKeyId(),
    razorpayOrderId,
    amountPaise,
    currency: "INR",
    receipt,
    totals,
  };
}

export function verifyPayment(
  request: VerifyPaymentRequest
): PaymentVerificationResult {
  const session = getPaymentSession(request.razorpay_order_id);
  if (!session) {
    return {
      success: false,
      message: "Payment session not found. Please try checkout again.",
    };
  }

  // Idempotent: already verified and order created
  if (session.paymentStatus === "paid" && session.applicationOrderId) {
    return {
      success: true,
      message: "Payment already verified.",
      order: toVerifiedOrder(session, request.razorpay_payment_id),
    };
  }

  const provider = getPaymentProviderName();
  const signatureValid =
    provider === "razorpay"
      ? verifyRazorpayPaymentSignature(request)
      : verifyMockPaymentSignature(request);

  if (!signatureValid) {
    markPaymentStatus(request.razorpay_order_id, "failed");
    return {
      success: false,
      message:
        "Payment could not be verified. Your cart has been preserved. Please try again.",
    };
  }

  const applicationOrderId =
    session.applicationOrderId ?? createApplicationOrderId();

  const updated = markPaymentStatus(request.razorpay_order_id, "paid", {
    applicationOrderId,
    razorpayPaymentId: request.razorpay_payment_id,
  });

  if (!updated) {
    return {
      success: false,
      message: "Unable to finalize payment. Please try again.",
    };
  }

  return {
    success: true,
    message: "Payment verified successfully.",
    order: toVerifiedOrder(updated, request.razorpay_payment_id),
  };
}

function toVerifiedOrder(
  session: NonNullable<ReturnType<typeof getPaymentSession>>,
  paymentId: string
): VerifiedApplicationOrder {
  return {
    id: session.applicationOrderId ?? createApplicationOrderId(),
    createdAt: new Date().toISOString(),
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    transactionId: paymentId,
    razorpayOrderId: session.razorpayOrderId,
    razorpayPaymentId: paymentId,
    items: session.items,
    subtotal: session.totals.subtotal,
    discount: session.totals.discount,
    shipping: session.totals.shipping,
    total: session.totals.total,
    shippingAddress: session.shippingAddress,
  };
}

export type {
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  MockProcessPaymentRequest as PaymentRequest,
  MockProcessPaymentResult as PaymentResult,
  PaymentVerificationResult,
  VerifyPaymentRequest,
};
export { MOCK_FAIL_CARD } from "@/lib/payment/payment-types";
export { createMockPaymentSignature } from "@/lib/payment/razorpay-provider";
export { TrustedCartError } from "@/lib/payment/trusted-cart";
