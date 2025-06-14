import { test } from '../Helper/base.ts';
import { generateRandomEmail } from '../Helper/tools.ts';
import dotenv from 'dotenv';
dotenv.config();

test.beforeEach(async ({ context }) => {
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
  await signUp_LoginPage.checkSignUpText();

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
  await signUp_LoginPage.checkSignUpText();

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
  await productsPage.clickProductViewProductButtonByIndex(0);

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
  const productQuantity = 1;
  //goto
  await homePage.goto();
  await homePage.checkHomePageLoad();
  await homePage.gotoProductsPage();

  await productsPage.checkIfAllProductsTextIsVissible();
  await productsPage.checkIfProductsExist();
  const firstProductInfo = await productsPage.clickProductAddToCartButtonByIndex(0);
  await productsPage.clickContinueShoppingButton();
  const secondProductInfo = await productsPage.clickProductAddToCartButtonByIndex(1);
  await productsPage.clickViewCartButton();

  await cartPage.checkProductInfoByIndex(0,firstProductInfo.name,firstProductInfo.price,productQuantity);
  await cartPage.checkProductInfoByIndex(1,secondProductInfo.name,secondProductInfo.price,productQuantity);
});

/*
Test Case 13: Verify Product quantity in Cart
1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click 'View Product' for any product on home page
5. Verify product detail is opened
6. Increase quantity to 4
7. Click 'Add to cart' button
8. Click 'View Cart' button
9. Verify that product is displayed in cart page with exact quantity
*/

test('Test Case 13: Verify Product quantity in Cart', async ({ homePage,productPage,cartPage }) => {
  //data 
  const Quantity = 4;
  const productIndex = 0;

  //goto
  await homePage.goto();
  await homePage.checkHomePageLoad();
  const productInfo = await homePage.clickViewProductButtonByIndex(productIndex);
  
  await productPage.setQuantity(Quantity);
  await productPage.clickAddToCartButton();
  await productPage.clickViewCartButton();

  await cartPage.checkProductInfoByIndex(productIndex,productInfo.name,productInfo.price,Quantity);
});

/*
Test Case 14: Place Order: Register while Checkout
1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Add products to cart
5. Click 'Cart' button
6. Verify that cart page is displayed
7. Click Proceed To Checkout
8. Click 'Register / Login' button
9. Fill all details in Signup and create account
10. Verify 'ACCOUNT CREATED!' and click 'Continue' button
11. Verify ' Logged in as username' at top
12.Click 'Cart' button
13. Click 'Proceed To Checkout' button
14. Verify Address Details and Review Your Order
15. Enter description in comment text area and click 'Place Order'
16. Enter payment details: Name on Card, Card Number, CVC, Expiration date
17. Click 'Pay and Confirm Order' button
18. Verify success message 'Your order has been placed successfully!'
19. Click 'Delete Account' button
20. Verify 'ACCOUNT DELETED!' and click 'Continue' button
*/
test('Test Case 14: Place Order: Register while Checkout', async ({ homePage,productsPage,cartPage,signUp_LoginPage,signUpPage,accountCreatedPage,paymentPage,accountDeletePage}) => {
  //Profile data
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
  let authorized = false;

  //Card data
  const cardNumber = '4111111111111111'; // Visa test card number
  const cardCVC = '123';
  const cardExpiryMonth = '08';
  const cardExpiryYear = '2028';

  //product data
  const productIndex = 0;
  const Quantity = 1;
  const descriptionMessage = "This is test description message.";

  //goto
  await homePage.goto();
  await homePage.checkHomePageLoad();
  await homePage.gotoProductsPage();

  await productsPage.checkIfAllProductsTextIsVissible();
  await productsPage.checkIfProductsExist();
  const ProductInfo = await productsPage.clickProductAddToCartButtonByIndex(productIndex);
  await productsPage.clickViewCartButton();

  await cartPage.checkProductInfoByIndex(productIndex,ProductInfo.name,ProductInfo.price,Quantity);
  await cartPage.clickProcessButton(authorized);
  await cartPage.clickRegisterAndLoginButton();

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
  authorized = true;

  await homePage.verifyHomePageItemsLoaded();
  await homePage.checkLoggedInName(name);
  await homePage.gotoCart();

  await cartPage.checkProductInfoByIndex(productIndex,ProductInfo.name,ProductInfo.price,Quantity);
  await cartPage.clickProcessButton(authorized);
  await cartPage.verifyDeliveryAddress(Title,name,Address,Address2,Country,State,City,Zipcode,companyName,mobileNumber);
  await cartPage.verifyBillingAddress(Title,name,Address,Address2,Country,State,City,Zipcode,companyName,mobileNumber);
  await cartPage.inputDescriptionMessage(descriptionMessage);
  await cartPage.clickPlaceOrderButton();

  await paymentPage.verifyPageLoaded();
  await paymentPage.fillPaymentForm(name,cardNumber,cardCVC,cardExpiryMonth,cardExpiryYear);
  await paymentPage.clickPayButton();
  await paymentPage.verifyOrderPlaced();
  await paymentPage.clickContinueButton();

  //delete account and verify it
  await homePage.verifyHomePageItemsLoaded();
  await homePage.clickDeleteAccount();
  await accountDeletePage.checkAccountDeletedMessage();
  await accountDeletePage.clickContinueButton();
  await homePage.checkHomePageLoad();
});

