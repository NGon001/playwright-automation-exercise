// @ts-check
import { test, expect } from '@playwright/test';
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

test('Test Case 1: Register User', async ({ page }) => {
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
  await page.goto("/");
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await expect(await page.getByText('New User Signup!')).toBeVisible();

  //Fill signup form
  const signupForm = await page.locator('form[action="/signup"]');
  await signupForm.getByPlaceholder('Name').fill(name[0]);
  await signupForm.getByPlaceholder('Email Address').fill(email);
  await signupForm.getByRole('button', { name: 'Signup' }).click();

  //Fill detailed signup form
  await expect(page.getByText('Enter Account Information')).toBeVisible();
  await expect(await page.locator("#name").getAttribute('value')).toBe(name[0]);
  await expect(await page.locator("#email").getAttribute('value')).toBe(email);
  await page.getByRole('radio', { name: Title }).check();
  await page.locator('#password').fill(password);
  await page.locator('#days').selectOption({ label: BirthDay });
  await page.locator('#months').selectOption({ label: BirthMonth });
  await page.locator('#years').selectOption({ label: BirthYear });
  await page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();
  await page.getByRole('checkbox', { name: 'Receive special offers from our partners!' }).check();
  await page.locator('#first_name').fill(name[0]);
  await page.locator('#last_name').fill(name[1]);
  await page.locator('#company').fill(companyName);
  await page.locator('#address1').fill(Address);
  await page.locator('#address2').fill(Address2);
  await page.getByRole('combobox', { name: 'Country' }).selectOption({ label: Country });
  await page.locator('#state').fill(State);
  await page.locator('#city').fill(City);
  await page.locator('#zipcode').fill(Zipcode);
  await page.locator('#mobile_number').fill(mobileNumber);
  await page.getByRole('button', { name: 'Create Account' }).click();

  //verift account was created
  await expect(await page.getByText('Account Created!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(await page.getByText(`Logged in as ${name[0]}`)).toBeVisible();

  //delete account and verify it
  await page.getByRole("link",{name: " Delete Account"}).click();
  await expect(await page.getByText('Account Deleted!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(await page.getByRole('link', { name: 'Signup / Login' })).toBeVisible();
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

test('Test Case 2: Login User with correct email and password', async ({ page }) => {
  //data
  const email = process.env.VALID_EMAIL || '';
  const password = process.env.VALID_PASSWORD || '';
  const name = 'vlad';

  //goto
  await page.goto('/');
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await expect(await page.getByText('Login to your account')).toBeVisible();

  //fill login form
  const loginForm = await page.locator('form[action="/login"]');
  await loginForm.getByPlaceholder('Email Address').fill(email);
  await loginForm.getByPlaceholder('Password').fill(password);
  await loginForm.getByRole('button', { name: 'Login' }).click();

  //verify login
  await expect(await page.getByText(`Logged in as ${name}`)).toBeVisible();
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

test('Test Case 3: Login User with incorrect email and password', async ({ page }) => {
  //data
  const email = 'max12341@gmail.com';
  const password = process.env.VALID_PASSWORD || '';

  //goto
  await page.goto('/');
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await expect(page.getByText('Login to your account')).toBeVisible();

  //fill login form
  const loginForm = await page.locator('form[action="/login"]');
  await loginForm.getByPlaceholder('Email Address').fill(email);
  await loginForm.getByPlaceholder('Password').fill(password);
  await loginForm.getByRole('button', { name: 'Login' }).click();

  await expect(await page.getByText("Your email or password is incorrect!")).toBeVisible();
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

test('Test Case 4: Logout User', async ({ page }) => {
  //data
  const email = process.env.VALID_EMAIL || '';
  const password = process.env.VALID_PASSWORD || '';
  const name = 'vlad';

  //goto
  await page.goto('/');
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await expect(await page.getByText('Login to your account')).toBeVisible();

  //fill login form
  const loginForm = await page.locator('form[action="/login"]');
  await loginForm.getByPlaceholder('Email Address').fill(email);
  await loginForm.getByPlaceholder('Password').fill(password);
  await loginForm.getByRole('button', { name: 'Login' }).click();

  //verify login
  await expect(await page.getByText(`Logged in as ${name}`)).toBeVisible();
  
  //logout
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(await page.getByRole('link', { name: 'Signup / Login' })).toBeVisible();
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

test('Test Case 5: Register User with existing email', async ({ page }) => {
  //data
  const name = ['Max', 'Petrov'];
  const email = process.env.VALID_EMAIL || '';

  //goto
  await page.goto("/");
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await expect(await page.getByText('New User Signup!')).toBeVisible();

  //Fill signup form
  const signupForm = await page.locator('form[action="/signup"]');
  await signupForm.getByPlaceholder('Name').fill(name[0]);
  await signupForm.getByPlaceholder('Email Address').fill(email);
  await signupForm.getByRole('button', { name: 'Signup' }).click();

  await expect(await page.getByText("Email Address already exist!")).toBeVisible();
});

