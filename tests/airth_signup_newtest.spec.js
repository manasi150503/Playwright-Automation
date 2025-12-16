// Playwright Test for Airth.io Signup Flow
const { test, expect } = require('@playwright/test');

test('Airth Signup Flow - Happy Path', async ({ page }) => {

    try {
        test.setTimeout(70000); // 70 seconds for full flow

        console.log('Step 1: Navigate to Sign In');
        await page.goto('https://airth-core-ui.dev.airth.io/signin', { waitUntil: 'networkidle' });

        await expect(page).toHaveURL(/signin|login/i);
        console.log('Page Title:', await page.title());

        /*
        console.log('Step 2: Click Sign up');
        const signupLink = page.locator('text=Sign up');
        console.log('Count of "Sign up":', await signupLink.count());
        await signupLink.first().waitFor({ state: 'visible', timeout: 15000 });

        // hydration-safe click
        await signupLink.first().click();
        
        console.log('Waiting for URL change...');
        await page.waitForURL(/signup|register/i, { timeout: 10000 });
        */
        console.log('Step 2: Direct Navigation to Signup (Debug)');
        await page.goto('https://airth-core-ui.dev.airth.io/signup', { waitUntil: 'networkidle' });

        console.log('Step 3: Wait for Signup Form');
        console.log('Current URL:', page.url());
        const header = page.locator('h1, h2, h3, .ant-typography').filter({ hasText: /Create Your Account|Sign Up|Register/i }).first();
        await expect(header).toBeVisible({ timeout: 20000 });

        console.log('Step 4: Fill Personal Details');
        await page.locator('#registerForm_firstName').fill('Shivaraj');
        await page.locator('#registerForm_lastName').fill('Nalawade');

        console.log('Step 5: Select Membership Type');

        // Click dropdown input (Ant Design select uses input)
        const membershipDropdown = page.locator('#registerForm_membershipType');
        await membershipDropdown.click();

        // Select "Individual"
        const membershipOption = page.locator('.ant-select-item-option-content', {
            hasText: 'Individual'
        });

        await membershipOption.first().waitFor({ state: 'visible', timeout: 10000 });
        await membershipOption.first().click();

        console.log('Step 6: Fill Login Credentials');
        await page.locator('#registerForm_email').fill('shivaraj.airth@gmail.com');
        await page.locator('#registerForm_password').fill('Airth.io1234');
        await page.locator('#registerForm_confirmPassword').fill('Airth.io1234');

        console.log('Step 7: Submit');
        await page.locator('//button[@type="submit"]').click();

        console.log('Step 8: Verify Success Message');
        const successToast = page.locator('text=/Registration successful|Check your email|Success/i')
            .or(page.locator('.ant-message-success'))
            .or(page.locator('.ant-alert-success'));

        await expect(successToast).toBeVisible({ timeout: 20000 });

        console.log('Step 9: Navigate Back to Login');
        const loginHere = page.locator('text=/login here/i');
        await loginHere.click();

        await expect(page).toHaveURL(/signin|login/i);

        console.log('Signup Flow Completed Successfully!');
    } catch (error) {
        console.error('TEST FAILED:', error);
        throw error;
    }
});
