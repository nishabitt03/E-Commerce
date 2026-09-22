import { test, expect } from "@playwright/test";

test.describe("Search", () => {
  test("submits a search and shows matching results", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("banner")).toBeVisible();

    const search = page.locator('form[role="search"]').first();
    await search.getByLabel(/search products/i).fill("serum");
    await search.getByRole("button", { name: /submit search/i }).click();

    await expect(page).toHaveURL(/\/search\?q=serum/);
    await expect(
      page.getByRole("heading", { name: /search results for/i })
    ).toBeVisible();
    await expect(page.locator("article").first()).toBeVisible();
  });

  test("shows an empty state for unmatched queries", async ({ page }) => {
    await page.goto("/search?q=nonexistentproductxyz");

    await expect(
      page.getByRole("heading", { name: /no results for/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /browse all products/i })
    ).toBeVisible();
  });
});
