import { test, expect } from "@playwright/test";

test.describe("Recommendations", () => {
  test("selects a skin concern and opens a recommended product", async ({
    page,
  }) => {
    await page.goto("/");

    await page
      .getByRole("heading", { name: /what's your skin concern/i })
      .scrollIntoViewIfNeeded();

    await page
      .getByRole("radiogroup", { name: /skin concerns/i })
      .getByRole("radio", { name: /^acne/i })
      .click();

    await expect(
      page.getByRole("heading", { name: /recommended for acne/i })
    ).toBeVisible();

    const productLink = page
      .locator("section")
      .filter({
        has: page.getByRole("heading", { name: /what's your skin concern/i }),
      })
      .locator("article a")
      .first();

    await expect(productLink).toBeVisible();
    await productLink.click();

    await expect(page).toHaveURL(/\/products\//);
    await expect(
      page.getByRole("button", { name: /^add to cart$/i }).first()
    ).toBeVisible();
  });
});
