// Playwright Automated Test Cases for Login & Organization Selection Flow
// Note: Update selectors (data-testid, ids, labels) based on your actual application.

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://airth.io';

// Utility function for login
async function login(page, email, password) {
  await page.goto('https://airth-core-ui.dev.airth.io/signin');
  await page.fill("//input['@id='userLogin_email']", 'email');
  await page.fill("[//input[@id='password']", 'password');
  await page.click("//button['normalize-space()='Sign in']");
}

// ---------------------- TEST SUITE START --------------------------

test.describe('Login Page Tests', () => {

  test('Verify that user is able to launch the Airth.io URL', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveURL('https://airth-core-ui.dev.airth.io/signin');
  });

  test('Login with valid email and valid password', async ({ page }) => {
    await login(page, 'shivarj.airth@email.com', 'Airth.1234');
    await expect(page).toHaveURL('https://airth-core-ui.dev.airth.io/signin');
  });

  test('Login with invalid email and valid password', async ({ page }) => {
    await login(page, 'invalid@mail.com', 'ValidPass@123');
    await expect(page.locator('[data-testid="error-msg"]')).toBeVisible();
  });

  test('Login with valid email and invalid password', async ({ page }) => {
    await login(page, 'valid@email.com', 'wrongPass');
    await expect(page.locator('[data-testid="error-msg"]')).toBeVisible();
  });

  test('Login with blank email and password fields', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
  });

  test('Forgot Password link navigation', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Forgot Password');
    await expect(page).toHaveURL(/forgot-password/);
  });

  test('Sign up link navigation', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Sign up');
    await expect(page).toHaveURL(/register/);
  });

  test('Check placeholder text in email and password fields', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('[data-testid="email-input"]')).toHaveAttribute('placeholder', 'Enter your email');
    await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('placeholder', 'Enter your password');
  });

  test('Password masking check', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('type', 'password');
  });

  test('Sign-in button enablement', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('[data-testid="login-button"]')).toBeDisabled();
    await page.fill('[data-testid="email-input"]', 'a@a.com');
    await page.fill('[data-testid="password-input"]', 'Test@123');
    await expect(page.locator('[data-testid="login-button"]')).toBeEnabled();
  });

  test('Invalid email format', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('[data-testid="email-input"]', 'abc@xyz');
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
  });
});

// ================== ORGANIZATION SELECTION TESTS ==================

test.describe('Organization Selection Tests', () => {

  test('Verify that org selection page loads after login (multi-org)', async ({ page }) => {
    await login(page, 'multi@org.com', 'ValidPass@123');
    await expect(page).toHaveURL(/organization-selection/);
    await expect(page.locator('[data-testid="org-dropdown"]')).toBeVisible();
  });

  test('Verify email displayed correctly on org page', async ({ page }) => {
    await login(page, 'multi@org.com', 'ValidPass@123');
    await expect(page.locator('[data-testid="email-display"]')).toHaveText('multi@org.com');
  });

  test('Verify selecting an organization', async ({ page }) => {
    await login(page, 'multi@org.com', 'ValidPass@123');
    await page.click('[data-testid="org-dropdown"]');
    await page.click('text=Organization 1');
    await expect(page.locator('[data-testid="org-dropdown"]')).toHaveText(/Organization 1/);
  });

  test('Click continue without selecting organization', async ({ page }) => {
    await login(page, 'multi@org.com', 'ValidPass@123');
    await page.click('[data-testid="continue-button"]');
    await expect(page.locator('[data-testid="org-error"]')).toBeVisible();
  });

  test('Continue after selecting organization', async ({ page }) => {
    await login(page, 'multi@org.com', 'ValidPass@123');
    await page.click('[data-testid="org-dropdown"]');
    await page.click('text=Org A');
    await page.click('[data-testid="continue-button"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Single org user skips org selection page', async ({ page }) => {
    await login(page, 'single@org.com', 'ValidPass@123');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Org list large dataset performance', async ({ page }) => {
    await login(page, 'multi@org.com', 'ValidPass@123');
    await page.click('[data-testid="org-dropdown"]');
    const options = await page.locator('[data-testid="org-option"]').all();
    expect(options.length).toBeGreaterThan(100);
  });
});
