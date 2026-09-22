import { NextResponse } from "next/server";
import { z } from "zod";
import { getPaymentSession } from "@/lib/payment/payment-session-store";
import {
  createMockPaymentSignature,
  getPaymentProviderName,
} from "@/lib/payment/razorpay-provider";

const bodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
});

/**
 * Test-only helper: issues a valid HMAC signature for mock checkout.
 * Disabled when PAYMENT_MODE=razorpay / live credentials are active.
 */
export async function POST(request: Request) {
  if (getPaymentProviderName() !== "mock") {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  const json: unknown = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!getPaymentSession(parsed.data.razorpay_order_id)) {
    return NextResponse.json(
      { error: "Payment session not found." },
      { status: 404 }
    );
  }

  const signature = createMockPaymentSignature(
    parsed.data.razorpay_order_id,
    parsed.data.razorpay_payment_id
  );

  return NextResponse.json({ signature });
}
