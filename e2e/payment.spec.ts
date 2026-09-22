import { test, expect } from "@playwright/test";

async function prepareCheckout(page: import("@playwright/test").Page) {
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

  await page.getByLabel(/full name/i).fill("Ankit Kumar");
  await page.getByLabel(/^phone$/i).fill("9876543210");
  await page.getByLabel(/^email$/i).fill("test@example.com");
  await page.getByLabel(/^address$/i).fill("123 Main Street");
  await page.getByLabel(/^city$/i).fill("Noida");
  await page.getByLabel(/^state$/i).fill("Uttar Pradesh");
  await page.getByLabel(/^pincode$/i).fill("201301");
  await page
    .getByRole("heading", { name: /payment method/i })
    .scrollIntoViewIfNeeded();
}

test.describe("Razorpay payment (mock provider)", () => {
  test("creates a payment order and completes mock success verification", async ({
    page,
  }) => {
    await prepareCheckout(page);
    await page.getByRole("radio", { name: /pay online \(razorpay\)/i }).click();
    await page.getByRole("button", { name: /continue to payment/i }).click();

    await expect(
      page.getByRole("button", { name: /pay with razorpay/i })
    ).toBeVisible();

    await page.getByRole("button", { name: /pay with razorpay/i }).click();
    await expect(
      page.getByRole("dialog", { name: /mock razorpay checkout/i })
    ).toBeVisible();

    await page.getByRole("button", { name: /simulate success/i }).click();

    await expect(
      page.getByRole("heading", { name: /order placed successfully/i })
    ).toBeVisible({ timeout: 15_000 });

    await page.goto("/cart");
    await expect(page.getByText(/loading cart/i)).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: /your cart is empty/i })
    ).toBeVisible();
  });

  test("keeps the cart when mock payment fails", async ({ page }) => {
    await prepareCheckout(page);
    await page.getByRole("radio", { name: /pay online \(razorpay\)/i }).click();
    await page.getByRole("button", { name: /continue to payment/i }).click();
    await page.getByRole("button", { name: /pay with razorpay/i }).click();

    await page.getByRole("button", { name: /simulate failure/i }).click();

    await expect(
      page.locator('[role="alert"]').filter({ hasText: /payment failed|could not be completed/i })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: /order placed successfully/i })
    ).toHaveCount(0);

    await page.goto("/cart");
    await expect(page.getByText(/loading cart/i)).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^your cart$/i })).toBeVisible();
  });
});
