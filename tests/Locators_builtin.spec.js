const {test, expect} = require('@playwright/test')

test('Built-inLocators',async({page})=>{
    
    await page.goto('https://airth-core-ui.dev.airth.io/signin')

    const logo=await page.getByAltText('company-branding')
    await expect(logo).toBeVisible();

    await page.getByPlaceholder('UsernauserLogin_email').fill("shivaraj.airth@gmail.com")
    await page.getByPlaceholder('userLogin_password').fill("Airth.io123")

    await page.getByRole('button',{type: 'email'} ).click()
    

})