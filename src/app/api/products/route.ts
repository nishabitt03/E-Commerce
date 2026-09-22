import { NextRequest, NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api/errors";
import { getProducts } from "@/lib/api/products";
import type { ProductSort, SkinConcern } from "@/types/product";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const result = await getProducts({
      query: params.get("q") ?? undefined,
      category: params.get("category") ?? undefined,
      brand: params.get("brand") ?? undefined,
      minPrice: parseOptionalNumber(params.get("minPrice")),
      maxPrice: parseOptionalNumber(params.get("maxPrice")),
      minRating: parseOptionalNumber(params.get("minRating")),
      concern: (params.get("concern") as SkinConcern | null) ?? undefined,
      sort: (params.get("sort") as ProductSort | null) ?? "featured",
      page: parseOptionalNumber(params.get("page")) ?? 1,
      pageSize: parseOptionalNumber(params.get("pageSize")) ?? 9,
    });

    return NextResponse.json(result);
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

function parseOptionalNumber(value: string | null): number | undefined {
  if (value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
