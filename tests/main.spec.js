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

test.describe("Authorization tests", () => {
  test.beforeEach(async ({ homePage, signUp_LoginPage }) => {
    //goto
    await homePage.goto();
    await homePage.checkHomePageLoad();
    await homePage.gotoSignUpAndLoginPage();
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

  test('Test Case 1: Register User', async ({ homePage, signUp_LoginPage,signUpPage,accountCreatedPage,accountDeletePage }) => {
    const email = await generateRandomEmail();
    //Fill signup form
    await signUp_LoginPage.fillStartSignUpForm(process.env.REGISTER_NAME_FIRST,email);
    await signUp_LoginPage.clickSignUpButton();

    //Fill detailed signup formr
    await signUpPage.checkDataInForm(process.env.REGISTER_NAME_FIRST,email);
    await signUpPage.fillSignUpForm(process.env.REGISTER_TITLE,process.env.REGISTER_NAME_FIRST,process.env.REGISTER_NAME_LAST,process.env.REGISTER_PASSWORD,process.env.REGISTER_BIRTH_DAY,process.env.REGISTER_BIRTH_MONTH,process.env.REGISTER_BIRTH_YEAR,process.env.REGISTER_COMPANY_NAME,process.env.REGISTER_ADDRESS,process.env.REGISTER_ADDRESS2,process.env.REGISTER_COUNTRY,process.env.REGISTER_STATE,process.env.REGISTER_CITY,process.env.REGISTER_ZIPCODE,process.env.REGISTER_MOBILE_NUMBER);
    await signUpPage.clickCreateAccountButton();

    //verift account was created
    await accountCreatedPage.checkAccountCreationMessage();
    await accountCreatedPage.clickContinueButton();
    await homePage.checkLoggedInName(process.env.REGISTER_NAME_FIRST);

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

  test('Test Case 3: Login User with incorrect email and password', async ({signUp_LoginPage }) => {
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

  test('Test Case 4: Logout User', async ({ homePage, signUp_LoginPage }) => {
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

  test('Test Case 5: Register User with existing email', async ({ signUp_LoginPage }) => {
    //Fill signup form
    await signUp_LoginPage.fillStartSignUpForm(process.env.REGISTER_NAME_FIRST,process.env.VALID_LOGIN_EMAIL);
    await signUp_LoginPage.clickSignUpButton();

    await signUp_LoginPage.checkExistedDataMessage();
  });

});

test.describe("Checkout Flow", () => {
  //product data
  const productIndex = 0;
  const Quantity = 1;
  const descriptionMessage = "This is test description message.";

  test.beforeEach(async ({ homePage }) => {
    //goto
    await homePage.goto();
    await homePage.checkHomePageLoad();   
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
    const email = await generateRandomEmail();
    let authorized = false;

    await homePage.gotoProductsPage();
    await productsPage.checkIfAllProductsTextIsVissible();
    await productsPage.checkIfProductsExist();
    const ProductInfo = await productsPage.clickProductAddToCartButtonByIndex(productIndex);
    await productsPage.clickViewCartButton();

    await cartPage.checkProductInfoByIndex(productIndex,ProductInfo.name,ProductInfo.price,Quantity);
    await cartPage.clickProcessButton(authorized);
    await cartPage.clickRegisterAndLoginButton();

    //Fill signup form
    await signUp_LoginPage.fillStartSignUpForm(process.env.REGISTER_NAME_FIRST,email);
    await signUp_LoginPage.clickSignUpButton();

    //Fill detailed signup formr
    await signUpPage.checkDataInForm(process.env.REGISTER_NAME_FIRST,email);
    await signUpPage.fillSignUpForm(process.env.REGISTER_TITLE,process.env.REGISTER_NAME_FIRST,process.env.REGISTER_NAME_LAST,process.env.REGISTER_PASSWORD,process.env.REGISTER_BIRTH_DAY,process.env.REGISTER_BIRTH_MONTH,process.env.REGISTER_BIRTH_YEAR,process.env.REGISTER_COMPANY_NAME,process.env.REGISTER_ADDRESS,process.env.REGISTER_ADDRESS2,process.env.REGISTER_COUNTRY,process.env.REGISTER_STATE,process.env.REGISTER_CITY,process.env.REGISTER_ZIPCODE,process.env.REGISTER_MOBILE_NUMBER);
    await signUpPage.clickCreateAccountButton();

    //verift account was created
    await accountCreatedPage.checkAccountCreationMessage();
    await accountCreatedPage.clickContinueButton();
    authorized = true;

    await homePage.verifyHomePageItemsLoaded();
    await homePage.checkLoggedInName(process.env.REGISTER_NAME_FIRST);
    await homePage.gotoCart();

    await cartPage.checkProductInfoByIndex(productIndex,ProductInfo.name,ProductInfo.price,Quantity);
    await cartPage.clickProcessButton(authorized);
    await cartPage.verifyAddress("delivery",process.env.REGISTER_TITLE,process.env.REGISTER_NAME_FIRST,process.env.REGISTER_NAME_LAST,process.env.REGISTER_ADDRESS,process.env.REGISTER_ADDRESS2,process.env.REGISTER_COUNTRY,process.env.REGISTER_STATE,process.env.REGISTER_CITY,process.env.REGISTER_ZIPCODE,process.env.REGISTER_COMPANY_NAME,process.env.REGISTER_MOBILE_NUMBER);
    await cartPage.verifyAddress("billing",process.env.REGISTER_TITLE,process.env.REGISTER_NAME_FIRST,process.env.REGISTER_NAME_LAST,process.env.REGISTER_ADDRESS,process.env.REGISTER_ADDRESS2,process.env.REGISTER_COUNTRY,process.env.REGISTER_STATE,process.env.REGISTER_CITY,process.env.REGISTER_ZIPCODE,process.env.REGISTER_COMPANY_NAME,process.env.REGISTER_MOBILE_NUMBER);
    await cartPage.inputDescriptionMessage(descriptionMessage);
    await cartPage.clickPlaceOrderButton();

    await paymentPage.verifyPageLoaded();
    await paymentPage.fillPaymentForm(process.env.REGISTER_NAME_FIRST,process.env.REGISTER_NAME_LAST,process.env.CARD_NUMBER,process.env.CARD_CVC,process.env.CARD_EXPIRY_MONTH,process.env.CARD_EXPIRY_YEAR);
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
    const email = await generateRandomEmail();
    let authorized = false;

    //goto
    await homePage.gotoSignUpAndLoginPage();
    await signUp_LoginPage.checkSignUpText();

    //Fill signup form
    await signUp_LoginPage.fillStartSignUpForm(process.env.REGISTER_NAME_FIRST,email);
    await signUp_LoginPage.clickSignUpButton();

    //Fill detailed signup formr
    await signUpPage.checkDataInForm(process.env.REGISTER_NAME_FIRST,email);
    await signUpPage.fillSignUpForm(process.env.REGISTER_TITLE,process.env.REGISTER_NAME_FIRST,process.env.REGISTER_NAME_LAST,process.env.REGISTER_PASSWORD,process.env.REGISTER_BIRTH_DAY,process.env.REGISTER_BIRTH_MONTH,process.env.REGISTER_BIRTH_YEAR,process.env.REGISTER_COMPANY_NAME,process.env.REGISTER_ADDRESS,process.env.REGISTER_ADDRESS2,process.env.REGISTER_COUNTRY,process.env.REGISTER_STATE,process.env.REGISTER_CITY,process.env.REGISTER_ZIPCODE,process.env.REGISTER_MOBILE_NUMBER);
    await signUpPage.clickCreateAccountButton();

    //verift account was created
    await accountCreatedPage.checkAccountCreationMessage();
    await accountCreatedPage.clickContinueButton();
    await homePage.checkLoggedInName(process.env.REGISTER_NAME_FIRST);
    authorized = true;

    await homePage.gotoProductsPage();

    await productsPage.checkIfAllProductsTextIsVissible();
    await productsPage.checkIfProductsExist();
    const ProductInfo = await productsPage.clickProductAddToCartButtonByIndex(productIndex);
    await productsPage.clickViewCartButton();

    await cartPage.checkProductInfoByIndex(productIndex,ProductInfo.name,ProductInfo.price,Quantity);
    await cartPage.clickProcessButton(authorized);
    await cartPage.verifyAddress("delivery",process.env.REGISTER_TITLE,process.env.REGISTER_NAME_FIRST,process.env.REGISTER_NAME_LAST,process.env.REGISTER_ADDRESS,process.env.REGISTER_ADDRESS2,process.env.REGISTER_COUNTRY,process.env.REGISTER_STATE,process.env.REGISTER_CITY,process.env.REGISTER_ZIPCODE,process.env.REGISTER_COMPANY_NAME,process.env.REGISTER_MOBILE_NUMBER);
    await cartPage.verifyAddress("billing",process.env.REGISTER_TITLE,process.env.REGISTER_NAME_FIRST,process.env.REGISTER_NAME_LAST,process.env.REGISTER_ADDRESS,process.env.REGISTER_ADDRESS2,process.env.REGISTER_COUNTRY,process.env.REGISTER_STATE,process.env.REGISTER_CITY,process.env.REGISTER_ZIPCODE,process.env.REGISTER_COMPANY_NAME,process.env.REGISTER_MOBILE_NUMBER);
    await cartPage.inputDescriptionMessage(descriptionMessage);
    await cartPage.clickPlaceOrderButton();

    await paymentPage.verifyPageLoaded();
    await paymentPage.fillPaymentForm(process.env.REGISTER_NAME_FIRST,process.env.REGISTER_NAME_LAST,process.env.CARD_NUMBER,process.env.CARD_CVC,process.env.CARD_EXPIRY_MONTH,process.env.CARD_EXPIRY_YEAR);
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
});

test.describe("Cart Functionality", () =>{
  test.beforeEach(async ({ homePage }) =>{
    //goto
    await homePage.goto();
    await homePage.checkHomePageLoad();
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


    const productInfo = await homePage.clickViewProductButtonByIndex(productIndex);

    await productPage.setQuantity(Quantity);
    await productPage.clickAddToCartButton();
    await productPage.clickViewCartButton();

    await cartPage.checkProductInfoByIndex(productIndex,productInfo.name,productInfo.price,Quantity);
  });

  /*
  Test Case 17: Remove Products From Cart
  1. Launch browser
  2. Navigate to url 'http://automationexercise.com'
  3. Verify that home page is visible successfully
  4. Add products to cart
  5. Click 'Cart' button
  6. Verify that cart page is displayed
  7. Click 'X' button corresponding to particular product
  8. Verify that product is removed from the cart

  test case was changed to verify that cart delete product button will work with multiple products
  */

  test('Test Case 17: Remove Products From Cart', async ({ homePage,cartPage}) => {
    const firstProductInfo = await homePage.clickProductAddToCartButtonByIndex(0);
    await homePage.clickContinueShoppingButton();
    const secondProductInfo = await homePage.clickProductAddToCartButtonByIndex(1);
    await homePage.clickViewCartButton();
    await homePage.gotoCart();

    //delete secondProduct
    await cartPage.checkIfProcessButtonVisisble();
    await cartPage.verifyProductImageWasLoadedByName(secondProductInfo.name);
    await cartPage.deleteProductByName(secondProductInfo.name);
    await cartPage.verifyProductExistOrNot(false,secondProductInfo.name);

    //delete firstProduct
    await cartPage.checkIfProcessButtonVisisble();
    await cartPage.verifyProductImageWasLoadedByName(firstProductInfo.name);
    await cartPage.deleteProductByName(firstProductInfo.name);
    await cartPage.verifyProductExistOrNot(false,firstProductInfo.name);
  });

  /*
Test Case 20: Search Products and Verify Cart After Login
1. Launch browser
2. Navigate to url 'http://automationexercise.com'
3. Click on 'Products' button
4. Verify user is navigated to ALL PRODUCTS page successfully
5. Enter product name in search input and click search button
6. Verify 'SEARCHED PRODUCTS' is visible
7. Verify all the products related to search are visible
8. Add those products to cart
9. Click 'Cart' button and verify that products are visible in cart
10. Click 'Signup / Login' button and submit login details
11. Again, go to Cart page
12. Verify that those products are visible in cart after login as well
*/

/*//cant be parallel, because of cart check (login) //coment for now because i cant test it with others
this test is only possible with regester new user
//If you have multiple projects and the worker count is not 1, they will always run in parallel. Usually we recommend designing tests that they can run in parallel and are not depended on each other.
test.describe.serial('Cart and Search Tests', () => {
test('Test Case 20: Search Products and Verify Cart After Login', async ({ homePage,productsPage,productPage,cartPage,signUp_LoginPage}) => {
  //data
  const productsNames = ["dress"]; //keyWords

  //data login
  const email = process.env.VALID_EMAIL || '';
  const password = process.env.VALID_PASSWORD || '';
  const name = ["vlad", "Petrov"];


  //goto
  await homePage.goto();
  await homePage.checkHomePageLoad();

  //go through all productsNames
  for(const productsName of productsNames){
    let productsInfos = [];
    //open ProductsPage
    await homePage.gotoProductsPage();

    //Verefying page loaded and search products by products name (keyWord)
    await productsPage.checkIfAllProductsTextIsVissible();
    await productsPage.searchProducts(productsName);
    await productsPage.verefyThatProductsSearchComplited();

    const productCount = await productsPage.getProductCount();
    for(let i = 0; i < productCount; i++){
      productsInfos.push(await productsPage.clickProductAddToCartButtonByIndex(i));
      await productsPage.clickContinueShoppingButton();
    }

    //saved links for products when name is not include keyword
    const productLinks = await productsPage.getLinksOfProductsThatDoNotMatchKeyword(productsName);

    //go through all products links and check if category include keyWord
    for(const productLink of productLinks){
      await productsPage.gotoProduct(productLink);
      await productPage.verifyMatchingCategory(productsName);
    }

    await productPage.gotoCart();
    await cartPage.checkIfProcessButtonVisisble();
    let countOfProductsInCart = await cartPage.getProductsCount();
    await cartPage.checkValues(countOfProductsInCart,productCount);
    for (let i = 0; i < countOfProductsInCart; i++){
      await cartPage.verifyProductExistOrNot(true,(await productsInfos[i]).name);
    }

    await cartPage.gotoSignUpAndLoginPage();
    await signUp_LoginPage.checkLoginText();

    //fill login form
    await signUp_LoginPage.fillLoginForm(email,password);
    await signUp_LoginPage.clickLoginButton();

    //verify login
    await homePage.checkLoggedInName(name);

    await homePage.gotoCart();
    await cartPage.checkIfProcessButtonVisisble();
    const countOfProductsInCart2 = await cartPage.getProductsCount();
    await cartPage.checkValues(countOfProductsInCart,countOfProductsInCart2);
    for (let i = 0; i < countOfProductsInCart2; i++){
      await cartPage.verifyProductExistOrNot(true,(await productsInfos[i]).name);
      await cartPage.checkIfProcessButtonVisisble();
      await cartPage.verifyProductImageWasLoadedByName((await productsInfos[i]).name);
      await cartPage.deleteProductByName((await productsInfos[i]).name);
      await cartPage.verifyProductExistOrNot(false,(await productsInfos[i]).name);
    }
  }
});
});
*/



  /*
  Test Case 22: Add to cart from Recommended items
  1. Launch browser
  2. Navigate to url 'http://automationexercise.com'
  3. Scroll to bottom of page
  4. Verify 'RECOMMENDED ITEMS' are visible
  5. Click on 'Add To Cart' on Recommended product
  6. Click on 'View Cart' button
  7. Verify that product is displayed in cart page
  */

  test('Test Case 22: Add to cart from Recommended items', async ({ homePage, cartPage }) => {
    await homePage.verifyRecomendedItemsTextVisible();
    const productInfo = await homePage.clickAddToCartRecomendedItemsByIndex(0);
    await homePage.clickViewCartButton();

    await cartPage.checkProductExistByName(productInfo.name);
  });
  
});

test.describe("Product & Catalog", () =>{
  test.beforeEach(async ({ homePage }) =>{
    //goto
    await homePage.goto();
    await homePage.checkHomePageLoad();
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
    await homePage.gotoProductsPage();
    await productsPage.checkIfAllProductsTextIsVissible();
    await productsPage.checkIfProductsExist();
    await productsPage.clickViewProductButtonByIndex(0);

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
  Test Case 18: View Category Products
  1. Launch browser
  2. Navigate to url 'http://automationexercise.com'
  3. Verify that categories are visible on left side bar
  4. Click on 'Women' category
  5. Click on any category link under 'Women' category, for example: Dress
  6. Verify that category page is displayed and confirm text 'WOMEN - TOPS PRODUCTS'
  7. On left side bar, click on any sub-category link of 'Men' category
  8. Verify that user is navigated to that category page
  */

  test('Test Case 18: View Category Products', async ({ homePage}) => {
    //data
    const WomantCategory = { category: "Women", subCategory: "Dress" };
    const KidstCategory = { category: "Kids", subCategory: "Tops & Shirts" };
    const MentCategory = { category: "Men", subCategory: "Tshirts" };

    await homePage.clickSubCategoryOfCategory(WomantCategory.category,WomantCategory.subCategory); // verify text like "WOMEN - TOPS PRODUCTS" is inside of function
    await homePage.clickSubCategoryOfCategory(KidstCategory.category, KidstCategory.subCategory); // verify text like "WOMEN - TOPS PRODUCTS" is inside of function
    await homePage.clickSubCategoryOfCategory(MentCategory.category, MentCategory.subCategory); // verify text like "WOMEN - TOPS PRODUCTS" is inside of function
  });

  /*
  Test Case 19: View & Cart Brand Products
  1. Launch browser
  2. Navigate to url 'http://automationexercise.com'
  3. Click on 'Products' button
  4. Verify that Brands are visible on left side bar
  5. Click on any brand name
  6. Verify that user is navigated to brand page and brand products are displayed
  7. On left side bar, click on any other brand link
  8. Verify that user is navigated to that brand page and can see products
  */

  test('Test Case 19: View & Cart Brand Products', async ({ homePage,productsPage}) => {
    //data
    const WomantCategory = { category: "Women", subCategory: "Dress" };
    const KidstCategory = { category: "Kids", subCategory: "Tops & Shirts" };
    const MentCategory = { category: "Men", subCategory: "Tshirts" };


    await homePage.gotoProductsPage();
    await productsPage.clickSubCategoryOfCategory(WomantCategory.category,WomantCategory.subCategory); // verify text like "WOMEN - TOPS PRODUCTS" is inside of function
    await productsPage.clickSubCategoryOfCategory(KidstCategory.category, KidstCategory.subCategory); // verify text like "WOMEN - TOPS PRODUCTS" is inside of function
    await productsPage.clickSubCategoryOfCategory(MentCategory.category, MentCategory.subCategory); // verify text like "WOMEN - TOPS PRODUCTS" is inside of function
  });

  /*
  Test Case 21: Add review on product
  1. Launch browser
  2. Navigate to url 'http://automationexercise.com'
  3. Click on 'Products' button
  4. Verify user is navigated to ALL PRODUCTS page successfully
  5. Click on 'View Product' button
  6. Verify 'Write Your Review' is visible
  7. Enter name, email and review
  8. Click 'Submit' button
  9. Verify success message 'Thank you for your review.'
  */

  test('Test Case 21: Add review on product', async ({ homePage,productsPage,productPage}) => {
    const message = "Test review message.";

    await homePage.gotoProductsPage();
    await productsPage.checkIfAllProductsTextIsVissible();
    await productsPage.checkIfProductsExist();
    await productsPage.clickViewProductButtonByIndex(0);

    await productPage.verifyWriteReviewTextVissible();
    await productPage.fillReviewForm(process.env.REGISTER_NAME_FIRST,process.env.REGISTER_NAME_LAST,process.env.VALID_LOGIN_EMAIL,message);
    await productPage.clickReviewSubmitButton();
  });
});

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

  test('Test Case 6: Contact Us Form', async ({ homePage, contactUsPage }) => {
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

  test('Test Case 10: Verify Subscription in home page', async ({ homePage }) => {
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

  test('Test Case 11: Verify Subscription in Cart page', async ({ homePage,cartPage }) => {
    //goto
    await homePage.gotoCart();
    await cartPage.verifySubscriptionText();

    await cartPage.inputValueToSubscriptionEmailField(process.env.VALID_LOGIN_EMAIL);
  });
});

test.describe("UI & Navigation", () => {
  test.beforeEach(async ({homePage}) =>{
    //goto
    await homePage.goto();
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
    await homePage.gotoTestCasesPage();
    await testCasesPage.verifyPageIsVisible();
  });

});