import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api/errors";
import { getOrders } from "@/lib/api/orders";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
