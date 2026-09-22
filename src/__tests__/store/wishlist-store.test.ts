import { useWishlistStore } from "@/store/wishlist-store";
import { sampleProduct, sampleProductB } from "@/__tests__/fixtures/products";

describe("wishlist store", () => {
  beforeEach(() => {
    useWishlistStore.setState({ items: [] });
    localStorage.clear();
  });

  it("adds a product without duplicating it", () => {
    useWishlistStore.getState().addItem(sampleProduct);
    useWishlistStore.getState().addItem(sampleProduct);

    expect(useWishlistStore.getState().items).toHaveLength(1);
    expect(useWishlistStore.getState().hasItem(sampleProduct.id)).toBe(true);
  });

  it("toggles a product on and off", () => {
    expect(useWishlistStore.getState().toggleItem(sampleProduct)).toBe(true);
    expect(useWishlistStore.getState().hasItem(sampleProduct.id)).toBe(true);

    expect(useWishlistStore.getState().toggleItem(sampleProduct)).toBe(false);
    expect(useWishlistStore.getState().hasItem(sampleProduct.id)).toBe(false);
  });

  it("removes a product and clears the wishlist", () => {
    useWishlistStore.getState().addItem(sampleProduct);
    useWishlistStore.getState().addItem(sampleProductB);

    useWishlistStore.getState().removeItem(sampleProduct.id);
    expect(useWishlistStore.getState().items).toHaveLength(1);

    useWishlistStore.getState().clearWishlist();
    expect(useWishlistStore.getState().items).toHaveLength(0);
  });
});
