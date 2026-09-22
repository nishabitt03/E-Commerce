import {
  getRecommendedProductsByConcern,
  scoreProductForConcern,
} from "@/lib/recommendations/product-recommendations";
import type { Product } from "@/types/product";
import { sampleProduct, sampleProductB } from "@/__tests__/fixtures/products";

function makeProduct(overrides: Partial<Product>): Product {
  return {
    ...sampleProduct,
    ...overrides,
    concerns: overrides.concerns ?? sampleProduct.concerns,
  };
}

describe("product recommendations", () => {
  const catalog: Product[] = [
    makeProduct({
      id: "acne-high",
      name: "Acne High",
      concerns: ["acne"],
      rating: 4.8,
      reviewCount: 250,
      isBestSeller: true,
    }),
    makeProduct({
      id: "acne-low",
      name: "Acne Low",
      concerns: ["acne"],
      rating: 3.9,
      reviewCount: 10,
      isBestSeller: false,
    }),
    makeProduct({
      id: "dry-only",
      name: "Dry Only",
      concerns: ["dryness"],
      rating: 5,
      reviewCount: 500,
      isBestSeller: true,
    }),
  ];

  it("returns only products matching the selected concern", () => {
    const results = getRecommendedProductsByConcern(catalog, "acne");
    expect(results.every((product) => product.concerns.includes("acne"))).toBe(
      true
    );
    expect(results.some((product) => product.id === "dry-only")).toBe(false);
  });

  it("ranks stronger acne matches ahead of weaker ones", () => {
    const results = getRecommendedProductsByConcern(catalog, "acne");
    expect(results[0]?.id).toBe("acne-high");
    expect(
      scoreProductForConcern(catalog[0]!, "acne")
    ).toBeGreaterThan(scoreProductForConcern(catalog[1]!, "acne"));
  });

  it("limits the number of returned products", () => {
    const results = getRecommendedProductsByConcern(catalog, "acne", 1);
    expect(results).toHaveLength(1);
  });

  it("returns an empty list when nothing matches", () => {
    const results = getRecommendedProductsByConcern(
      [sampleProductB],
      "sun-protection"
    );
    expect(results).toEqual([]);
  });

  it("does not return duplicate products", () => {
    const results = getRecommendedProductsByConcern(catalog, "acne", 10);
    const ids = results.map((product) => product.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("scores non-matching products as zero", () => {
    expect(scoreProductForConcern(sampleProductB, "acne")).toBe(0);
  });
});
