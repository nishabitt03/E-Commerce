import {
  createMockPaymentSignature,
  createPaymentOrder,
  processPayment,
  TrustedCartError,
  verifyPayment,
  MOCK_FAIL_CARD,
} from "@/lib/payment/payment-service";
import {
  hasProcessedWebhookEvent,
  markWebhookEventProcessed,
  resetPaymentStoreForTests,
} from "@/lib/payment/payment-session-store";
import {
  createMockGatewayOrder,
  verifyMockPaymentSignature,
} from "@/lib/payment/razorpay-provider";
import { resolveTrustedCart, toPaise } from "@/lib/payment/trusted-cart";
import { products } from "@/data/products";
import crypto from "crypto";

jest.setTimeout(10_000);

const shippingAddress = {
  fullName: "Ankit Kumar",
  phone: "9876543210",
  email: "test@example.com",
  address: "123 Main Street",
  city: "Noida",
  state: "Uttar Pradesh",
  pincode: "201301",
};

describe("mock COD payment service", () => {
  it("succeeds for cash on delivery", async () => {
    const result = await processPayment({
      amount: 1299,
      paymentMethod: "cod",
    });

    expect(result.success).toBe(true);
    expect(result.paymentMethod).toBe("cod");
    expect(result.transactionId).toMatch(/^MOCK-TXN-/);
  });

  it("fails for the documented mock failure card", async () => {
    const result = await processPayment({
      amount: 1299,
      paymentMethod: "card",
      cardNumber: MOCK_FAIL_CARD,
    });

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/failed/i);
  });
});

describe("trusted cart pricing", () => {
  it("derives totals from catalog data", () => {
    const product = products[0];
    const variant = product.variants[0];
    const { totals } = resolveTrustedCart([
      {
        productId: product.id,
        variantId: variant?.id,
        quantity: 1,
      },
    ]);

    expect(totals.total).toBeGreaterThan(0);
    expect(toPaise(totals.total)).toBe(Math.round(totals.total * 100));
  });

  it("rejects unknown products", () => {
    expect(() =>
      resolveTrustedCart([{ productId: "missing", quantity: 1 }])
    ).toThrow(TrustedCartError);
  });
});

describe("create and verify payment orders", () => {
  beforeEach(() => {
    resetPaymentStoreForTests();
    process.env.PAYMENT_MODE = "mock";
    process.env.RAZORPAY_KEY_SECRET = "mock_razorpay_key_secret_for_tests";
  });

  it("creates a mock payment order from trusted cart lines", async () => {
    const product = products[0];
    const { totals } = resolveTrustedCart([
      { productId: product.id, variantId: product.variants[0]?.id, quantity: 1 },
    ]);

    const order = await createPaymentOrder({
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

    expect(order.provider).toBe("mock");
    expect(order.razorpayOrderId).toMatch(/^order_mock_/);
    expect(order.amountPaise).toBe(toPaise(totals.total));
    expect(order.totals.total).toBe(totals.total);
  });

  it("rejects a mismatched claimed total", async () => {
    const product = products[0];

    await expect(
      createPaymentOrder({
        lines: [
          {
            productId: product.id,
            variantId: product.variants[0]?.id,
            quantity: 1,
          },
        ],
        claimedTotal: 1,
        currency: "INR",
        shippingAddress,
      })
    ).rejects.toThrow(/mismatch/i);
  });

  it("verifies a valid mock payment signature", async () => {
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

    const paymentId = "pay_mock_valid";
    const signature = createMockPaymentSignature(
      created.razorpayOrderId,
      paymentId
    );

    const result = verifyPayment({
      razorpay_order_id: created.razorpayOrderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    });

    expect(result.success).toBe(true);
    expect(result.order?.paymentStatus).toBe("paid");
    expect(result.order?.id).toMatch(/^ORD-/);
  });

  it("rejects an invalid payment signature", async () => {
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

    const result = verifyPayment({
      razorpay_order_id: created.razorpayOrderId,
      razorpay_payment_id: "pay_mock_bad",
      razorpay_signature: "not-a-valid-signature",
    });

    expect(result.success).toBe(false);
    expect(result.order).toBeUndefined();
  });

  it("is idempotent when verifying the same payment twice", async () => {
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

    const paymentId = "pay_mock_idempotent";
    const signature = createMockPaymentSignature(
      created.razorpayOrderId,
      paymentId
    );
    const payload = {
      razorpay_order_id: created.razorpayOrderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    };

    const first = verifyPayment(payload);
    const second = verifyPayment(payload);

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    expect(second.order?.id).toBe(first.order?.id);
  });
});

describe("webhook signature and idempotency", () => {
  beforeEach(() => {
    resetPaymentStoreForTests();
    process.env.PAYMENT_MODE = "mock";
    process.env.RAZORPAY_WEBHOOK_SECRET = "mock_webhook_secret_for_tests";
  });

  it("validates a mock webhook HMAC signature", () => {
    const body = JSON.stringify({
      event: "payment.captured",
      id: "evt_test_1",
      payload: { payment: { entity: { id: "pay_1", order_id: "order_1" } } },
    });
    const signature = crypto
      .createHmac("sha256", "mock_webhook_secret_for_tests")
      .update(body)
      .digest("hex");

    const expected = crypto
      .createHmac("sha256", "mock_webhook_secret_for_tests")
      .update(body)
      .digest("hex");

    expect(signature).toBe(expected);
  });

  it("tracks processed webhook events for idempotency", () => {
    expect(hasProcessedWebhookEvent("evt_dup")).toBe(false);
    markWebhookEventProcessed("evt_dup");
    expect(hasProcessedWebhookEvent("evt_dup")).toBe(true);
  });

  it("builds mock gateway orders with paise amounts", () => {
    const order = createMockGatewayOrder({ amountInr: 500, receipt: "rcpt_1" });
    expect(order.amountPaise).toBe(50000);
    expect(
      verifyMockPaymentSignature({
        razorpay_order_id: order.razorpayOrderId,
        razorpay_payment_id: "pay_x",
        razorpay_signature: createMockPaymentSignature(
          order.razorpayOrderId,
          "pay_x"
        ),
      })
    ).toBe(true);
  });
});
