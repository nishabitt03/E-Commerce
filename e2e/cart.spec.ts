import { test, expect } from "@playwright/test";

test.describe("Cart", () => {
  test("adds, updates, and removes cart items", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("article").first()).toBeVisible();

    await page
      .locator("article")
      .first()
      .getByRole("button", { name: /add to cart/i })
      .click();

    await expect(page.getByText(/product added to your cart/i)).toBeVisible();

    await page.goto("/cart");
    await expect(page.getByText(/loading cart/i)).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^your cart$/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /increase quantity/i })).toBeVisible();

    await page.getByRole("button", { name: /increase quantity/i }).first().click();
    await expect(
      page.getByRole("group", { name: /quantity for/i }).locator("span")
    ).toHaveText("2");

    await page.getByRole("button", { name: /remove .+ from cart/i }).first().click();
    await expect(
      page.getByRole("heading", { name: /your cart is empty/i })
    ).toBeVisible();
  });
});
