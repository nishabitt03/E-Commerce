import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WishlistButton } from "@/components/product/WishlistButton";
import { useWishlistStore } from "@/store/wishlist-store";
import { sampleProduct } from "@/__tests__/fixtures/products";

const trackEvent = jest.fn();

jest.mock("@/lib/analytics/analytics", () => ({
  trackEvent: (...args: unknown[]) => trackEvent(...args),
}));

describe("WishlistButton", () => {
  beforeEach(() => {
    useWishlistStore.setState({ items: [] });
    localStorage.clear();
    trackEvent.mockClear();
  });

  it("toggles wishlist state and fires analytics", async () => {
    const user = userEvent.setup();
    render(<WishlistButton product={sampleProduct} />);

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(`add ${sampleProduct.name} to wishlist`, "i"),
      })
    );

    expect(useWishlistStore.getState().hasItem(sampleProduct.id)).toBe(true);
    expect(trackEvent).toHaveBeenCalledWith(
      "wishlist_add",
      expect.objectContaining({ productId: sampleProduct.id })
    );

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(`remove ${sampleProduct.name} from wishlist`, "i"),
      })
    );

    expect(useWishlistStore.getState().hasItem(sampleProduct.id)).toBe(false);
    expect(trackEvent).toHaveBeenCalledWith(
      "wishlist_remove",
      expect.objectContaining({ productId: sampleProduct.id })
    );
  });
});
