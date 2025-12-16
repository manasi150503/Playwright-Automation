// // Playwright Test for Airth.io Signup Flow
// const { test, expect } = require('@playwright/test');

// test('Airth Signup Flow - Happy Path', async ({ page }) => {
//     // Set a longer timeout for this specific test
//     test.setTimeout(60000);

//     console.log('Step 1: Navigate to Sign In');
//     await page.goto('https://airth-core-ui.dev.airth.io/signin');
//     // Ensure the page loads; lenient check for URL
//     await expect(page).toHaveURL(/signin|login/i);

//     console.log('Step 2: Navigate to Signup');
//     // Matches "Sign up" or "Sign Up" reliably
//     const signupLink = page.getByText('Sign up').first();
//     await expect(signupLink).toBeVisible({ timeout: 10000 });

//     // Wait for hydration/animation then click
//     await signupLink.click();

//     console.log('Step 3: Wait for Signup Form');
//     // Verify we are on the signup/register page
//     await expect(page).toHaveURL("https://airth-marketplace-ui-v2.dev.airth.io/?mode=register");

//     // Verify the "Create Your Account" heading appea"ring, allowing for variations
//     // Using a broader check for the header or just the form presence if the header is missing
//     const header = page.locator('h1, h2, h3, .ant-typography').filter({ hasText: /Create Your Account|Sign Up|Register/i }).first();
//     await expect(header).toBeVisible({ timeout: 20000 });

//     console.log('Step 4: Fill Personal Details');
//     await page.locator("//input[@id='registerForm_firstName']").click();
//     await page.locator("//input[@id='registerForm_firstName']").fill('Shivaraj');
//     await page.locator("//input[@id='registerForm_lastName']").click();
//     await page.locator("//input[@id='registerForm_lastName']").fill('Nalawade');

//     console.log('Step 5: Select Membership Type');
//     // Open the Ant Design dropdown
//     const dropdownTrigger = page.locator("//input[@id='registerForm_membershipType']").first();
//     await dropdownTrigger.waitFor({ state: 'visible' });
//     await dropdownTrigger.click();

//     // Select "Individual" (from user update)
//     // Note: Ant Design puts options in a portal, often outside the main form structure. 
//     // We look for the option text directly.
//     const membershipOption = page.locator('.ant-select-item-option-content').filter({ hasText: 'Individual' });
//     // Fallback if user wanted to target the search input class for some reason, but targeting the option text is safer for selection
//     await membershipOption.first().waitFor({ state: 'visible' });
//     await membershipOption.first().click();

//     console.log('Step 6: Fill Account Credentials');
//     const uniqueEmail = `shivaraj.airth+${Date.now()}@gmail.com`;
//     console.log(`Using email: ${uniqueEmail}`);
//     await page.locator("//input[@id='registerForm_email']").fill(uniqueEmail);

//     // Use exact match for Password
//     await page.locator("//input[@id='registerForm_password']").fill('Airth.io1234');
//     await page.locator("//input[@id='registerForm_confirmPassword']").fill('Airth.io1234');

//     console.log('Step 7: Register');
//     await page.locator("//button[@type='submit']").click();

//     console.log('Step 8: Verify Success');
//     // Wait for any success message or toast
//     const successMessage = page.locator('text=/Registration successful|Check your email|Success/i')
//         .or(page.locator('.ant-message-success'))
//         .or(page.locator('.ant-alert-success'));
//     await expect(successMessage).toBeVisible({ timeout: 20000 });

//     console.log('Step 9: Return to Login');
//     await page.locator('text=/Login here/i').click();

//     // Verify we are back at the signin page
//     await expect(page).toHaveURL(/signin|login/i);
// });


import { test, expect } from '@playwright/test';

test('User registration flow on Airth Core UI', async ({ page }) => {

  // Go to signin page
  await page.goto('https://airth-core-ui.dev.airth.io/signin');

  // Click on "Signup" link
  await page.getByText('Signup', { exact: true }).click();

  // Fill registration details
  await page.getByPlaceholder('First Name').fill('Shivaraj');
  await page.getByPlaceholder('Last Name').fill('Nalawade');

  // Select Membership Type = Consultant
  await page.locator('select[name="membershipType"]').selectOption('Consultant');

  // Fill Email
  await page.getByPlaceholder('Email').fill('shivaraj.airth@gmail.com');

  // Fill Password + Confirm Password
  await page.getByPlaceholder('Password').fill('Airth.io1234');
  await page.getByPlaceholder('Confirm Password').fill('Airth.io1234');

  // Click Register button
  await page.getByRole('button', { name: 'Register' }).click();

  // Expect a success message
  await expect(
    page.getByText('Registration successful', { exact: false })
  ).toBeVisible();

  // Click on "Login here" link
  await page.getByText('Login here', { exact: false }).click();

  // Verify navigation to login page
  await expect(page).toHaveURL(/.*signin/);
});
not working 