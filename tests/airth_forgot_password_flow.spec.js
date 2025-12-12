const { test, expect, chromium } = require('@playwright/test');

test('Airth Forgot Password Flow with Gmail', async () => {
    test.setTimeout(300000); // 5 minutes

    // Use persistent context to access existing Chrome profile with Gmail logged in
    const userDataDir = 'C:\\Users\\Webkorps\\AppData\\Local\\Google\\Chrome\\User Data';

    let context;
    try {
        context = await chromium.launchPersistentContext(userDataDir, {
            headless: false,
            channel: 'chrome', // Use installed Chrome
            args: ['--disable-blink-features=AutomationControlled'],
        });
    } catch (error) {
        console.error('\n❌ CRITICAL ERROR: Could not launch Chrome with your profile.');
        console.error('👉 ACTION REQUIRED: Please CLOSE ALL CHROME WINDOWS and run the test again.');
        console.error('The test requires your existing Chrome profile to access Gmail.\n');
        throw error;
    }

    const page = context.pages()[0] || await context.newPage();
    let gmailPage = null;

    try {
        // ============================================
        // STEP 1: Initiate Password Reset on Airth
        // ============================================
        console.log('Step 1: Navigating to Airth signin page...');
        await page.goto('https://airth-core-ui.dev.airth.io/signin');
        await page.waitForTimeout(5000);

        // Verify we are on the signin page
        await expect(page).toHaveURL(/.*signin/);
        await expect(page.locator('text=Welcome back')).toBeVisible();

        // Click on Forgot Password
        console.log('Step 2: Clicking Forgot Password...');
        await page.getByText('Forgot Password').click();

        // Wait for navigation to complete
        await page.waitForURL(/.*reset-password/, { timeout: 10000 });
        await page.waitForTimeout(5000);

        // Verify we are on the reset password page
        await expect(page.getByRole('button', { name: 'Send Password Reset Email' })).toBeVisible();

        // Fill the email field
        console.log('Step 3: Filling email...');
        const email = 'shivaraj.airth@gmail.com';
        await page.locator('input[type="email"]').fill(email);
        await page.waitForTimeout(5000);

        // Click on send link to email
        console.log('Step 4: Clicking Send Password Reset Email...');
        await page.getByRole('button', { name: 'Send Password Reset Email' }).click();
        await page.waitForTimeout(5000);

        console.log('Password reset email sent. Waiting for email to arrive...');
        await page.waitForTimeout(10000); // Wait 10 seconds for email to arrive

        // ============================================
        // STEP 2: Access Gmail (Already Logged In)
        // ============================================
        console.log('Step 5: Opening Gmail (using existing login)...');
        gmailPage = await context.newPage();

        // Navigate to Gmail inbox - should already be logged in
        await gmailPage.goto('https://mail.google.com/mail/u/0/#inbox');
        await gmailPage.waitForTimeout(5000);

        console.log('Step 6: Waiting for Gmail to load...');
        await gmailPage.waitForTimeout(5000);

        console.log('Step 7: Looking for the reset email...');

        // Wait for emails to load
        await gmailPage.waitForSelector('table[role="grid"]', { timeout: 15000 });
        await gmailPage.waitForTimeout(5000);

        // Click on the email from Airth (using filter instead of just first())
        console.log('Step 8: Searching for Airth email in the list...');
        // We use the existing selector strategy but filter for text "Airth"
        const emailRow = gmailPage.locator('tr.zA, tr.yO, table[role="grid"] tr').filter({ hasText: /Airth/i }).first();

        // Wait specifically for OUR email to be visible
        await expect(emailRow).toBeVisible({ timeout: 30000 });
        await emailRow.click();
        await gmailPage.waitForTimeout(5000);

        // Find and click the reset password link
        console.log('Step 9: Looking for reset password link in email...');

        // Wait for email body to load
        await gmailPage.waitForTimeout(5000);

        // Try different selectors for the reset link
        const resetLinkSelectors = [
            'a:has-text("Reset")',
            'a:has-text("reset")',
            'a:has-text("Click here")',
            'a[href*="reset"]',
            'a[href*="password"]',
            'a[href*="airth"]',
        ];

        let resetLink = null;
        for (const selector of resetLinkSelectors) {
            try {
                const links = await gmailPage.locator(selector).all();
                for (const link of links) {
                    if (await link.isVisible({ timeout: 2000 })) {
                        const href = await link.getAttribute('href');
                        if (href && href.includes('airth') && (href.includes('reset') || href.includes('password'))) {
                            resetLink = link;
                            console.log(`Found reset link with href: ${href}`);
                            break;
                        }
                    }
                }
                if (resetLink) break;
            } catch (e) {
                continue;
            }
        }

        if (!resetLink) {
            // Take a screenshot for debugging
            await gmailPage.screenshot({ path: 'gmail-email-body.png', fullPage: true });
            throw new Error('Could not find password reset link in email. Screenshot saved.');
        }

        // Get the reset link URL
        const resetUrl = await resetLink.getAttribute('href');
        console.log(`Reset URL: ${resetUrl}`);
        await gmailPage.waitForTimeout(5000);

        // ============================================
        // STEP 3: Reset Password on Airth
        // ============================================
        console.log('Step 10: Navigating to password reset page...');
        await page.goto(resetUrl);
        await page.waitForTimeout(5000);

        // Enter new password
        console.log('Step 11: Entering new password...');
        const newPassword = 'Airth.io1234'; // Updated password

        // Find password input fields
        const passwordFields = await page.locator('input[type="password"]').all();

        if (passwordFields.length >= 2) {
            // Fill new password
            await passwordFields[0].fill(newPassword);
            await page.waitForTimeout(5000);

            // Confirm new password
            await passwordFields[1].fill(newPassword);
            await page.waitForTimeout(5000);
        } else if (passwordFields.length === 1) {
            await passwordFields[0].fill(newPassword);
            await page.waitForTimeout(5000);
        } else {
            throw new Error('No password fields found on reset page');
        }

        // Click submit/reset button
        console.log('Step 12: Submitting new password...');
        const submitButton = page.locator('button[type="submit"], button:has-text("Reset Password"), button:has-text("Submit"), button:has-text("Change Password")').first();
        await submitButton.click();
        await page.waitForTimeout(5000);

        // ============================================
        // STEP 4: Login with New Password
        // ============================================
        console.log('Step 13: Navigating to signin page...');
        await page.goto('https://airth-core-ui.dev.airth.io/signin');
        await page.waitForTimeout(5000);

        // Enter email
        console.log('Step 14: Entering email for login...');
        await page.locator('input[type="email"]').fill(email);
        await page.waitForTimeout(5000);

        // Enter new password
        console.log('Step 15: Entering new password for login...');
        await page.locator('input[type="password"]').fill(newPassword);
        await page.waitForTimeout(5000);

        // Click sign in
        console.log('Step 16: Clicking Sign In...');
        await page.getByRole('button', { name: /sign in|login/i }).click();
        await page.waitForTimeout(5000);

        // Verify successful login
        console.log('Step 17: Verifying successful login...');
        await expect(page).not.toHaveURL(/.*signin/);

        console.log('\n✅ Complete password reset flow successful!');
        await page.waitForTimeout(5000);

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);

        // Take screenshots for debugging
        try {
            await page.screenshot({ path: 'airth-page-error.png', fullPage: true });
            if (gmailPage) {
                await gmailPage.screenshot({ path: 'gmail-page-error.png', fullPage: true });
            }
            console.log('Screenshots saved for debugging');
        } catch (screenshotError) {
            console.log('Could not save screenshots');
        }

        throw error;
    } finally {
        // Cleanup
        if (gmailPage) {
            await gmailPage.close();
        }
        if (context) {
            await context.close();
        }
    }
});
