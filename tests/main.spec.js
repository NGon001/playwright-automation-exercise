import { test } from '../Helper/base.ts';
import {generateRandomEmail} from '../Helper/tools.ts';
import dotenv from 'dotenv';
dotenv.config();

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

test('Test Case 1: Register User', async ({ homePage, signUp_LoginPage,signUpPage,accountCreatedPage,accountDeletePage }) => {
  //data
  const Title = 'Mr.';
  const name = ['Max', 'Petrov'];
  const email = await generateRandomEmail();
  const password = 'max123';
  const BirthDay = '13';
  const BirthMonth = 'August';
  const BirthYear = '2005';
  const Address = '123 Main St';
  const Address2 = 'Apt 4B';
  const Country = 'United States';
  const State = 'California';
  const City = 'Los Angeles';
  const Zipcode = '90001';
  const companyName = 'Test Company';
  const mobileNumber = '1234567890';

  //goto
  await homePage.goto();
  await homePage.gotoSignUpAndLoginPage();
  await signUp_LoginPage.checksignUpText();

  //Fill signup form
  await signUp_LoginPage.fillStartSignUpForm(name,email);
  await signUp_LoginPage.clickSignUpButton();

  //Fill detailed signup formr
  await signUpPage.checkDataInForm(name,email);
  await signUpPage.fillSignUpForm(Title,name,password,BirthDay,BirthMonth,BirthYear,companyName,Address,Address2,Country,State,City,Zipcode,mobileNumber);
  await signUpPage.clickCreateAccountButton();

  //verift account was created
  await accountCreatedPage.checkAccountCreationMessage();
  await accountCreatedPage.clickContinueButton();
  await homePage.checkLoggedInName(name);

  //delete account and verify it
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

test('Test Case 2: Login User with correct email and password', async ({ homePage, signUp_LoginPage }) => {
  //data
  const email = process.env.VALID_EMAIL || '';
  const password = process.env.VALID_PASSWORD || '';
  const name = ["vlad", "Petrov"];

  //goto
  await homePage.goto();
  await homePage.gotoSignUpAndLoginPage();
  await signUp_LoginPage.checkLoginText();

  //fill login form
  await signUp_LoginPage.fillLoginForm(email,password);
  await signUp_LoginPage.clickLoginButton();

  //verify login
  await homePage.checkLoggedInName(name);
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

test('Test Case 3: Login User with incorrect email and password', async ({ homePage, signUp_LoginPage }) => {
  //data
  const email = 'max12341@gmail.com';
  const password = process.env.VALID_PASSWORD || '';

  //goto
  await homePage.goto();
  await homePage.gotoSignUpAndLoginPage();
  await signUp_LoginPage.checkLoginText();

  //fill login form
  await signUp_LoginPage.fillLoginForm(email,password);
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

test('Test Case 4: Logout User', async ({ homePage, signUp_LoginPage }) => {
  //data
  const email = process.env.VALID_EMAIL || '';
  const password = process.env.VALID_PASSWORD || '';
  const name = ["vlad", "Petrov"];

  //goto
  await homePage.goto();
  await homePage.gotoSignUpAndLoginPage();
  await signUp_LoginPage.checkLoginText();

  //fill login form
  await signUp_LoginPage.fillLoginForm(email,password);
  await signUp_LoginPage.clickLoginButton();

  //verify login
  await homePage.checkLoggedInName(name);
  
  //logout
  await homePage.logout();
  await homePage.checkHomePageLoad();
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

test('Test Case 5: Register User with existing email', async ({ homePage, signUp_LoginPage }) => {
  //data
  const name = ['Max', 'Petrov'];
  const email = process.env.VALID_EMAIL || '';

  //goto
  await homePage.goto();
  await homePage.gotoSignUpAndLoginPage();
  await signUp_LoginPage.checksignUpText();

  //Fill signup form
  await signUp_LoginPage.fillStartSignUpForm(name,email);
  await signUp_LoginPage.clickSignUpButton();

  await signUp_LoginPage.checkExistedDataMessage();
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

test('Test Case 6: Contact Us Form', async ({ homePage, contactUsPage }) => {
  //data
  const name = ['Max', 'Petrov'];
  const email = process.env.VALID_EMAIL || '';
  const subject = 'Test Subject';
  const message = 'This is a test message.';
  const filePath = './README.md';

  //goto
  await homePage.goto();
  await homePage.gotoContactUsPage();
  await contactUsPage.checkGetInTouchText();

  //fill contact us form
  await contactUsPage.fillContactUsForm(name,email,subject,message,filePath);
  await contactUsPage.page.waitForTimeout(2000);
  await contactUsPage.clickSubmitButton();

  //verify success message
  await contactUsPage.checkSuccessMessage();
  await contactUsPage.clickReturnHomeButton();

  await homePage.checkHomePageLoad();
});