import { test, expect } from "@playwright/test";

test.describe("Wishlist", () => {
  test("saves and removes a product from the wishlist", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("article").first()).toBeVisible();

    const firstCard = page.locator("article").first();
    await firstCard.getByRole("button", { name: /add .+ to wishlist/i }).click();

    await page.goto("/wishlist");
    await expect(page.getByText(/loading wishlist/i)).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: /my wishlist/i })
    ).toBeVisible();
    await expect(page.locator("article").first()).toBeVisible();

    await page
      .locator("article")
      .first()
      .getByRole("button", { name: /remove .+ from wishlist/i })
      .click();

    await expect(
      page.getByRole("heading", { name: /your wishlist is empty/i })
    ).toBeVisible();
  });
});
