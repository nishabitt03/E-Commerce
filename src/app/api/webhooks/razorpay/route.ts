import { NextResponse } from "next/server";
import { processRazorpayWebhook } from "@/lib/payment/webhook-handler";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  const result = processRazorpayWebhook(rawBody, signature);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Webhook rejected." },
      { status: result.status }
    );
  }

  return NextResponse.json({
    ok: true,
    duplicate: result.duplicate ?? false,
  });
}
