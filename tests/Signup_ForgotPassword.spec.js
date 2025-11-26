const { test, expect } = require('@playwright/test');

test('Signup -> Forgot Password -> Fill Form and Submit', async ({ page }) => {
  const baseUrl = 'https://airth-core-ui.dev.airth.io';
  const signupUrl = `${baseUrl}/signup`;
  const resetUrl = `${baseUrl}/reset-password`;

  // Step 1: Open signup page
  await page.goto(signupUrl, { waitUntil: 'domcontentloaded' });
  
  // Wait for signup page to load (check if we're on signup page)
  // If redirected to signin, navigate to signin first then click signup
  if (!page.url().includes('/signup')) {
    await page.goto(`${baseUrl}/signin`, { waitUntil: 'domcontentloaded' });
    
    // Try to click "Sign up" link
    const signUpLink = page.locator('text=Sign up').first();
    if (await signUpLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await signUpLink.click();
      await page.waitForURL(/signup/, { timeout: 5000 }).catch(() => {});
    } else {
      // Fallback: navigate directly to signup
      await page.goto(signupUrl, { waitUntil: 'domcontentloaded' });
    }
  }

  // Step 2: Navigate to signin page to access "Forgot Password" link
  await page.goto(`${baseUrl}/signin`, { waitUntil: 'domcontentloaded' });

  // Step 3: Click on "Forgot Password"
  const forgotPasswordLink = page.locator('text=Forgot Password').first();
  
  // Wait for the link to be visible
  await forgotPasswordLink.waitFor({ state: 'visible', timeout: 10000 });
  await forgotPasswordLink.click();

  // Wait for navigation to reset password page
  await page.waitForURL(/reset-password/, { timeout: 10000 }).catch(() => {
    // If URL doesn't change, try navigating directly
    page.goto(resetUrl, { waitUntil: 'domcontentloaded' });
    console.log("test")
  });

  // Step 4: Wait for the reset password form to load
  await page.waitForLoadState('domcontentloaded');

  // Step 5: Fill all fields on the forgot password page
  // Find and fill email field
  const emailSelectors = [
    'input#basic_email',
    '#basic_email',
    'input[name="email"]',
    'input[type="email"]',
    '#userLogin_email'
  ];

  let emailField = null;
  for (const selector of emailSelectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible({ timeout: 2000 }).catch(() => false)) {
      emailField = locator;
      break;
    }
  }

  if (!emailField) {
    throw new Error('Email field not found on reset password page');
  }

  await emailField.fill('shivaraj.airth@gmail.com');

  // Step 6: Submit the form (click the submit button)
  const submitButtonSelectors = [
    'button:has-text("Send Password Reset Email")',
    'button:has-text("Send Password Reset")',
    'button[type="submit"]',
    'button:has-text("Submit")',
    'text=Send Password Reset Email'
  ];

  let submitButton = null;
  for (const selector of submitButtonSelectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible({ timeout: 2000 }).catch(() => false)) {
      submitButton = locator;
      break;
    }
  }

  if (!submitButton) {
    throw new Error('Submit button not found on reset password page');
  }

  await submitButton.click();

  // Step 7: Wait for form submission (wait for success message or navigation)
  // You can add assertions here if needed
  await page.waitForTimeout(2000); // Wait for any async operations

  // Optional: Verify success message or confirmation
  // await expect(page.locator('text=Password reset email sent')).toBeVisible({ timeout: 5000 });

  console.log('Test completed: Signup -> Forgot Password -> Form filled and submitted');
});



