import { calculateCartTotals, isSameCartItem } from "@/lib/utils/cart";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

describe("cart utilities", () => {
  it("identifies cart items by product and variant", () => {
    const item: Pick<CartItem, "productId" | "variantId"> = {
      productId: "p1",
      variantId: "v1",
    };

    expect(isSameCartItem(item, "p1", "v1")).toBe(true);
    expect(isSameCartItem(item, "p1", "v2")).toBe(false);
    expect(isSameCartItem(item, "p2", "v1")).toBe(false);
  });

  it("treats missing variants as the same default identity", () => {
    expect(isSameCartItem({ productId: "p1" }, "p1")).toBe(true);
    expect(isSameCartItem({ productId: "p1" }, "p1", undefined)).toBe(true);
  });

  it("calculates subtotal, discount, shipping, and item count", () => {
    const items: CartItem[] = [
      {
        productId: "p1",
        slug: "a",
        name: "A",
        brand: "B",
        image: "/a.jpg",
        price: 800,
        originalPrice: 1000,
        quantity: 2,
        maxStock: 10,
      },
      {
        productId: "p2",
        slug: "b",
        name: "B",
        brand: "B",
        image: "/b.jpg",
        price: 500,
        originalPrice: 500,
        quantity: 1,
        maxStock: 5,
      },
    ];

    const totals = calculateCartTotals(items);

    expect(totals.itemCount).toBe(3);
    expect(totals.subtotal).toBe(2100);
    expect(totals.discount).toBe(200);
    expect(totals.shipping).toBe(0);
    expect(totals.total).toBe(1900);
  });

  it("applies shipping when discounted total is below free threshold", () => {
    const items: CartItem[] = [
      {
        productId: "p1",
        slug: "a",
        name: "A",
        brand: "B",
        image: "/a.jpg",
        price: 400,
        originalPrice: 400,
        quantity: 1,
        maxStock: 5,
      },
    ];

    const totals = calculateCartTotals(items);
    expect(totals.subtotal).toBe(400);
    expect(totals.discount).toBe(0);
    expect(totals.shipping).toBe(49);
    expect(totals.total).toBe(449);
  });
});

describe("currency helpers", () => {
  it("formats INR prices", () => {
    const formatted = formatPrice(799);
    expect(formatted).toContain("799");
    expect(formatted).toMatch(/₹|INR|Rs/);
  });

  it("calculates discount percentage from original and sale price", () => {
    expect(calculateDiscount(1000, 800)).toBe(20);
    expect(calculateDiscount(500, 500)).toBe(0);
    expect(calculateDiscount(0, 100)).toBe(0);
  });
});
