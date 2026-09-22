import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/common/SearchBar";

const push = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("SearchBar", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("navigates to the search page with the query", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.type(screen.getByLabelText(/search products/i), "serum");
    await user.click(screen.getByRole("button", { name: /submit search/i }));

    expect(push).toHaveBeenCalledWith("/search?q=serum");
  });

  it("navigates to search without a query when empty", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.click(screen.getByRole("button", { name: /submit search/i }));
    expect(push).toHaveBeenCalledWith("/search");
  });
});
