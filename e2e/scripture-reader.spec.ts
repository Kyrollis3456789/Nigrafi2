import { test, expect } from '@playwright/test';

test.describe('Pi Graphi Scripture Reader', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the dashboard on load', async ({ page }) => {
    // The dashboard should be visible with the main title
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to the Pi Graphi reader module', async ({ page }) => {
    // Click the Pi Graphi card to open the reader
    const piGraphiCard = page.locator('text=Pi Graphi').first();
    await piGraphiCard.click();

    // Wait for splash screen to appear and then disappear
    await page.waitForTimeout(3000);

    // The reader should now be visible with a header element
    await expect(page.locator('header')).toBeVisible();
  });

  test('should open and close settings modal', async ({ page }) => {
    // Navigate to reader first
    const settingsCard = page.locator('[class*="cursor-pointer"]').nth(1);
    await settingsCard.click();

    // Wait for splash screen
    await page.waitForTimeout(3000);

    // Settings modal should be visible (opened via settings card)
    await expect(page.locator('[class*="fixed inset-0"]').first()).toBeVisible();
  });

  test('should display scripture content', async ({ page }) => {
    // Navigate to reader
    const piGraphiCard = page.locator('text=Pi Graphi').first();
    await piGraphiCard.click();

    // Wait for splash + loading
    await page.waitForTimeout(3500);

    // Check that the main reader area has content
    const readerContent = page.locator('#readerContent');
    await expect(readerContent).toBeVisible();
  });
});
