import { test } from '../../Helper/Fixtures.ts';
import { generateRandomEmail, getEnv } from '../../Helper/Tools.ts';

test.describe("E2E Authorization tests", () => {
  const incorrectEmail = 'max12341@gmail.com';
  test.beforeEach(async ({ homePage, signUp_LoginPage }) => {
    //goto
    await homePage.goto();
    await homePage.assertions.expectPageLoaded();
    await homePage.actions.clickSignUpAndLoginLink();
    await signUp_LoginPage.assertions.expectSignUpTextVisible();
    await signUp_LoginPage.assertions.expectLoginTextVisible();
  });

  /*
  1. Launch browser
  2. Navigate to url 'http://automationexercise.com'
  3. Verify that home page is visible successfully
  4. Click on 'Signup / Login' button
  5. Verify 'New User Signup!' is visible
  6. Enter name and email address
  7. Click 'Signup' button
  8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
  9. Fill details: Title, Name, Email, Password, Date of birth
  10. Select checkbox 'Sign up for our newsletter!'
  11. Select checkbox 'Receive special offers from our partners!'
  12. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
  13. Click 'Create Account button'
  14. Verify that 'ACCOUNT CREATED!' is visible
  15. Click 'Continue' button
  16. Verify that 'Logged in as username' is visible
  17. Click 'Delete Account' button
  18. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button */

  test('C32 Register User', async ({ homePage, signUp_LoginPage,signUpPage,accountCreatedPage,accountDeletePage },testInfo) => {
    const email = await generateRandomEmail();
    //Step 1: Fill signup form
    await signUp_LoginPage.actions.fillStartSignUpForm(await getEnv("REGISTER_NAME_FIRST"),email);
    await signUp_LoginPage.actions.clickSignUpButton();

    //Step 2: Fill detailed signup form
    await signUpPage.assertions.expectExtendedFormToBeVisible(await getEnv("REGISTER_NAME_FIRST"),email);
    await signUpPage.actions.fillSignUpForm(
      await getEnv("REGISTER_TITLE"),
      await getEnv("REGISTER_NAME_FIRST"),
      await getEnv("REGISTER_NAME_LAST"),
      await getEnv("REGISTER_PASSWORD"),
      await getEnv("REGISTER_BIRTH_DAY"),
      await getEnv("REGISTER_BIRTH_MONTH"),
      await getEnv("REGISTER_BIRTH_YEAR"),
      await getEnv("REGISTER_COMPANY_NAME"),
      await getEnv("REGISTER_ADDRESS"),
      await getEnv("REGISTER_ADDRESS2"),
      await getEnv("REGISTER_COUNTRY"),
      await getEnv("REGISTER_STATE"),
      await getEnv("REGISTER_CITY"),
      await getEnv("REGISTER_ZIPCODE"),
      await getEnv("REGISTER_MOBILE_NUMBER"),
    ); //newsletter and offers are checked by default, to not check them, pass false as last 2 arguments
    await signUpPage.actions.clickCreateAccountButton();

    //Step 3: verift account was created
    await accountCreatedPage.assertions.expectAccountCreatedTextVisible();
    await accountCreatedPage.actions.clickContinueButton();
    await homePage.assertions.expectLoggedInNameIsVisible(await getEnv("REGISTER_NAME_FIRST"));

    //Step 4: delete account and Verify it
    await homePage.actions.clickDeleteAccount();
    await accountDeletePage.assertions.expectAccountDeletedTextVisible();
    await accountDeletePage.actions.clickContinueButton();
    await homePage.assertions.expectPageLoaded();
  });

  /*
  1. Launch browser
  2. Navigate to url 'http://automationexercise.com'
  3. Verify that home page is visible successfully
  4. Click on 'Signup / Login' button
  5. Verify 'Login to your account' is visible
  6. Enter correct email address and password
  7. Click 'login' button
  8. Verify that 'Logged in as username' is visible
  */

  test('C36 Login User with correct email and password', async ({ homePage, signUp_LoginPage }) => {
    //fill login form
    await signUp_LoginPage.actions.fillLoginForm(await getEnv("VALID_LOGIN_EMAIL"),await getEnv("VALID_LOGIN_PASSWORD"));
    await signUp_LoginPage.actions.clickLoginButton();

    //verify login
    await homePage.assertions.expectLoggedInNameIsVisible(await getEnv("VALID_LOGIN_NAME_FIRST"));
  });

  /*
  1. Launch browser
  2. Navigate to url 'http://automationexercise.com'
  3. Verify that home page is visible successfully
  4. Click on 'Signup / Login' button
  5. Verify 'Login to your account' is visible
  6. Enter incorrect email address and password
  7. Click 'login' button
  8. Verify error 'Your email or password is incorrect!' is visible
   */

  test('C35 Login User with incorrect email and password', async ({signUp_LoginPage }) => {
    //fill login form
    await signUp_LoginPage.actions.fillLoginForm(incorrectEmail,await getEnv("VALID_LOGIN_PASSWORD"));
    await signUp_LoginPage.actions.clickLoginButton();

    await signUp_LoginPage.assertions.expectIncorectDataMessageVisible();
  });

  /*
  1. Launch browser
  2. Navigate to url 'http://automationexercise.com'
  3. Verify that home page is visible successfully
  4. Click on 'Signup / Login' button
  5. Verify 'Login to your account' is visible
  6. Enter correct email address and password
  7. Click 'login' button
  8. Verify that 'Logged in as username' is visible
  9. Click 'Logout' button
  10. Verify that user is navigated to login page
   */

  test('C31 Logout User', async ({ homePage, signUp_LoginPage }) => {
    //fill login form
    await signUp_LoginPage.actions.fillLoginForm(await getEnv("VALID_LOGIN_EMAIL"),await getEnv("VALID_LOGIN_PASSWORD"));
    await signUp_LoginPage.actions.clickLoginButton();

    //verify login
    await homePage.assertions.expectLoggedInNameIsVisible(await getEnv("VALID_LOGIN_NAME_FIRST"));

    //logout
    await homePage.actions.clickLogoutButton();
    await signUp_LoginPage.assertions.expectLoginTextVisible();
    await signUp_LoginPage.assertions.expectSignUpTextVisible();
  });

  /*
  1. Launch browser
  2. Navigate to url 'http://automationexercise.com'
  3. Verify that home page is visible successfully
  4. Click on 'Signup / Login' button
  5. Verify 'New User Signup!' is visible
  6. Enter name and already registered email address
  7. Click 'Signup' button
  8. Verify error 'Email Address already exist!' is visible
   */

  test('C33 Register User with existing email', async ({ signUp_LoginPage }) => {
    //Fill signup form
    await signUp_LoginPage.actions.fillStartSignUpForm(await getEnv("REGISTER_NAME_FIRST"),await getEnv("VALID_LOGIN_EMAIL"));
    await signUp_LoginPage.actions.clickSignUpButton();

    await signUp_LoginPage.assertions.expectExistedEmailMessageVisible();
  });

});