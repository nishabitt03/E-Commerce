import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SkinConcernSelector } from "@/components/recommendation/SkinConcernSelector";

describe("SkinConcernSelector", () => {
  it("selects a skin concern and notifies the parent", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();

    render(<SkinConcernSelector selected={null} onSelect={onSelect} />);

    await user.click(screen.getByRole("radio", { name: /acne/i }));
    expect(onSelect).toHaveBeenCalledWith("acne");
  });

  it("marks the selected concern as checked", () => {
    render(<SkinConcernSelector selected="dryness" onSelect={jest.fn()} />);
    expect(screen.getByRole("radio", { name: /dryness/i })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });
});
