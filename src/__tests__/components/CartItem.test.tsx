import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartItemRow } from "@/components/cart/CartItem";
import { useCartStore } from "@/store/cart-store";
import type { CartItem } from "@/types/cart";

jest.mock("@/lib/analytics/analytics", () => ({
  trackEvent: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const cartItem: CartItem = {
  productId: "p-test-1",
  slug: "test-clarifying-serum",
  name: "Test Clarifying Serum",
  brand: "Lumina Lab",
  image: "https://example.com/a.jpg",
  price: 799,
  originalPrice: 999,
  quantity: 2,
  variantId: "v-test-30",
  variantLabel: "30 ml",
  maxStock: 10,
};

describe("CartItem", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [cartItem] });
    localStorage.clear();
  });

  it("renders item details and updates quantity", async () => {
    const user = userEvent.setup();
    render(<CartItemRow item={cartItem} />);

    expect(screen.getByText(cartItem.name)).toBeInTheDocument();
    expect(screen.getByText("30 ml")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /increase quantity of test clarifying serum/i,
      })
    );

    expect(useCartStore.getState().items[0]?.quantity).toBe(3);
  });

  it("removes the item from the cart", async () => {
    const user = userEvent.setup();
    render(<CartItemRow item={cartItem} />);

    await user.click(
      screen.getByRole("button", {
        name: /remove test clarifying serum from cart/i,
      })
    );

    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
