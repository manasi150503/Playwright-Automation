const { test, expect } = require('@playwright/test');

test('Airth Forgot Password Flow', async ({ page }) => {
    console.log('Starting test...');

    // 1. Go to signin page
    console.log('Navigating to signin page...');
    await page.goto('https://airth-core-ui.dev.airth.io/signin');
    await page.waitForTimeout(5000);

    // Verify we are on the signin page
    await expect(page).toHaveURL(/.*signin/);
    await expect(page.locator('text=Welcome back')).toBeVisible();

    // 2. Click on Forgot Password
    console.log('Clicking Forgot Password...');
    await page.getByText('Forgot Password').click();
    await page.waitForTimeout(5000);

    // 3. Verify we are on the reset password page
    await expect(page).toHaveURL(/.*reset-password/);
    await expect(page.getByRole('button', { name: 'Send Password Reset Email' })).toBeVisible();

    // 4. Fill the email field
    console.log('Filling email...');
    const email = 'shivaraj.airth@gmail.com';
    // Using robust selector for email
    await page.locator('input[type="email"]').fill(email);
    await page.waitForTimeout(5000);

    // 5. Click on send link to email
    console.log('Clicking Send button...');
    await page.getByRole('button', { name: 'Send Password Reset Email' }).click();
    await page.waitForTimeout(5000);

    // 6. Go back to signin page
    console.log('Clicking Go Back...');
    await page.getByRole('button', { name: 'Go Back to Sign In' }).click();
    await page.waitForTimeout(5000);

    // 7. Verify we are back on the signin page
    await expect(page).toHaveURL(/.*signin/);
    console.log('Test completed successfully.');
});
