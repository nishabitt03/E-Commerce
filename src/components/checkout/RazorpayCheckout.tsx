"use client";

import { useCallback, useRef, useState } from "react";
import type { CreatePaymentOrderResponse } from "@/lib/payment/payment-types";

export interface RazorpaySuccessPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutProps {
  order: CreatePaymentOrderResponse;
  customer: {
    name: string;
    email: string;
    contact: string;
  };
  onSuccess: (payload: RazorpaySuccessPayload) => void;
  onFailure: (message: string) => void;
  onDismiss: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

let razorpayScriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay requires a browser."));
  }
  if (window.Razorpay) {
    return Promise.resolve();
  }
  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      razorpayScriptPromise = null;
      reject(new Error("Failed to load Razorpay Checkout."));
    };
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

/**
 * Opens Razorpay Checkout (live Test Mode) or a local mock checkout when the
 * server returns provider: "mock" (CI / missing credentials).
 */
export function RazorpayCheckout({
  order,
  customer,
  onSuccess,
  onFailure,
  onDismiss,
}: RazorpayCheckoutProps) {
  const [opening, setOpening] = useState(false);
  const started = useRef(false);

  const openMockCheckout = useCallback(() => {
    // Deterministic mock UI for automated tests and local demos without keys.
    const root = document.createElement("div");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Mock Razorpay checkout");
    root.className =
      "fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 p-4";
    root.innerHTML = `
      <div class="w-full max-w-md rounded-lg bg-surface p-6 shadow-lg">
        <h2 class="font-sans text-lg font-semibold text-foreground">Mock Razorpay Checkout</h2>
        <p class="mt-2 text-sm text-muted">
          Test Mode simulation — amount ₹${(order.amountPaise / 100).toFixed(0)}.
          No real payment is processed.
        </p>
        <div class="mt-5 flex flex-wrap gap-3">
          <button type="button" data-action="success" class="btn btn-primary">Simulate Success</button>
          <button type="button" data-action="fail" class="btn btn-secondary">Simulate Failure</button>
          <button type="button" data-action="cancel" class="btn btn-ghost">Cancel</button>
        </div>
      </div>
    `;

    const cleanup = () => root.remove();

    root.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const action = target.getAttribute("data-action");
      if (!action) return;

      cleanup();
      if (action === "success") {
        const paymentId = `pay_mock_${Date.now().toString(36)}`;
        void (async () => {
          try {
            const response = await fetch("/api/payments/mock-sign", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: order.razorpayOrderId,
                razorpay_payment_id: paymentId,
              }),
            });
            const data = (await response.json()) as { signature?: string; error?: string };
            if (!response.ok || !data.signature) {
              onFailure(
                data.error ??
                  "Payment could not be completed. Your cart has been preserved. Please try again."
              );
              return;
            }
            onSuccess({
              razorpay_order_id: order.razorpayOrderId,
              razorpay_payment_id: paymentId,
              razorpay_signature: data.signature,
            });
          } catch {
            onFailure(
              "Payment could not be completed. Your cart has been preserved. Please try again."
            );
          }
        })();
        return;
      }
      if (action === "fail") {
        onFailure(
          "Payment could not be completed. Your cart has been preserved. Please try again."
        );
        return;
      }
      onDismiss();
    });

    document.body.appendChild(root);
  }, [onDismiss, onFailure, onSuccess, order.amountPaise, order.razorpayOrderId]);

  const open = useCallback(async () => {
    if (started.current || opening) return;
    started.current = true;
    setOpening(true);

    try {
      if (order.provider === "mock") {
        openMockCheckout();
        return;
      }

      await loadRazorpayScript();
      if (!window.Razorpay) {
        throw new Error("Razorpay Checkout is unavailable.");
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency,
        name: "Lumina Skin",
        description: "Order payment (Test Mode)",
        order_id: order.razorpayOrderId,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.contact,
        },
        theme: { color: "#1f4d3a" },
        handler: (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          onSuccess({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => {
            onDismiss();
          },
        },
      });

      rzp.on("payment.failed", () => {
        onFailure(
          "Payment could not be completed. Your cart has been preserved. Please try again."
        );
      });

      rzp.open();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to open payment checkout.";
      onFailure(message);
    } finally {
      setOpening(false);
      started.current = false;
    }
  }, [
    customer.contact,
    customer.email,
    customer.name,
    onDismiss,
    onFailure,
    onSuccess,
    openMockCheckout,
    opening,
    order,
  ]);

  return (
    <button
      type="button"
      className="btn btn-primary w-full sm:w-auto"
      onClick={() => void open()}
      disabled={opening}
      aria-busy={opening}
    >
      {opening ? "Opening checkout..." : "Pay with Razorpay"}
    </button>
  );
}
