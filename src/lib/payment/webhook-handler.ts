import crypto from "crypto";
import {
  getPaymentSession,
  hasProcessedWebhookEvent,
  markPaymentStatus,
  markWebhookEventProcessed,
} from "@/lib/payment/payment-session-store";
import {
  getPaymentProviderName,
  verifyRazorpayWebhookSignature,
} from "@/lib/payment/razorpay-provider";

export interface RazorpayWebhookPayload {
  event?: string;
  id?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
      };
    };
    order?: {
      entity?: {
        id?: string;
        status?: string;
      };
    };
  };
}

export interface WebhookProcessResult {
  ok: boolean;
  status: number;
  duplicate?: boolean;
  error?: string;
}

function verifyMockWebhook(rawBody: string, signature: string): boolean {
  const secret =
    process.env.RAZORPAY_WEBHOOK_SECRET || "mock_webhook_secret_for_tests";
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

export function processRazorpayWebhook(
  rawBody: string,
  signature: string
): WebhookProcessResult {
  if (!signature) {
    return { ok: false, status: 400, error: "Missing signature." };
  }

  const provider = getPaymentProviderName();
  let valid = false;

  try {
    valid =
      provider === "razorpay"
        ? verifyRazorpayWebhookSignature(rawBody, signature)
        : verifyMockWebhook(rawBody, signature);
  } catch {
    return { ok: false, status: 400, error: "Invalid signature." };
  }

  if (!valid) {
    return { ok: false, status: 400, error: "Invalid signature." };
  }

  let body: RazorpayWebhookPayload;
  try {
    body = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON body." };
  }

  const eventId =
    body.id ||
    `${body.event ?? "unknown"}_${body.payload?.payment?.entity?.id ?? body.payload?.order?.entity?.id ?? "na"}`;

  if (hasProcessedWebhookEvent(eventId)) {
    return { ok: true, status: 200, duplicate: true };
  }

  const eventName = body.event ?? "";
  const paymentEntity = body.payload?.payment?.entity;
  const orderId =
    paymentEntity?.order_id || body.payload?.order?.entity?.id || "";

  if (orderId && getPaymentSession(orderId)) {
    if (eventName === "payment.captured" || eventName === "order.paid") {
      markPaymentStatus(orderId, "paid", {
        razorpayPaymentId: paymentEntity?.id,
      });
    }

    if (eventName === "payment.failed") {
      markPaymentStatus(orderId, "failed", {
        razorpayPaymentId: paymentEntity?.id,
      });
    }
  }

  markWebhookEventProcessed(eventId);

  return { ok: true, status: 200 };
}
