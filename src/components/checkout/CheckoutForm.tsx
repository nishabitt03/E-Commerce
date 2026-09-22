"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddressForm } from "@/components/checkout/AddressForm";
import { ContactInformation } from "@/components/checkout/ContactInformation";
import { CheckoutOrderSummary } from "@/components/checkout/OrderSummary";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import {
  RazorpayCheckout,
  type RazorpaySuccessPayload,
} from "@/components/checkout/RazorpayCheckout";
import { trackEvent } from "@/lib/analytics/analytics";
import { processPayment } from "@/lib/payment/payment-service";
import type { CreatePaymentOrderResponse } from "@/lib/payment/payment-types";
import { calculateCartTotals } from "@/lib/utils/cart";
import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/schemas/checkout-schema";
import { useCartStore } from "@/store/cart-store";
import { persistVerifiedOrder, useOrderStore } from "@/store/order-store";
import type { Order } from "@/types/order";

interface CheckoutFormProps {
  onSuccess: (order: Order) => void;
}

export function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const createOrder = useOrderStore((state) => state.createOrder);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [gatewayOrder, setGatewayOrder] =
    useState<CreatePaymentOrderResponse | null>(null);
  const [checkoutCustomer, setCheckoutCustomer] = useState<{
    name: string;
    email: string;
    contact: string;
  } | null>(null);
  const [verifying, setVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "cod",
    },
  });

  const totals = calculateCartTotals(items);
  const busy = isSubmitting || verifying;
  const paymentMethod = watch("paymentMethod");

  function finalizeOrder(order: Order) {
    trackEvent("purchase", {
      orderId: order.id,
      total: order.total,
      paymentMethod: order.paymentMethod,
    });
    clearCart();
    setGatewayOrder(null);
    setCheckoutCustomer(null);
    onSuccess(order);
  }

  async function onSubmit(data: CheckoutFormData) {
    setPaymentError(null);
    setGatewayOrder(null);

    if (items.length === 0) {
      setPaymentError("Your cart is empty.");
      return;
    }

    const shippingAddress = {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    };

    try {
      if (data.paymentMethod === "cod") {
        const payment = await processPayment({
          amount: totals.total,
          paymentMethod: "cod",
        });

        if (!payment.success) {
          setPaymentError(payment.message);
          return;
        }

        const order = createOrder({
          items: [...items],
          totals,
          paymentMethod: "cod",
          paymentStatus: "pending",
          transactionId: payment.transactionId,
          shippingAddress,
        });

        finalizeOrder(order);
        return;
      }

      trackEvent("payment_initiated", {
        total: totals.total,
        itemCount: totals.itemCount,
      });

      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          claimedTotal: totals.total,
          currency: "INR",
          shippingAddress,
        }),
      });

      const payload = (await response.json()) as CreatePaymentOrderResponse & {
        error?: string;
      };

      if (!response.ok) {
        trackEvent("payment_failed", {
          reason: payload.error ?? "create_order_failed",
        });
        setPaymentError(
          payload.error ??
            "Payment could not be completed. Your cart has been preserved. Please try again."
        );
        return;
      }

      setCheckoutCustomer({
        name: data.fullName,
        email: data.email,
        contact: data.phone,
      });
      setGatewayOrder(payload);
    } catch {
      trackEvent("payment_failed", { reason: "network_error" });
      setPaymentError(
        "Payment could not be completed. Your cart has been preserved. Please try again."
      );
    }
  }

  async function handleGatewaySuccess(payload: RazorpaySuccessPayload) {
    setVerifying(true);
    setPaymentError(null);

    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
        order?: Order;
      };

      if (!response.ok || !result.order) {
        trackEvent("payment_failed", {
          reason: result.error ?? "verification_failed",
        });
        setPaymentError(
          result.error ??
            "Payment could not be completed. Your cart has been preserved. Please try again."
        );
        setGatewayOrder(null);
        return;
      }

      trackEvent("payment_success", {
        orderId: result.order.id,
        total: result.order.total,
      });

      const order = persistVerifiedOrder({
        ...result.order,
        status: "Processing",
      });

      finalizeOrder(order);
    } catch {
      trackEvent("payment_failed", { reason: "verify_network_error" });
      setPaymentError(
        "Payment could not be completed. Your cart has been preserved. Please try again."
      );
      setGatewayOrder(null);
    } finally {
      setVerifying(false);
    }
  }

  function handleGatewayFailure(message: string) {
    trackEvent("payment_failed", { reason: "checkout_failed" });
    setPaymentError(message);
    setGatewayOrder(null);
  }

  function handleGatewayDismiss() {
    setPaymentError(
      "Payment was cancelled. Your cart has been preserved. You can try again."
    );
    setGatewayOrder(null);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]"
      noValidate
    >
      <div className="space-y-5">
        <ContactInformation register={register} errors={errors} />
        <AddressForm register={register} errors={errors} />
        <PaymentMethodSelector
          register={register}
          watch={watch}
          errors={errors}
        />

        {paymentError ? (
          <div
            className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
            role="alert"
          >
            <p className="font-semibold">Payment failed</p>
            <p className="mt-1">{paymentError}</p>
            <p className="mt-2 text-foreground">
              Your cart is still intact. Please try again when you are ready.
            </p>
          </div>
        ) : null}

        {gatewayOrder && checkoutCustomer ? (
          <div className="space-y-3 rounded-md border border-border bg-accent-soft/40 p-4">
            <p className="text-sm text-foreground">
              Payment order ready for ₹{gatewayOrder.totals.total}. Complete
              checkout to verify payment on the server.
            </p>
            <RazorpayCheckout
              order={gatewayOrder}
              customer={checkoutCustomer}
              onSuccess={(payload) => void handleGatewaySuccess(payload)}
              onFailure={handleGatewayFailure}
              onDismiss={handleGatewayDismiss}
            />
            <button
              type="button"
              className="btn btn-ghost text-sm"
              onClick={() => {
                setGatewayOrder(null);
                setCheckoutCustomer(null);
              }}
            >
              Cancel and edit details
            </button>
          </div>
        ) : (
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto"
            disabled={busy}
            aria-busy={busy}
          >
            {busy
              ? "Processing..."
              : paymentMethod === "razorpay"
                ? "Continue to Payment"
                : "Place Order"}
          </button>
        )}
      </div>

      <CheckoutOrderSummary items={items} totals={totals} />
    </form>
  );
}
