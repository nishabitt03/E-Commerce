import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { sampleProduct, sampleVariant } from "@/__tests__/fixtures/products";

const trackEvent = jest.fn();

jest.mock("@/lib/analytics/analytics", () => ({
  trackEvent: (...args: unknown[]) => trackEvent(...args),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt || ""} src={src} />
  ),
}));

jest.mock("@/lib/payment/payment-service", () => ({
  processPayment: jest.fn(async ({ paymentMethod }) => ({
    success: true,
    transactionId: "MOCK-TXN-OK",
    paymentMethod,
    message: "Payment successful",
  })),
}));

describe("CheckoutForm", () => {
  beforeEach(() => {
    trackEvent.mockClear();
    useOrderStore.setState({ orders: [] });
    useCartStore.setState({ items: [] });
    localStorage.clear();

    useCartStore.getState().addItem({
      product: sampleProduct,
      quantity: 1,
      variant: sampleVariant,
    });
  });

  it("shows validation errors for an empty submission", async () => {
    const user = userEvent.setup();
    render(<CheckoutForm onSuccess={jest.fn()} />);

    await user.clear(screen.getByLabelText(/full name/i));
    await user.click(screen.getByRole("button", { name: /place order/i }));

    expect(
      await screen.findByText(/full name must be at least 2 characters/i)
    ).toBeInTheDocument();
  });

  it("submits a valid COD checkout and creates an order", async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();

    render(<CheckoutForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/full name/i), "Ankit Kumar");
    await user.type(screen.getByLabelText(/^phone$/i), "9876543210");
    await user.type(screen.getByLabelText(/^email$/i), "test@example.com");
    await user.type(screen.getByLabelText(/^address$/i), "123 Main Street");
    await user.type(screen.getByLabelText(/^city$/i), "Noida");
    await user.type(screen.getByLabelText(/^state$/i), "Uttar Pradesh");
    await user.type(screen.getByLabelText(/^pincode$/i), "201301");

    await user.click(screen.getByRole("button", { name: /place order/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useOrderStore.getState().orders.length).toBeGreaterThan(0);
    expect(trackEvent).toHaveBeenCalledWith(
      "purchase",
      expect.objectContaining({
        paymentMethod: "cod",
      })
    );
  });

  it("starts a Razorpay payment order from checkout", async () => {
    const user = userEvent.setup();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        provider: "mock",
        keyId: "rzp_test_mock",
        razorpayOrderId: "order_mock_test",
        amountPaise: 84800,
        currency: "INR",
        receipt: "rcpt_test",
        totals: {
          subtotal: 799,
          discount: 0,
          shipping: 49,
          total: 848,
          itemCount: 1,
        },
      }),
    }) as unknown as typeof fetch;

    render(<CheckoutForm onSuccess={jest.fn()} />);

    await user.type(screen.getByLabelText(/full name/i), "Ankit Kumar");
    await user.type(screen.getByLabelText(/^phone$/i), "9876543210");
    await user.type(screen.getByLabelText(/^email$/i), "test@example.com");
    await user.type(screen.getByLabelText(/^address$/i), "123 Main Street");
    await user.type(screen.getByLabelText(/^city$/i), "Noida");
    await user.type(screen.getByLabelText(/^state$/i), "Uttar Pradesh");
    await user.type(screen.getByLabelText(/^pincode$/i), "201301");
    await user.click(screen.getByRole("radio", { name: /pay online/i }));
    await user.click(
      screen.getByRole("button", { name: /continue to payment/i })
    );

    expect(
      await screen.findByRole("button", { name: /pay with razorpay/i })
    ).toBeInTheDocument();
    expect(trackEvent).toHaveBeenCalledWith(
      "payment_initiated",
      expect.objectContaining({ total: expect.any(Number) })
    );
    expect(useCartStore.getState().items).toHaveLength(1);
  });
});
