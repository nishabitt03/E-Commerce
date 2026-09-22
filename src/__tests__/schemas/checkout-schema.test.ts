import { checkoutSchema } from "@/schemas/checkout-schema";

const validCheckout = {
  fullName: "Ankit Kumar",
  phone: "9876543210",
  email: "test@example.com",
  address: "123 Main Street",
  city: "Noida",
  state: "Uttar Pradesh",
  pincode: "201301",
  paymentMethod: "cod" as const,
};

describe("checkout schema", () => {
  it("accepts valid checkout data", () => {
    const result = checkoutSchema.safeParse(validCheckout);
    expect(result.success).toBe(true);
  });

  it("accepts razorpay as a payment method", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckout,
      paymentMethod: "razorpay",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, fullName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid phone numbers", () => {
    expect(
      checkoutSchema.safeParse({ ...validCheckout, phone: "123" }).success
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...validCheckout, phone: "abcdefghij" }).success
    ).toBe(false);
  });

  it("rejects invalid emails", () => {
    expect(
      checkoutSchema.safeParse({ ...validCheckout, email: "hello" }).success
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...validCheckout, email: "hello@" }).success
    ).toBe(false);
  });

  it("rejects invalid pincodes", () => {
    expect(
      checkoutSchema.safeParse({ ...validCheckout, pincode: "123" }).success
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...validCheckout, pincode: "1234567" }).success
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...validCheckout, pincode: "abcdef" }).success
    ).toBe(false);
  });

  it("rejects missing address, city, and state", () => {
    expect(
      checkoutSchema.safeParse({ ...validCheckout, address: "ab" }).success
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...validCheckout, city: "" }).success
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...validCheckout, state: "" }).success
    ).toBe(false);
  });

  it("rejects an invalid payment method", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckout,
      paymentMethod: "bitcoin",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing payment method", () => {
    const { paymentMethod: _ignored, ...rest } = validCheckout;
    const result = checkoutSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});
