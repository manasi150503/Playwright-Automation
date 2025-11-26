const { test, expect } = require('@playwright/test');

test('Locators', async ({page})=>{

    await page.goto("https://airth-core-ui.dev.airth.io/signin")

   // Go to Signin page
  // await page.locator('type=email').click()
  // await page.click('type=email')

  // Fill email
   await page.locator("//input[@id='userLogin_email']").fill('shivaraj.airth@gmail.com')

  // provide password
  await page.locator(await page.fill('#userLogin_password', 'Airth.io123'))


  // Click Sign in
  await page.locator("//button[normalize-space()='Sign in']").click()

  // verify logout link presence
  const logoutlink = await page.locator("//li[normalize-space()='Logout']")

  await expect(logoutlink).toBeVisible();

  await page.close()

})
