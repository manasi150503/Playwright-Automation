const { test, expect } = require('@playwright/test')

test("Handle checkboxes",async ({page})=>{

     await page.goto('https://testautomationpractice.blogspot.com/');