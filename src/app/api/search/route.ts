import { NextRequest, NextResponse } from "next/server";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { searchProducts } from "@/lib/api/products";
import type { ProductSort } from "@/types/product";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const query = params.get("q")?.trim() ?? "";

    if (!query) {
      throw new ApiError(400, "Search query is required", "MISSING_QUERY");
    }

    const result = await searchProducts(query, {
      category: params.get("category") ?? undefined,
      brand: params.get("brand") ?? undefined,
      sort: (params.get("sort") as ProductSort | null) ?? "featured",
      page: Number(params.get("page") ?? 1) || 1,
      pageSize: Number(params.get("pageSize") ?? 9) || 9,
    });

    return NextResponse.json(result);
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
