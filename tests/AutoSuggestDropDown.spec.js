const {test, expect}=require('@playwright/test')

test('Auto suggest dropdown' , async ({page}) =>{
    await page.goto('https://www.redbus.in/')
})