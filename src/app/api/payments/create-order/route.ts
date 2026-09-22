import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createPaymentOrder,
  TrustedCartError,
} from "@/lib/payment/payment-service";

const bodySchema = z.object({
  lines: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().optional(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  claimedTotal: z.number().positive(),
  currency: z.literal("INR"),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    email: z.string().email(),
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().regex(/^[1-9][0-9]{5}$/),
  }),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payment order request." },
        { status: 400 }
      );
    }

    const order = await createPaymentOrder(parsed.data);
    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof TrustedCartError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("[create-order]", error);
    return NextResponse.json(
      { error: "Unable to create payment order. Please try again." },
      { status: 500 }
    );
  }
}
