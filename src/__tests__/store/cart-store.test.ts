import { useCartStore } from "@/store/cart-store";
import {
  sampleProduct,
  sampleProductB,
  sampleVariant,
  sampleVariantLarge,
} from "@/__tests__/fixtures/products";

jest.mock("@/lib/analytics/analytics", () => ({
  trackEvent: jest.fn(),
}));

describe("cart store", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    localStorage.clear();
  });

  it("adds a product to an empty cart", () => {
    const result = useCartStore.getState().addItem({
      product: sampleProduct,
      quantity: 1,
      variant: sampleVariant,
    });

    expect(result.ok).toBe(true);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]?.quantity).toBe(1);
  });

  it("increases quantity when the same product and variant is added again", () => {
    useCartStore.getState().addItem({
      product: sampleProduct,
      quantity: 1,
      variant: sampleVariant,
    });
    useCartStore.getState().addItem({
      product: sampleProduct,
      quantity: 2,
      variant: sampleVariant,
    });

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]?.quantity).toBe(3);
  });

  it("keeps different variants as separate cart lines", () => {
    useCartStore.getState().addItem({
      product: sampleProduct,
      quantity: 1,
      variant: sampleVariant,
    });
    useCartStore.getState().addItem({
      product: sampleProduct,
      quantity: 1,
      variant: sampleVariantLarge,
    });

    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("increases and decreases quantity without going below 1", () => {
    useCartStore.getState().addItem({
      product: sampleProduct,
      quantity: 2,
      variant: sampleVariant,
    });

    useCartStore
      .getState()
      .increaseQuantity(sampleProduct.id, sampleVariant.id);
    expect(useCartStore.getState().items[0]?.quantity).toBe(3);

    useCartStore
      .getState()
      .decreaseQuantity(sampleProduct.id, sampleVariant.id);
    useCartStore
      .getState()
      .decreaseQuantity(sampleProduct.id, sampleVariant.id);
    useCartStore
      .getState()
      .decreaseQuantity(sampleProduct.id, sampleVariant.id);

    expect(useCartStore.getState().items[0]?.quantity).toBe(1);
  });

  it("removes an item and clears the cart", () => {
    useCartStore.getState().addItem({
      product: sampleProduct,
      quantity: 1,
      variant: sampleVariant,
    });
    useCartStore.getState().addItem({
      product: sampleProductB,
      quantity: 1,
      variant: sampleProductB.variants[0],
    });

    useCartStore.getState().removeItem(sampleProduct.id, sampleVariant.id);
    expect(useCartStore.getState().items).toHaveLength(1);

    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("counts total units across products", () => {
    useCartStore.getState().addItem({
      product: sampleProduct,
      quantity: 2,
      variant: sampleVariant,
    });
    useCartStore.getState().addItem({
      product: sampleProductB,
      quantity: 1,
      variant: sampleProductB.variants[0],
    });
    useCartStore.getState().addItem({
      product: sampleProduct,
      quantity: 1,
      variant: sampleVariantLarge,
    });

    expect(useCartStore.getState().getItemCount()).toBe(4);
  });

  it("rejects quantities above stock", () => {
    const result = useCartStore.getState().addItem({
      product: sampleProduct,
      quantity: 20,
      variant: sampleVariant,
    });

    expect(result.ok).toBe(false);
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
