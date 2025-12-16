// //------------loginpage.spec.js--------



// // @ts-check
// import { test, expect } from "@playwright/test"
// import { allure } from "allure-playwright";
// const { attachScreenshot, attachPartialScreenshot } = require("../utils/commonFunction")
// import pom from "../utils/pageObjectsReader"
// var page, loginPage
// test.beforeEach(async ({ }) => {
//   await allure.suite("Login Page Test Scenarios");
// })
// test.describe("Asset Panda 2.0",{ tag: ['@LoginPage' ] }, () => {
//   test.setTimeout(60000 * 2)
//   test.describe.configure({ mode: "serial", retries: 1 })
//   test.beforeAll(async ({ browser }) => {
//     test.setTimeout(60000 * 3)

//     const context = await browser.newContext()
//     page = await context.newPage()
//     const pageObjects = new pom(page)
//     loginPage = pageObjects.getLoginPage()
//   })

//   test.afterAll(async ({ browser }) => {
//     page.close()
//     browser.close
//   })

//   test("Login Page Validation ",{ tag: ['@ForgotPassword','@ForgotPasswordModel','@Password','@RememberMe' ] }, async ({ }, testInfo) => {
//     await page.goto("", { waitUntil: 'networkidle' })
//     await page.waitForTimeout(5000)
//     await loginPage.validateLoginPage()
//     await attachScreenshot(page, testInfo, "Login-Page")
//   })
//   test("Verify, user is able to see the Login page with Email address , Remember me  & continue button",async()=>{
//     await expect.soft(loginPage.username).toBeVisible()
//     await expect.soft(loginPage.rememberBtn).toBeVisible()
//     await expect.soft(loginPage.continueButton).toBeVisible();
//   })

//   test("Verify, user can refresh the page multiple time on login screen",async()=>{
//     await page.reload()
//     await page.waitForLoadState('networkidle')
//     await expect.soft(loginPage.username).toBeVisible()
//     await page.reload()
//     await page.waitForLoadState('networkidle');
//     await expect.soft(loginPage.username).toBeVisible();
//   })
//   test("Verify, invalid error will displayed if user click on the continue button without adding the email address",async()=>{
//     await loginPage.continueButton.click()
//     await expect.soft(loginPage.invalidEmailMessage).toBeVisible()
//   })
//   // below listed two test have wrong validation , need to fix it after fix of - https://teamassetpanda.atlassian.net/browse/AP2-662 
//   // edit :- at the time of updating the script the issue is still in to do but it is no more replicable to i have commmented this two test cases
//   // test("Verify,Email not be editable on the next normal login page , user need to click on the login as different user",async()=>{
//     //   await expect.soft(loginPage.username).not.toBeEnabled()
//     // })
//     // test("Verify,Email not be editable on the next normal login page ,  try to hit keyboard Tab button, it will not be editable",async()=>{
//       //   await expect.soft(loginPage.username).not.toBeEditable()
//       // })
//       test("Verify, user can click on the login as different user, it will redirect to 1st page.",async()=>{
//     await loginPage.LoginPageSSO();
//     await loginPage.loginAsDifferentUser.click()
//     await expect.soft(await loginPage.continueButton).toBeVisible();
//   })
//   test("Verify,user can click on the Remember Me check mark",async()=>{
//     await loginPage.username.fill('sso@assetpanda.com')
//     await loginPage.rememberBtn.click();
//     await loginPage.continueButton.click()
//     await page.waitForTimeout(4000)
//     await page.waitForLoadState('networkidle')
//   })
//   test("Verify,if user mark Remember me and click on the continue button, email will be filled out in next time",async()=>{
//    var email = 'sso@assetpanda.com'
//     // await page.goto("", { waitUntil: 'networkidle' })
//     // await page.waitForLoadState('networkidle')
//     await expect(await page.locator(`//div//span[text()="${email}"]`)).toHaveText(email)
//     //  await loginPage.rememberBtn.click();
//   })
//   // we have commented this test cases because now we are not able to input empty username and empty password [P2B-2962]
//   // test("Empty username and empty password ", async ({ }, testInfo) => {
//   //   await loginPage.LoginPageSSO()
//   //   await loginPage.emptyFieldLogin()
//   //   await attachPartialScreenshot(page, testInfo, "Blank-Login-Attempted", loginPage.loginForm)
//   // })

