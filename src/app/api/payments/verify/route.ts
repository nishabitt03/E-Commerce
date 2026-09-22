import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPayment } from "@/lib/payment/payment-service";

const bodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payment verification request." },
        { status: 400 }
      );
    }

    const result = verifyPayment(parsed.data);

    if (!result.success || !result.order) {
      return NextResponse.json(
        { error: result.message, success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      order: result.order,
    });
  } catch (error) {
    console.error("[verify-payment]", error);
    return NextResponse.json(
      {
        error:
          "Payment could not be completed. Your cart has been preserved. Please try again.",
        success: false,
      },
      { status: 500 }
    );
  }
}
