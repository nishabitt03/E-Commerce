import type { Product, SkinConcern } from "@/types/product";

export interface ScoredProduct {
  product: Product;
  score: number;
}

/**
 * Rule-based recommendation (not ML / AI).
 *
 * Scoring:
 * - concern match: +5
 * - rating ≥ 4.5: +2
 * - best seller: +1
 * - reviewCount / 100 (capped at +2) for light popularity signal
 */
export function scoreProductForConcern(
  product: Product,
  concern: SkinConcern
): number {
  if (!product.concerns.includes(concern)) return 0;

  let score = 5;

  if (product.rating >= 4.5) score += 2;
  if (product.isBestSeller) score += 1;
  score += Math.min(2, Math.floor(product.reviewCount / 100));

  return score;
}

export function getRecommendedProductsByConcern(
  products: Product[],
  concern: SkinConcern,
  limit = 4
): Product[] {
  return products
    .map((product) => ({
      product,
      score: scoreProductForConcern(product, concern),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.product.rating !== a.product.rating) {
        return b.product.rating - a.product.rating;
      }
      return b.product.reviewCount - a.product.reviewCount;
    })
    .slice(0, limit)
    .map(({ product }) => product);
}
