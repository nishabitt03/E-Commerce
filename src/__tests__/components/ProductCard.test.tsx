import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "@/components/product/ProductCard";
import { sampleProduct } from "@/__tests__/fixtures/products";
import { useCartStore } from "@/store/cart-store";

const trackEvent = jest.fn();

jest.mock("@/lib/analytics/analytics", () => ({
  trackEvent: (...args: unknown[]) => trackEvent(...args),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    alt,
    src,
  }: {
    alt: string;
    src: string;
    fill?: boolean;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} />;
  },
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

describe("ProductCard", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    localStorage.clear();
    trackEvent.mockClear();
  });

  it("renders product identity and price", () => {
    render(<ProductCard product={sampleProduct} />);

    expect(screen.getByText(sampleProduct.name)).toBeInTheDocument();
    expect(screen.getByText(sampleProduct.brand)).toBeInTheDocument();
    expect(screen.getByAltText(sampleProduct.name)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `View ${sampleProduct.name}`,
      })
    ).toHaveAttribute("href", `/products/${sampleProduct.slug}`);
  });

  it("adds the product to the cart", async () => {
    const user = userEvent.setup();
    render(<ProductCard product={sampleProduct} />);

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(trackEvent).toHaveBeenCalledWith(
      "add_to_cart",
      expect.objectContaining({
        productId: sampleProduct.id,
        productName: sampleProduct.name,
      })
    );
  });

  it("disables add to cart when out of stock", () => {
    render(<ProductCard product={{ ...sampleProduct, stock: 0, variants: [] }} />);
    expect(
      screen.getByRole("button", { name: /out of stock/i })
    ).toBeDisabled();
  });
});
