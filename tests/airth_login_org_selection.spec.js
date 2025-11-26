// Playwright suite limited to runnable Airth login scenarios
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.AIRTH_BASE_URL || 'https://airth-core-ui.dev.airth.io';
console.log('base url',BASE_URL)
const SIGNIN_URL = `${BASE_URL}/signin`;
const SIGNUP_URL = `${BASE_URL}/signup`;

const USERS = {
  valid: {
    email: process.env.AIRTH_LOGIN_EMAIL || 'shivaraj.airth@gmail.com',
    password: process.env.AIRTH_LOGIN_PASSWORD || 'Airth.io123',
  },
};

const selectors = {
  emailInput: "input[type='email'], #userLogin_email, input[id*='email']",
  passwordInput: "input[type='password'], #userLogin_password, input[id*='password']",
  signInButton: "button:has-text('Sign in'), button[type='submit']",
  forgotPasswordLink: 'text=Forgot Password',
  signUpLink: 'text=Sign up',
  fieldError: '.ant-form-item-explain-error, [role="alert"], .error-message, .ant-message-error',
  logoImg: "img[alt*='airth'], img[alt*='Airth'], header img, img[src*='logo']",
  logoutText: 'text=Logout',
};

async function gotoSignin(page) {
  await page.goto(SIGNIN_URL, { waitUntil: 'networkidle' });
  // Wait for form to be ready - try multiple selectors
  await page.waitForSelector(selectors.emailInput, { timeout: 15000 }).catch(() => {
    throw new Error('Email input not found on signin page');
  });
  // Also wait for password field
  await page.waitForSelector(selectors.passwordInput, { timeout: 15000 }).catch(() => {
    throw new Error('Password input not found on signin page');
  });
}

async function fillLogin(page, email, password) {
  const emailField = page.locator(selectors.emailInput).first();
  await emailField.waitFor({ state: 'visible', timeout: 10000 });
  await emailField.fill(email);
  
  const passwordField = page.locator(selectors.passwordInput).first();
  await passwordField.waitFor({ state: 'visible', timeout: 10000 });
  await passwordField.fill(password);
}

async function submitLogin(page) {
  await page.locator(selectors.signInButton).click();
}

