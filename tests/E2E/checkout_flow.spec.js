import { test } from '../../Helper/base.ts';
import { generateRandomEmail } from '../../Helper/tools.js';

test.describe("E2E Checkout Flow", () => {
  //product data
  const productIndex = 0;
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
  test('C40 Place Order: Register while Checkout', async ({ homePage,productsPage,cartPage,signUp_LoginPage,signUpPage,accountCreatedPage,paymentPage,accountDeletePage}) => {
    const email = await generateRandomEmail();
    let authorized = false;

    await homePage.gotoProductsPage();
    await productsPage.checkIfAllProductsTextIsVissible();
    await productsPage.checkIfProductsExist();
    const ProductInfo = await productsPage.clickProductAddToCartButtonByIndex(productIndex);
    await productsPage.clickViewCartButton();

    await cartPage.checkProductInfoByIndex(productIndex,ProductInfo.Name,ProductInfo.Price,ProductInfo.Quantity);
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

    await cartPage.checkProductInfoByIndex(productIndex,ProductInfo.Name,ProductInfo.Price,ProductInfo.Quantity);
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

  test('C41 Place Order: Register before Checkout', async ({ homePage,productsPage,cartPage,signUp_LoginPage,signUpPage,accountCreatedPage,paymentPage,accountDeletePage}) => {
    const email = await generateRandomEmail();
    let authorized = false;

    //goto
    await homePage.clickSignUpAndLoginLink();
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

    await cartPage.checkProductInfoByIndex(productIndex,ProductInfo.Name,ProductInfo.Price,ProductInfo.Quantity);
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