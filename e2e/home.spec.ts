import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads key sections and navigates to products", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /skin that feels calm, clear, and ready for the day/i,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /best sellers/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /what's your skin concern/i })
    ).toBeVisible();

    await page.getByRole("navigation", { name: /primary/i }).getByRole("link", { name: /shop/i }).click();
    await expect(page).toHaveURL(/\/products/);
  });
});
