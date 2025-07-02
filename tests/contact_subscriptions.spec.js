import { test } from '../Helper/base.ts';


test.describe("Contact & Subscriptions", () => {
  test.beforeEach(async ({ homePage }) =>{
    await homePage.goto();
    await homePage.checkHomePageLoad();
    await homePage.verifySubscriptionText();
  });
  /*
  1. Launch browser
  2. Navigate to url 'http://automationexercise.com'
  3. Verify that home page is visible successfully
  4. Click on 'Contact Us' button
  5. Verify 'GET IN TOUCH' is visible
  6. Enter name, email, subject and message
  7. Upload file
  8. Click 'Submit' button
  9. Click OK button
  10. Verify success message 'Success! Your details have been submitted successfully.' is visible
  11. Click 'Home' button and verify that landed to home page successfully
   */

  test('C2298 Contact Us Form', async ({ homePage, contactUsPage }) => {
    //data
    const subject = 'Test Subject';
    const message = 'This is a test message.';
    const filePath = './README.md';

    //goto
    await homePage.gotoContactUsPage();
    await contactUsPage.checkGetInTouchText();

    //fill contact us form
    await contactUsPage.fillContactUsForm(process.env.REGISTER_NAME_FIRST,process.env.REGISTER_NAME_LAST,process.env.VALID_LOGIN_EMAIL,subject,message,filePath);
    await contactUsPage.page.waitForTimeout(2000);
    await contactUsPage.clickSubmitButton();

    //verify success message
    await contactUsPage.checkSuccessMessage();
    await contactUsPage.clickReturnHomeButton();

    await homePage.checkHomePageLoad();
  });

  /*
  Test Case 10: Verify Subscription in home page
  1. Launch browser
  2. Navigate to url 'http://automationexercise.com'
  3. Verify that home page is visible successfully
  4. Scroll down to footer
  5. Verify text 'SUBSCRIPTION'
  6. Enter email address in input and click arrow button
  7. Verify success message 'You have been successfully subscribed!' is visible
  */

  test('C2290 Verify Subscription in home page', async ({ homePage }) => {
    await homePage.inputValueToSubscriptionEmailField(process.env.VALID_LOGIN_EMAIL);
    await homePage.checkSuccessSubscriptionMessage();
  });

  /*
  Test Case 11: Verify Subscription in Cart page
  1. Launch browser
  2. Navigate to url 'http://automationexercise.com'
  3. Verify that home page is visible successfully
  4. Click 'Cart' button
  5. Scroll down to footer
  6. Verify text 'SUBSCRIPTION'
  7. Enter email address in input and click arrow button
  8. Verify success message 'You have been successfully subscribed!' is visible
  */

  test('C2291 Verify Subscription in Cart page', async ({ homePage,cartPage }) => {
    //goto
    await homePage.gotoCart();
    await cartPage.verifySubscriptionText();

    await cartPage.inputValueToSubscriptionEmailField(process.env.VALID_LOGIN_EMAIL);
  });
});