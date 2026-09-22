"use client";

import type {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import type { CheckoutFormData } from "@/schemas/checkout-schema";

interface PaymentMethodSelectorProps {
  register: UseFormRegister<CheckoutFormData>;
  watch: UseFormWatch<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

const METHODS = [
  {
    value: "cod" as const,
    label: "Cash on Delivery",
    description: "Pay when your order is delivered.",
  },
  {
    value: "razorpay" as const,
    label: "Pay Online (Razorpay)",
    description: "Razorpay Test Mode — cards, UPI, and wallets. No real money.",
  },
];

export function PaymentMethodSelector({
  register,
  watch,
  errors,
}: PaymentMethodSelectorProps) {
  const paymentMethod = watch("paymentMethod");

  return (
    <section className="card-surface space-y-4 p-5" aria-labelledby="payment-heading">
      <h2 id="payment-heading" className="font-sans text-lg font-semibold text-foreground">
        Payment Method
      </h2>

      <fieldset>
        <legend className="sr-only">Choose a payment method</legend>
        <div className="space-y-3">
          {METHODS.map((method) => (
            <label
              key={method.value}
              className="flex cursor-pointer gap-3 rounded-md border border-border p-3 has-[:checked]:border-primary has-[:checked]:bg-accent-soft/50"
            >
              <input
                type="radio"
                value={method.value}
                className="mt-1 accent-primary"
                {...register("paymentMethod")}
              />
              <span>
                <span className="block font-medium text-foreground">
                  {method.label}
                </span>
                <span className="mt-0.5 block text-sm text-muted">
                  {method.description}
                </span>
              </span>
            </label>
          ))}
        </div>
        {errors.paymentMethod ? (
          <p className="mt-2 text-sm text-danger" role="alert">
            {errors.paymentMethod.message}
          </p>
        ) : null}
      </fieldset>

      {paymentMethod === "cod" ? (
        <p className="rounded-md bg-accent-soft px-3 py-2 text-sm text-foreground">
          Pay when your order is delivered. No online payment is collected.
        </p>
      ) : null}

      {paymentMethod === "razorpay" ? (
        <div className="space-y-2 rounded-md border border-dashed border-border p-4 text-sm">
          <p className="font-medium text-warning">
            Razorpay Test Mode — no real money is processed.
          </p>
          <p className="text-muted">
            You will complete payment in Razorpay Checkout (or a local mock
            checkout when test keys are not configured). Card numbers and CVV
            are never stored by this application.
          </p>
        </div>
      ) : null}
    </section>
  );
}
