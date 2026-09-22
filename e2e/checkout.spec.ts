import { test, expect } from "@playwright/test";

async function addFirstProductAndOpenCheckout(
  page: import("@playwright/test").Page
) {
  await page.goto("/products");
  await expect(page.locator("article").first()).toBeVisible();

  await page
    .locator("article")
    .first()
    .getByRole("button", { name: /add to cart/i })
    .click();
  await expect(page.getByText(/product added to your cart/i)).toBeVisible();

  await page.goto("/checkout");
  await expect(page.getByText(/loading checkout/i)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /^checkout$/i })).toBeVisible();
}

async function fillCheckoutForm(page: import("@playwright/test").Page) {
  await page.getByLabel(/full name/i).fill("Ankit Kumar");
  await page.getByLabel(/^phone$/i).fill("9876543210");
  await page.getByLabel(/^email$/i).fill("test@example.com");
  await page.getByLabel(/^address$/i).fill("123 Main Street");
  await page.getByLabel(/^city$/i).fill("Noida");
  await page.getByLabel(/^state$/i).fill("Uttar Pradesh");
  await page.getByLabel(/^pincode$/i).fill("201301");
}

test.describe("Checkout", () => {
  test("completes a successful COD order", async ({ page }) => {
    await addFirstProductAndOpenCheckout(page);
    await fillCheckoutForm(page);
    await page.getByLabel(/cash on delivery/i).check();
    await page.getByRole("button", { name: /place order/i }).click();

    await expect(
      page.getByRole("heading", { name: /order placed successfully/i })
    ).toBeVisible({ timeout: 15_000 });

    const orderId = await page
      .locator("dd")
      .filter({ hasText: /ORD-/ })
      .first()
      .textContent();
    expect(orderId).toMatch(/ORD-/);

    await page.goto("/cart");
    await expect(page.getByText(/loading cart/i)).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: /your cart is empty/i })
    ).toBeVisible();

    await page.goto("/orders");
    await expect(page.getByText(/loading orders/i)).toHaveCount(0);
    await expect(page.getByText(orderId!.trim())).toBeVisible();
  });
});