//   test("Invalid username and invalid password ", async ({ }, testInfo) => {
//     await loginPage.loginAsDifferentUser.click()
//     // await loginPage.LoginPageSSO()
//     await loginPage.invalidLogin("vk@assetpanda.com", "P@nda1234")
//     await attachPartialScreenshot(page, testInfo, "Invalid-Login-Attempted", loginPage.errorMessage)
//   })

//   test("Verify forget password button ",{ tag: ['@ForgotPassword','@ForgotPasswordModel'] }, async ({ }, testInfo) => {
//     await loginPage.forgetPassword()
//   })

//   test("Verify On forget password page Email Address text field is visible and clickable ",{ tag: ['@ForgotPassword','@ForgotPasswordModel' ] }, async () => {
//     await expect(loginPage.inputEmail).toBeEnabled();
//   })

//   test("Verify On forget password page Email Address text field will not accept invalid email ",{ tag: ['@ForgotPassword','@ForgotPasswordModel' ] }, async () => {
//     await loginPage.inputEmail.click();
//     await loginPage.inputEmail.fill('demo-2gogle.co')
//     await loginPage.requestResetLink.click()
//   })
//   test("Verify After entering invalid email error msg should be visible ",{ tag: ['@ForgotPassword','@ForgotPasswordModel' ] }, async () => {
//     await expect.soft(loginPage.invalidEmailLabel).toBeVisible();
//   })

//   test("Verify User can add the valid Email ID on Forgot Password Model ",{ tag: ['@ForgotPassword','@ForgotPasswordModel' ] }, async ({ }, testInfo) => {
//     await loginPage.forgetPasswordModel()
//     await attachScreenshot(page, testInfo, "Forgot-Password-Page")
//   })

//   test("Verify Reset link is in enable state when user enter the email address ",{ tag: ['@ForgotPassword','@ForgotPasswordModel' ] }, async () => {
//     await expect.soft(loginPage.requestResetLink).toBeEnabled();
//   })
//   test("Verify, if user can click on the 'Request Reset Link' button ",{ tag: ['@ForgotPassword','@ForgotPasswordModel' ] }, async () => {
//     await loginPage.requestResetLink.click();
//     await expect.soft(loginPage.newPasswordLabel).toBeVisible();
//     await expect.soft(loginPage.confirmPasswordLabel).toBeVisible()
//   })
//   test("Valid login ",{ tag: ['@LoginAccount','@UserProfile','@SignOutButton' ] }, async ({ }, testInfo) => {
//     await page.goto("", { waitUntil: 'networkidle' })
//     await page.waitForLoadState('networkidle')
//     await loginPage.validLogin()
//     await attachScreenshot(page, testInfo, "Logged-In-Page")
//   })

//   test("Logout ",{ tag: ['@LoginAccount','@UserProfile','@SignOutButton' ] }, async ({ }, testInfo) => {
//     await loginPage.logout()
//   })
//   test("Verify, After logout , user can able to re login the same / different account",{ tag: ['@LoginAccount','@UserProfile','@SignOutButton' ] },async()=>{
//     await loginPage.validLogin()
//     await loginPage.logout()
//   })

//   // we have made changes in this test as remember me button is moved to the sso page.[P2B-2891]
//   test("Verify the ‘Remember Me’ functionality.",{ tag: ['@RememberMe'] }, async ({ }, testInfo) => {
//     await page.waitForLoadState("load")
//     await loginPage.rememberMe("ap@assetpanda.com")
//     await attachScreenshot(page, testInfo, "Email-Remembered")
//   })

//   test("Password visibility check - Masked ",{ tag: ['@Password'] }, async ({ }, testInfo) => {
//     await loginPage.passwordMasked()
//     await attachPartialScreenshot(page, testInfo, "Password-Masked", loginPage.loginForm)
//   })

//   test("Password visibility check - UnMasked ",{ tag: ['@Password'] }, async ({ }, testInfo) => {
//     await loginPage.passwordUnmasked()
//     await attachPartialScreenshot(page, testInfo, "Password-Unmasked", loginPage.loginForm)
//   })

//   test("Enter key press on loginPage ", async ({ }, testInfo) => {
//     await loginPage.loginAsDifferentUser.click()
//     await loginPage.pressEnterToLogin()
//   })

//   test("Invalid login(valid username and invalid password) ", async ({ }, testInfo) => {
//     await loginPage.invalidLogin("vkaul@assetpanda.com", "P@nda1234")
//   })

//   test("Invalid username and valid password ", async ({ }, testInfo) => {
//     await loginPage.loginAsDifferentUser.click()
//     await loginPage.invalidLogin("vk@assetpanda.com", "P@nda123")
//     console.log("login test")
//   })

// })