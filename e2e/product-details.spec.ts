import { test, expect } from "@playwright/test";

test.describe("Product details", () => {
  test("opens a product page with purchase controls", async ({ page }) => {
    await page.goto("/products");

    const firstCard = page.locator("article").first();
    await firstCard.getByRole("link").first().click();

    await expect(page).toHaveURL(/\/products\//);

    // Primary purchase CTA (related products also expose Add to Cart).
    await expect(
      page.getByRole("button", { name: /^add to cart$/i }).first()
    ).toBeVisible();
    await expect(
      page
        .getByRole("button", { name: /add .+ to wishlist|remove .+ from wishlist/i })
        .first()
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /related products/i })
    ).toBeVisible();
  });
});
