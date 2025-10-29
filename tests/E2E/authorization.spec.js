import { test } from '../../Helper/base.ts';
import { generateRandomEmail } from '../../Helper/tools.js';

test.describe("E2E Authorization tests", () => {
  test.beforeEach(async ({ homePage, signUp_LoginPage }) => {
    //goto
    await homePage.goto();
    await homePage.checkHomePageLoad();
    await homePage.clickSignUpAndLoginLink();
    await signUp_LoginPage.checkSignUpText();
    await signUp_LoginPage.checkLoginText();
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
    await signUp_LoginPage.fillStartSignUpForm(process.env.REGISTER_NAME_FIRST,email);
    await signUp_LoginPage.clickSignUpButton();

    //Step 2: Fill detailed signup form
    await signUpPage.checkDataInForm(process.env.REGISTER_NAME_FIRST,email);
    await signUpPage.fillSignUpForm(
      process.env.REGISTER_TITLE,
      process.env.REGISTER_NAME_FIRST,
      process.env.REGISTER_NAME_LAST,
      process.env.REGISTER_PASSWORD,
      process.env.REGISTER_BIRTH_DAY,
      process.env.REGISTER_BIRTH_MONTH,
      process.env.REGISTER_BIRTH_YEAR,
      process.env.REGISTER_COMPANY_NAME,
      process.env.REGISTER_ADDRESS,
      process.env.REGISTER_ADDRESS2,
      process.env.REGISTER_COUNTRY,
      process.env.REGISTER_STATE,
      process.env.REGISTER_CITY,
      process.env.REGISTER_ZIPCODE,
      process.env.REGISTER_MOBILE_NUMBER
    );
    await signUpPage.clickCreateAccountButton();

    //Step 3: verift account was created
    await accountCreatedPage.checkAccountCreationMessage();
    await accountCreatedPage.clickContinueButton();
    await homePage.checkLoggedInName(process.env.REGISTER_NAME_FIRST);

    //Step 4: delete account and Verify it
    await homePage.clickDeleteAccount();
    await accountDeletePage.checkAccountDeletedMessage();
    await accountDeletePage.clickContinueButton();
    await homePage.checkHomePageLoad();
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
    await signUp_LoginPage.fillLoginForm(process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD);
    await signUp_LoginPage.clickLoginButton();

    //verify login
    await homePage.checkLoggedInName(process.env.VALID_LOGIN_NAME_FIRST);
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
    //data
    const incorrectEmail = 'max12341@gmail.com';

    //fill login form
    await signUp_LoginPage.fillLoginForm(incorrectEmail,process.env.VALID_LOGIN_PASSWORD);
    await signUp_LoginPage.clickLoginButton();

    await signUp_LoginPage.checkIncorectDataMessage();
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
    await signUp_LoginPage.fillLoginForm(process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD);
    await signUp_LoginPage.clickLoginButton();

    //verify login
    await homePage.checkLoggedInName(process.env.VALID_LOGIN_NAME_FIRST);

    //logout
    await homePage.logout();
    await signUp_LoginPage.checkLoginText();
    await signUp_LoginPage.checkThatSignUpAndLoginButtonIsVissible();
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
    await signUp_LoginPage.fillStartSignUpForm(process.env.REGISTER_NAME_FIRST,process.env.VALID_LOGIN_EMAIL);
    await signUp_LoginPage.clickSignUpButton();

    await signUp_LoginPage.checkExistedDataMessage();
  });

});