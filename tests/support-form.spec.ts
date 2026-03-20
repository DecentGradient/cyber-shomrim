import { test, expect } from '@playwright/test';

test('Contact form should open, validate, and submit', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  // By default Angular runs on 4200. Playwright might use a different port if configured.
  // We'll use 4200 as standard for Angular apps unless defined otherwise in playwright.config.ts
  await page.goto('http://localhost:4200/');

  // Click the first Get Support Now button
  await page.getByTestId('get-support-btn').first().click();

  // The modal should be visible
  const modal = page.getByTestId('contact-modal');
  await expect(modal).toBeVisible();

  // Fill out the form
  await page.getByTestId('input-name').fill('John Doe');
  await page.getByTestId('input-email').fill('john@example.com');
  await page.getByTestId('input-phone').fill('1234567890');
  await page.getByTestId('input-company').fill('Acme Corp');
  await page.getByTestId('input-message').fill('I need help with a cyber attack.');

  // Intercept the API call to avoid actually sending emails during testing
  await page.route('**/api/sendSupportEmail', async route => {
    const json = { data: { success: true, message: 'Email sent successfully' } };
    await route.fulfill({ json });
  });

  // Submit the form
  await page.getByTestId('submit-btn').click();

  // Expect success message
  const successMsg = page.getByTestId('success-message');
  await expect(successMsg).toBeVisible();

  // Close the modal
  await page.getByTestId('success-close-btn').click();
  
  // The modal overlay should be gone
  const overlay = page.getByTestId('modal-overlay');
  await expect(overlay).not.toBeVisible();
});