/*
Test Case 15: Place Order: Register before Checkout
1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Verify that home page is visible successfully
4. Click 'Signup / Login' button
5. Fill all details in Signup and create account
6. Verify 'ACCOUNT CREATED!' and click 'Continue' button
7. Verify ' Logged in as username' at top
8. Add products to cart
9. Click 'Cart' button
10. Verify that cart page is displayed
11. Click Proceed To Checkout
12. Verify Address Details and Review Your Order
13. Enter description in comment text area and click 'Place Order'
14. Enter payment details: Name on Card, Card Number, CVC, Expiration date
15. Click 'Pay and Confirm Order' button
16. Verify success message 'Your order has been placed successfully!'
17. Click 'Delete Account' button
18. Verify 'ACCOUNT DELETED!' and click 'Continue' button
*/

test('Test Case 15: Place Order: Register before Checkout', async ({ homePage,productsPage,cartPage,signUp_LoginPage,signUpPage,accountCreatedPage,paymentPage,accountDeletePage}) => {
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
  let authorized = false;

  //Card data
  const cardNumber = '4111111111111111'; // Visa test card number
  const cardCVC = '123';
  const cardExpiryMonth = '08';
  const cardExpiryYear = '2028';

  //product data
  const productIndex = 0;
  const Quantity = 1;
  const descriptionMessage = "This is test description message.";

  //goto
  await homePage.goto();
  await homePage.checkHomePageLoad();
  await homePage.gotoSignUpAndLoginPage();
  await signUp_LoginPage.checkSignUpText();

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
  authorized = true;

  await homePage.gotoProductsPage();

  await productsPage.checkIfAllProductsTextIsVissible();
  await productsPage.checkIfProductsExist();
  const ProductInfo = await productsPage.clickProductAddToCartButtonByIndex(productIndex);
  await productsPage.clickViewCartButton();

  await cartPage.checkProductInfoByIndex(productIndex,ProductInfo.name,ProductInfo.price,Quantity);
  await cartPage.clickProcessButton(authorized);
  await cartPage.verifyDeliveryAddress(Title,name,Address,Address2,Country,State,City,Zipcode,companyName,mobileNumber);
  await cartPage.verifyBillingAddress(Title,name,Address,Address2,Country,State,City,Zipcode,companyName,mobileNumber);
  await cartPage.inputDescriptionMessage(descriptionMessage);
  await cartPage.clickPlaceOrderButton();

  await paymentPage.verifyPageLoaded();
  await paymentPage.fillPaymentForm(name,cardNumber,cardCVC,cardExpiryMonth,cardExpiryYear);
  await paymentPage.clickPayButton();
  await paymentPage.verifyOrderPlaced();
  await paymentPage.clickContinueButton();

  //delete account and verify it
  await homePage.verifyHomePageItemsLoaded();
  await homePage.clickDeleteAccount();
  await accountDeletePage.checkAccountDeletedMessage();
  await accountDeletePage.clickContinueButton();
  await homePage.checkHomePageLoad();
});

