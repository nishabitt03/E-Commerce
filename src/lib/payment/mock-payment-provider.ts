import {
  MOCK_FAIL_CARD,
  type MockProcessPaymentRequest,
  type MockProcessPaymentResult,
} from "@/lib/payment/payment-types";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createMockTransactionId(): string {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MOCK-TXN-${Date.now().toString().slice(-6)}${suffix}`;
}

/**
 * Simulated payment provider for COD and deterministic automated tests.
 * Never contacts a real gateway. Never stores card/UPI secrets.
 */
export async function mockPaymentProvider(
  request: MockProcessPaymentRequest
): Promise<MockProcessPaymentResult> {
  await delay(700);

  if (request.paymentMethod === "card") {
    const digits = (request.cardNumber ?? "").replace(/\s/g, "");
    if (digits === MOCK_FAIL_CARD) {
      return {
        success: false,
        transactionId: createMockTransactionId(),
        paymentMethod: "card",
        message: "Payment failed. Please try another payment method.",
      };
    }
  }

  if (request.paymentMethod === "cod") {
    return {
      success: true,
      transactionId: createMockTransactionId(),
      paymentMethod: "cod",
      message: "Order confirmed. Pay when your order is delivered.",
    };
  }

  return {
    success: true,
    transactionId: createMockTransactionId(),
    paymentMethod: request.paymentMethod,
    message: "Payment successful",
  };
}
