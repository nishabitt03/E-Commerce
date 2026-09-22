import { test, expect } from "@playwright/test";

test.describe("Product discovery", () => {
  test("filters and sorts products with URL parameters", async ({ page }) => {
    await page.goto("/products");

    await expect(
      page.getByRole("heading", { name: /^products$/i })
    ).toBeVisible();

    await page
      .getByRole("complementary", { name: /product filters/i })
      .getByRole("radio", { name: /^serums$/i })
      .click();
    await expect(page).toHaveURL(/category=serum/);

    await page.getByLabel(/sort products/i).selectOption("price-low");
    await expect(page).toHaveURL(/sort=price-low/);

    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();
  });
});
