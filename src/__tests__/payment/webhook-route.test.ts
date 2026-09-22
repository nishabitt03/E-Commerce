import {
  createPaymentOrder,
  createMockPaymentSignature,
} from "@/lib/payment/payment-service";
import {
  getPaymentSession,
  resetPaymentStoreForTests,
} from "@/lib/payment/payment-session-store";
import { processRazorpayWebhook } from "@/lib/payment/webhook-handler";
import { resolveTrustedCart } from "@/lib/payment/trusted-cart";
import { products } from "@/data/products";
import crypto from "crypto";

const shippingAddress = {
  fullName: "Ankit Kumar",
  phone: "9876543210",
  email: "test@example.com",
  address: "123 Main Street",
  city: "Noida",
  state: "Uttar Pradesh",
  pincode: "201301",
};

describe("Razorpay webhook processing", () => {
  beforeEach(() => {
    resetPaymentStoreForTests();
    process.env.PAYMENT_MODE = "mock";
    process.env.RAZORPAY_WEBHOOK_SECRET = "mock_webhook_secret_for_tests";
    process.env.RAZORPAY_KEY_SECRET = "mock_razorpay_key_secret_for_tests";
  });

  it("rejects requests with an invalid signature", () => {
    const result = processRazorpayWebhook(
      JSON.stringify({ event: "payment.captured" }),
      "bad-signature"
    );
    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
  });

  it("updates payment status on payment.captured and ignores duplicates", async () => {
    const product = products[0];
    const { totals } = resolveTrustedCart([
      { productId: product.id, variantId: product.variants[0]?.id, quantity: 1 },
    ]);

    const created = await createPaymentOrder({
      lines: [
        {
          productId: product.id,
          variantId: product.variants[0]?.id,
          quantity: 1,
        },
      ],
      claimedTotal: totals.total,
      currency: "INR",
      shippingAddress,
    });

    const body = JSON.stringify({
      event: "payment.captured",
      id: "evt_capture_1",
      payload: {
        payment: {
          entity: {
            id: "pay_wh_1",
            order_id: created.razorpayOrderId,
            status: "captured",
          },
        },
      },
    });

    const signature = crypto
      .createHmac("sha256", "mock_webhook_secret_for_tests")
      .update(body)
      .digest("hex");

    const first = processRazorpayWebhook(body, signature);
    expect(first.ok).toBe(true);
    expect(getPaymentSession(created.razorpayOrderId)?.paymentStatus).toBe(
      "paid"
    );

    const duplicate = processRazorpayWebhook(body, signature);
    expect(duplicate.duplicate).toBe(true);

    expect(
      createMockPaymentSignature(created.razorpayOrderId, "pay_wh_1")
    ).toHaveLength(64);
  });

  it("marks payment failed on payment.failed", async () => {
    const product = products[0];
    const { totals } = resolveTrustedCart([
      { productId: product.id, variantId: product.variants[0]?.id, quantity: 1 },
    ]);

    const created = await createPaymentOrder({
      lines: [
        {
          productId: product.id,
          variantId: product.variants[0]?.id,
          quantity: 1,
        },
      ],
      claimedTotal: totals.total,
      currency: "INR",
      shippingAddress,
    });

    const body = JSON.stringify({
      event: "payment.failed",
      id: "evt_fail_1",
      payload: {
        payment: {
          entity: {
            id: "pay_wh_fail",
            order_id: created.razorpayOrderId,
            status: "failed",
          },
        },
      },
    });

    const signature = crypto
      .createHmac("sha256", "mock_webhook_secret_for_tests")
      .update(body)
      .digest("hex");

    const result = processRazorpayWebhook(body, signature);
    expect(result.ok).toBe(true);
    expect(getPaymentSession(created.razorpayOrderId)?.paymentStatus).toBe(
      "failed"
    );
  });
});
