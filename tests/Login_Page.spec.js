// const { test, expect } = require('@playwright/test');

// test('Open Signup -> Forgot Password -> Fill Form', async ({ page }) => {
//   // 1) Open Sign-in page
//   await page.goto("https://airth-core-ui.dev.airth.io/signin");

//   // 2) Click Sign up — site may or may not navigate
//   const clickSignUp = page.locator("text=Sign up");
//   await clickSignUp.click();

//   // Wait a short time for navigation OR for a signup form to appear
//   const nav = await page.waitForNavigation({ timeout: 3000 }).catch(() => null);
//   if (nav) {
//     // If navigation happened, assert URL contains signup
//     expect(page.url()).toMatch(/signup/);
//   } else {
//     // If no navigation, check for a visible signup/form element (adjust text if needed)
//     await page.locator("text=Create an account").waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
//   }

//   // 3) Go back to Sign-in (if we navigated away)
//   await page.goBack().catch(() => {});
//   // Confirm we are on the signin page or at least that the sign-in email input exists
//   await page.locator("input[type='email'], #userLogin_email").first().waitFor({ state: 'visible', timeout: 5000 });

//   // 4) Click "Forgot Password"
//   await page.locator("text=Forgot Password").click();

//   // Wait for either URL change or the reset-password form's email input
//   const nav2 = await page.waitForNavigation({ timeout: 3000 }).catch(() => null);
//   if (nav2) {
//     expect(page.url()).toMatch(/reset-password/);
//   }
//   // Wait for email field on reset page (adjust selector if page uses different id)
//   const emailField = page.locator("input[type='email'], #basic_email, input#basic_email, input[name='email']");
//   await emailField.waitFor({ state: 'visible', timeout: 5000 });

//   // 5) Fill email field
//   await emailField.fill("shivaraj.airth@gmail.com");

//   // 6) Click "Send Password Reset Email" button (text-based locator is robust)
//   await page.locator("button:has-text('Send Password Reset Email')").click();

//   // Optional: assert a confirmation message or toast (uncomment and update locator if available)
//   // await expect(page.locator("text=Password reset email sent")).toBeVisible({ timeout: 5000 });

//   // Done
// });

// tests/full_flow.spec.js
const { test, expect } = require('@playwright/test');

test('Signup -> Forgot Password -> Reset -> Sign in (uses your signin reference)', async ({ page }) => {
  // Helpful local screenshots (you uploaded these)
  console.log('Screenshot1:', '/mnt/data/Screenshot (258).png');
  console.log('Screenshot2:', '/mnt/data/Screenshot (259).png');

  const signinUrl = 'https://airth-core-ui.dev.airth.io/signin';
  const signupUrl = 'https://airth-core-ui.dev.airth.io/signup';
  const resetUrl  = 'https://airth-core-ui.dev.airth.io/reset-password';

  // 1) Try open signup page directly
  await page.goto(signupUrl, { waitUntil: 'domcontentloaded' }).catch(() => {});

  // If redirected back to signin or signup not reached, open signin and click Sign up
  if (!page.url().includes('/signup')) {
    await page.goto(signinUrl, { waitUntil: 'domcontentloaded' });
    const signUpCandidates = [
      'text=Sign up',
      'a:has-text("Sign up")',
      'text="Sign up"',
      'role=link[name="Sign up"]'
    ];
    let clickedSignUp = false;
    for (const s of signUpCandidates) {
      const loc = page.locator(s);
      if (await loc.count() > 0) {
        try {
          await loc.first().scrollIntoViewIfNeeded();
          await loc.first().click({ timeout: 8000 });
          clickedSignUp = true;
          break;
        } catch (e) { /* try next */ }
      }
    }
    if (!clickedSignUp) {
      // fallback: navigate to signup direct
      await page.goto(signupUrl).catch(() => {});
    }
  }

  // 2) Navigate to signin to continue the flow (deterministic)
  await page.goto(signinUrl, { waitUntil: 'domcontentloaded' });

  // 3) Click "Forgot Password" (or fallback to reset URL)
  const forgotCandidates = [
    'text=Forgot Password',
    'a:has-text("Forgot Password")',
    'text="Forgot Password?"',
    'role=link[name="Forgot Password"]'
  ];
  let clickedForgot = false;
  for (const fs of forgotCandidates) {
    const loc = page.locator(fs);
    if (await loc.count() > 0) {
      try {
        await loc.first().scrollIntoViewIfNeeded();
        await loc.first().click({ timeout: 8000 });
        clickedForgot = true;
        break;
      } catch (e) { /* try next */ }
    }
  }
  if (!clickedForgot) {
    await page.goto(resetUrl, { waitUntil: 'domcontentloaded' });
  }

  // 4) Wait for/reset page email input and fill it
  const resetEmailSelectors = [
    'input#basic_email',
    '#basic_email',
    "#userLogin_email",        // sometimes same id used
    "input[type='email']",
    "input[name='email']"
  ];
  let resetEmailLocator = null;
  for (const sel of resetEmailSelectors) {
    const l = page.locator(sel);
    if (await l.count() > 0) {
      try {
        await l.first().waitFor({ state: 'visible', timeout: 7000 });
        resetEmailLocator = l.first();
        break;
      } catch (e) { /* try next */ }
    }
  }
  if (!resetEmailLocator) {
    throw new Error(`Reset email input not found on ${page.url()}`);
  }

  await resetEmailLocator.fill('shivaraj.airth@gmail.com');

  // 5) Click "Send Password Reset Email"
  const sendBtnCandidates = [
    "button:has-text('Send Password Reset Email')",
    "button:has-text('Send Password Reset')",
    "button[type='submit']",
    "text=Send Password Reset Email"
  ];
  let clickedSend = false;
  for (const btnSel of sendBtnCandidates) {
    const b = page.locator(btnSel);
    if (await b.count() > 0) {
      try {
        await b.first().scrollIntoViewIfNeeded();
        await b.first().click({ timeout: 8000 });
        clickedSend = true;
        break;
      } catch (e) { /* try next */ }
    }
  }
  if (!clickedSend) {
    throw new Error('Could not click the Send Password Reset Email button.');
  }

  // 6) Return to signin page (goBack or direct)
  try {
    await page.goBack({ timeout: 5000 });
    // sometimes goBack goes to signup; ensure signin
    if (!page.url().includes('/signin')) {
      await page.goto(signinUrl);
    }
  } catch (e) {
    await page.goto(signinUrl);
  }

  // -------------------------
  // 7) Sign-in flow (your provided reference, corrected)
  // -------------------------
  // Navigate to signin to be safe
  await page.goto(signinUrl, { waitUntil: 'domcontentloaded' });

  // Fill email using your locator
  await page.locator("//input[@id='userLogin_email']").fill('shivaraj.airth@gmail.com');

  // Fill password (fix: use page.fill; your original had incorrect usage)
  await page.fill('#userLogin_password', 'Airth.io123');

  // Click Sign in
  await page.locator("//button[normalize-space()='Sign in']").click();

  // verify logout link presence using your locator
  const logoutlink = page.locator("//li[normalize-space()='Logout']");
  await expect(logoutlink).toBeVisible({ timeout: 10000 });

  // close page (Playwright will close browser after test finishes anyway)
  await page.close();
});
