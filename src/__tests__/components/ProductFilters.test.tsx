import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductFilters } from "@/components/product/ProductFilters";

const push = jest.fn();
const searchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => searchParams,
}));

describe("ProductFilters", () => {
  beforeEach(() => {
    push.mockClear();
    Array.from(searchParams.keys()).forEach((key) => searchParams.delete(key));
  });

  it("updates the URL when a category is selected", async () => {
    const user = userEvent.setup();
    render(<ProductFilters />);

    await user.click(screen.getByRole("radio", { name: /serum/i }));

    expect(push).toHaveBeenCalledWith(
      expect.stringMatching(/\/products\?.*category=serum/)
    );
    expect(push).toHaveBeenCalledWith(expect.stringMatching(/page=1/));
  });

  it("updates the URL when a brand is selected", async () => {
    const user = userEvent.setup();
    render(<ProductFilters />);

    await user.click(screen.getByRole("radio", { name: /lumina lab/i }));

    expect(push).toHaveBeenCalledWith(
      expect.stringMatching(/\/products\?.*brand=Lumina(\+|%20| )Lab/)
    );
  });
});
