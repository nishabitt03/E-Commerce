import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuantitySelector } from "@/components/product/QuantitySelector";

describe("QuantitySelector", () => {
  it("increases and decreases within bounds", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    const { rerender } = render(
      <QuantitySelector value={1} max={3} onChange={onChange} />
    );

    expect(
      screen.getByRole("button", { name: /decrease quantity/i })
    ).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /increase quantity/i }));
    expect(onChange).toHaveBeenCalledWith(2);

    rerender(<QuantitySelector value={3} max={3} onChange={onChange} />);
    expect(
      screen.getByRole("button", { name: /increase quantity/i })
    ).toBeDisabled();
  });
});
