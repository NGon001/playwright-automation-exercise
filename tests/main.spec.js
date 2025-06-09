import { test } from '../Helper/base.ts';
import {generateRandomEmail} from '../Helper/tools.ts';
import dotenv from 'dotenv';
dotenv.config();

test.beforeEach(async ({ context }) => {
    //await context.route('**/*.{png,jpg,jpeg,svg}', route => route.abort());
    await context.route("**/*", route => {
      route.request().url().startsWith("https://googleads.") ?
      route.abort() : route.continue();
      return;
    })
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
  await homePage.checkHomePageLoad();
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
  await homePage.checkHomePageLoad();
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
  await homePage.checkHomePageLoad();
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

test('Test Case 5: Register User with existing email', async ({ homePage, signUp_LoginPage }) => {
  //data
  const name = ['Max', 'Petrov'];
  const email = process.env.VALID_EMAIL || '';

  //goto
  await homePage.goto();
  await homePage.checkHomePageLoad();
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
  await homePage.checkHomePageLoad();
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

/*
1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click on 'Test Cases' button
5. Verify user is navigated to test cases page successfully
*/

test('Test Case 7: Verify Test Cases Page', async ({ homePage,testCasesPage }) => {
  //goto
  await homePage.goto();
  await homePage.checkHomePageLoad();
  await homePage.gotoTestCasesPage();

  await testCasesPage.verifyPageIsVisible();
});

/*
1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click on 'Products' button
5. Verify user is navigated to ALL PRODUCTS page successfully
6. The products list is visible
7. Click on 'View Product' of first product
8. User is landed to product detail page
9. Verify that detail detail is visible: product name, category, price, availability, condition, brand
 */

test('Test Case 8: Verify All Products and product detail page', async ({ homePage, productsPage, productPage }) => {
  //goto
  await homePage.goto();
  await homePage.checkHomePageLoad();

  await homePage.gotoProductsPage();
  await productsPage.checkIfAllProductsTextIsVissible();
  await productsPage.checkIfProductsExist();
  await productsPage.clickFirstProductViewProductButton();

  await productPage.verifyThatProductInformationIsVisible();
});

/*
1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click on 'Products' button
5. Verify user is navigated to ALL PRODUCTS page successfully
6. Enter product name in search input and click search button
7. Verify 'SEARCHED PRODUCTS' is visible
8. Verify all the products related to search are visible


// Slightly modified Test Case 9 to strengthen the verification of the product search feature.
// For each keyword [e.g., "dress", "top", "tshirt"], the test performs a product search.
// It first checks whether the product names in the search results contain the keyword.
// If a product's name doesn't match, its link is collected for further validation.
// The test then opens product detail pages to verify that the product's category includes the keyword.
// If neither the name nor category matches, the test fails.
*/

test('Test Case 9: Search Products', async ({ homePage, productsPage, productPage}) => {
  //data
  const productsNames = ["dress","top","tshirt"]; //keyWords

  //goto
  await homePage.goto();
  await homePage.checkHomePageLoad();

  //go through all productsNames
  for(const productsName of productsNames){
    //open ProductsPage
    await homePage.gotoProductsPage();

    //Verefying page loaded and search products by products name (keyWord)
    await productsPage.checkIfAllProductsTextIsVissible();
    await productsPage.addwait(2000);
    await productsPage.searchProducts(productsName);
    await productsPage.verefyThatProductsSearchComplited();

    //saved links for products when name is not include keyword
    const productLinks = await productsPage.getLinksOfProductsThatDoNotMatchKeyword(productsName);

    //go through all products links and check if category include keyWord
    for(const productLink of productLinks){
      await productsPage.gotoProduct(productLink);
      await productPage.verifyMatchingCategory(productsName);
    }
  }
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

test('Test Case 10: Verify Subscription in home page', async ({ homePage }) => {
  //data
  const email = process.env.VALID_EMAIL;

  //goto
  await homePage.goto();
  await homePage.checkHomePageLoad();
  await homePage.verifySubscriptionText();

  await homePage.inputValueToSubscriptionEmailField(email);
  await homePage.checkSuccesSubscriptionMessage();
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

test('Test Case 11: Verify Subscription in Cart page', async ({ homePage,cartPage }) => {
  //data
  const email = process.env.VALID_EMAIL;

  //goto
  await homePage.goto();
  await homePage.checkHomePageLoad();

  await homePage.gotoCart();
  await cartPage.verifySubscriptionText();

  await cartPage.inputValueToSubscriptionEmailField(email);
  await cartPage.checkSuccesSubscriptionMessage();
});

/*
Test Case 12: Add Products in Cart 
1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click 'Products' button
5. Hover over first product and click 'Add to cart'
6. Click 'Continue Shopping' button
7. Hover over second product and click 'Add to cart'
8. Click 'View Cart' button
9. Verify both products are added to Cart
10. Verify their prices, quantity and total price
*/

test('Test Case 12: Add Products in Cart', async ({ homePage,productsPage,cartPage }) => {
  //data
  const quantity = 1;

  //goto
  await homePage.goto();
  await homePage.checkHomePageLoad();

  //Go to products page, add first and second product to cart, and click view cart button
  await homePage.gotoProductsPage();
  await productsPage.checkIfAllProductsTextIsVissible();
  const product1 = await productsPage.addToCartProductByIndex(0);
  await productsPage.clickContinueShoppingButton();
  const product2 = await productsPage.addToCartProductByIndex(1);
  await productsPage.clickViewCartButton();

  //I mean you could find product by name like products.locator("tr", {hasText: productName}), but for now it works, because script will add items one by one, I will know order of products
  //verify products information inside cart
  await cartPage.checkProductInfoByIndex(0,product1.name,product1.price,quantity);
  await cartPage.checkProductInfoByIndex(1,product2.name,product2.price,quantity);
});