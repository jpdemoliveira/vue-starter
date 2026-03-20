import { test, expect } from "@playwright/test";

// Simple test example for searchBar component.
test.describe("SearchBar", () => {
  test("should initialize input with query param", async ({ page }) => {
    await page.goto("/search?q=climate+change");
    const input = page.getByTestId('search-input').locator('input');

    await expect(input).toBeVisible();
    await expect(input).toHaveValue("climate change");
  });

  test("should emit search on Enter", async ({ page }) => {
    await page.goto("/search");

    const input = page.getByTestId('search-input').locator('input');

    await expect(input).toBeVisible();

    await input.fill("global warming");
    await input.press("Enter");

    await expect(page).toHaveURL(/q=global\+warming/);
  });
});
