import { test } from '../../Helper/base.ts';
import { getEnv } from '../../Helper/tools.ts';

test.describe("E2E Contact & Subscriptions", () => {
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

  test('C43 Contact Us Form', async ({ homePage, contactUsPage }) => {
    //data
    const subject = 'Test Subject';
    const message = 'This is a test message.';
    const filePath = './README.md';

    //goto
    await homePage.clickContactUs();
    await contactUsPage.assertions.expectGetInTouchTextVisible();

    //fill contact us form
    await contactUsPage.actions.fillContactUsForm(
      await getEnv("REGISTER_NAME_FIRST"),
      await getEnv("REGISTER_NAME_LAST"),
      await getEnv("VALID_LOGIN_EMAIL"),
      subject,
      message,
      filePath
    );
    await contactUsPage.page.waitForTimeout(2000);
    await contactUsPage.actions.clickSubmitButton();

    //verify success message
    await contactUsPage.assertions.expectSuccessMessageVisible();
    await contactUsPage.actions.clickReturnHomeButton();

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

  test('C44 Verify Subscription in home page', async ({ homePage }) => {
    await homePage.inputValueToSubscriptionEmailField(await getEnv("VALID_LOGIN_EMAIL"));
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

  test('C42 Verify Subscription in Cart page', async ({ homePage,cartPage }) => {
    //goto
    await homePage.gotoCart();
    await cartPage.verifySubscriptionText();

    await cartPage.inputValueToSubscriptionEmailField(await getEnv("VALID_LOGIN_EMAIL"));
  });
});