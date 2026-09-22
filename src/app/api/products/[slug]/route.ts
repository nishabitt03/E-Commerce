import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api/errors";
import { getProductBySlug } from "@/lib/api/products";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const product = await getProductBySlug(slug);
    return NextResponse.json(product);
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