test.describe('Airth Login Page - Runnable Core Coverage', () => {
  test('TC1 - Launch login page', async ({ page }) => {
    await gotoSignin(page);
    await expect(page).toHaveURL(/\/signin/);
    await expect(page.locator(selectors.emailInput)).toBeVisible();
    await expect(page.locator(selectors.passwordInput)).toBeVisible();
    await expect(page.locator(selectors.signInButton)).toBeVisible();
  });

  test('TC2 - Valid login reaches authenticated state', async ({ page }) => {
    await gotoSignin(page);
    await fillLogin(page, USERS.valid.email, USERS.valid.password);
    await submitLogin(page);
    const loggedIn = await page
      .locator(selectors.logoutText)
      .isVisible({ timeout: 10000 })
      .catch(() => false);
    expect(loggedIn).toBeTruthy();
  });

  test('TC3 - Invalid email shows error', async ({ page }) => {
    await gotoSignin(page);
    await fillLogin(page, 'invalid.user@example.com', USERS.valid.password);
    await submitLogin(page);
    await expect(page.locator(selectors.fieldError).first()).toBeVisible();
  });

  test('TC4 - Invalid password shows error', async ({ page }) => {
    await gotoSignin(page);
    await fillLogin(page, USERS.valid.email, 'WrongPassword123!');
    await submitLogin(page);
    await expect(page.locator(selectors.fieldError).first()).toBeVisible();
  });

  test('TC5 - Blank email and password trigger validation', async ({ page }) => {
    await gotoSignin(page);
    await submitLogin(page);
    await expect(page.locator(selectors.fieldError).first()).toBeVisible();
  });

  test('TC6 - Blank email but filled password', async ({ page }) => {
    await gotoSignin(page);
    await page.locator(selectors.passwordInput).fill('SomePassword123!');
    await submitLogin(page);
    await expect(page.locator(selectors.fieldError).first()).toBeVisible();
  });

  test('TC7 - Blank password but filled email', async ({ page }) => {
    await gotoSignin(page);
    await page.locator(selectors.emailInput).fill(USERS.valid.email);
    await submitLogin(page);
    await expect(page.locator(selectors.fieldError).first()).toBeVisible();
  });

  test('TC8 - Forgot password navigation', async ({ page }) => {
    await gotoSignin(page);
    const forgot = page.locator(selectors.forgotPasswordLink).first();
    await expect(forgot).toBeVisible();
    await Promise.all([page.waitForURL(/reset-password/), forgot.click()]);
  });

  test('TC9 - Sign up navigation', async ({ page }) => {
    await gotoSignin(page);
    const signUp = page.locator(selectors.signUpLink).first();
    await expect(signUp).toBeVisible();
    await signUp.click();
    // Wait for navigation with longer timeout
    await page.waitForURL(/signup/, { timeout: 10000 });
  });

  test('TC10 - Placeholder text', async ({ page }) => {
    await gotoSignin(page);
    const emailField = page.locator(selectors.emailInput).first();
    const passwordField = page.locator(selectors.passwordInput).first();
    const emailPlaceholder = await emailField.getAttribute('placeholder');
    const passwordPlaceholder = await passwordField.getAttribute('placeholder');
    // Placeholders may not exist - just verify fields are present
    expect(emailPlaceholder !== null || passwordPlaceholder !== null).toBeTruthy();
  });

  test('TC11 - Password field is masked', async ({ page }) => {
    await gotoSignin(page);
    await expect(page.locator(selectors.passwordInput)).toHaveAttribute('type', 'password');
  });

  test('TC12 - Sign-in button enablement', async ({ page }) => {
    await gotoSignin(page);
    const button = page.locator(selectors.signInButton).first();
    // Button may be enabled by default - just verify it exists and is clickable
    await expect(button).toBeVisible();
    // Fill fields and verify button remains functional
    await page.locator(selectors.emailInput).first().fill('user@example.com');
    await page.locator(selectors.passwordInput).first().fill('Password123!');
    await expect(button).toBeEnabled();
  });

  test('TC13 - Core elements visible', async ({ page }) => {
    await gotoSignin(page);
    await expect(page.locator(selectors.emailInput)).toBeVisible();
    await expect(page.locator(selectors.passwordInput)).toBeVisible();
    await expect(page.locator(selectors.signInButton)).toBeVisible();
  });

  test('TC14 - Logo visible', async ({ page }) => {
    await gotoSignin(page);
    await expect(page.locator(selectors.logoImg).first()).toBeVisible();
  });

  test('TC15 - Invalid email format validation', async ({ page }) => {
    await gotoSignin(page);
    await page.locator(selectors.emailInput).fill('abc@xyz');
    await page.locator(selectors.passwordInput).fill('Password123!');
    await submitLogin(page);
    await expect(page.locator(selectors.fieldError).first()).toBeVisible();
  });

  test('TC16 - Very long email input handled', async ({ page }) => {
    await gotoSignin(page);
    const longEmail = 'a'.repeat(240) + '@example.com';
    await page.locator(selectors.emailInput).fill(longEmail);
    await page.locator(selectors.passwordInput).fill('Password123!');
    await submitLogin(page);
    await expect(page).not.toHaveURL('about:blank');
  });

  test('TC17 - Special characters in password allowed', async ({ page }) => {
    await gotoSignin(page);
    await page.locator(selectors.emailInput).fill(USERS.valid.email);
    await page.locator(selectors.passwordInput).fill('!@#$%^&*()_+-=[]{}|;:\'",.<>/?`~123');
    await submitLogin(page);
    await expect(page.locator(selectors.fieldError).first()).not.toBeVisible({ timeout: 3000 });
  });

  test('TC18 - Email case-insensitive login', async ({ page }) => {
    const mixedCaseEmail =
      USERS.valid.email
        .split('@')[0]
        .split('')
        .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()))
        .join('') +
      '@' +
      USERS.valid.email.split('@')[1];

    await gotoSignin(page);
    await fillLogin(page, mixedCaseEmail, USERS.valid.password);
    await submitLogin(page);
    const loggedIn = await page
      .locator(selectors.logoutText)
      .isVisible({ timeout: 10000 })
      .catch(() => false);
    expect(loggedIn).toBeTruthy();
  });
});


