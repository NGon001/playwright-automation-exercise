import { test, Methods } from '../../Helper/base.ts';
import { generateRandomEmail, getEnv } from '../../Helper/tools.js';

test.describe("E2E Checkout Flow", () => {
  //product data
  const productIndex = 0;
  const descriptionMessage = "This is test description message.";

  test.beforeEach(async ({ homePage }) => {
    //goto
    await homePage.goto();
    await homePage.assertions.expectPageLoaded();   
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
  test('C40 Place Order: Register while Checkout', async ({ homePage,productsPage,cartPage,signUp_LoginPage,signUpPage,accountCreatedPage,paymentPage,accountDeletePage, authorizationAPI}) => {
    const email = await generateRandomEmail();
    let authorized = false;

    await homePage.actions.clickProductsPageButton();
    await productsPage.assertions.expectProductsTextIsVissible();
    await productsPage.assertions.expectProductsExist();
    const ProductInfo = await productsPage.actions.clickProductAddToCartButtonByIndex(productIndex);
    await productsPage.actions.clickViewCartButton();

    await cartPage.assertions.expectProductInfoByIndex(productIndex,ProductInfo.Name,ProductInfo.Price,ProductInfo.Quantity);
    await cartPage.actions.clickProcessButton(authorized);
    await cartPage.actions.clickRegisterAndLoginButton();

    //Fill signup form
    await authorizationAPI.POST_createAccount(
      Methods.POST,
      await getEnv("REGISTER_NAME_FIRST"),
      email,
      await getEnv("REGISTER_PASSWORD"),
      await getEnv("REGISTER_TITLE"),
      await getEnv("REGISTER_BIRTH_DAY"),
      await getEnv("REGISTER_BIRTH_MONTH"),
      await getEnv("REGISTER_BIRTH_YEAR"),
      await getEnv("REGISTER_NAME_FIRST"),
      await getEnv("REGISTER_NAME_LAST"),
      await getEnv("REGISTER_COMPANY_NAME"),
      await getEnv("REGISTER_ADDRESS"),
      await getEnv("REGISTER_ADDRESS2"),
      await getEnv("REGISTER_COUNTRY"),
      await getEnv("REGISTER_ZIPCODE"),
      await getEnv("REGISTER_STATE"),
      await getEnv("REGISTER_CITY"),
      await getEnv("REGISTER_MOBILE_NUMBER")
    );

    await signUp_LoginPage.actions.fillLoginForm(email,await getEnv("REGISTER_PASSWORD"));
    await signUp_LoginPage.actions.clickLoginButton();

    authorized = true;

    await homePage.assertions.expectPageLoaded();
    await homePage.assertions.expectLoggedInNameIsVisible(await getEnv("REGISTER_NAME_FIRST"));
    await homePage.actions.clickCartButton();

    await cartPage.assertions.expectProductInfoByIndex(productIndex,ProductInfo.Name,ProductInfo.Price,ProductInfo.Quantity);
    await cartPage.actions.clickProcessButton(authorized);

    //This assertions will fail, because of the bug on the site. When you register with API, the title is free text field, and you can put anything there.
    //When we put Mr. or Mrs. during registration, it is saved as is, and Add additional dot on the end. So in the end we have "Mr.." or "Mrs.."
    //Anyway you can put any value there, wich is should be limited to Mr. or Mrs. only. Also it should check if it is already goes with dot or not.
    //
    //    Expected: "Mr. Max Petrov"
    //    Received: "Mr.. Max Petrov"
    //
    //--------------------------------
    await cartPage.assertions.expectAddress(
      "delivery",
      await getEnv("REGISTER_TITLE"),
      await getEnv("REGISTER_NAME_FIRST"),
      await getEnv("REGISTER_NAME_LAST"),
      await getEnv("REGISTER_ADDRESS"),
      await getEnv("REGISTER_ADDRESS2"),
      await getEnv("REGISTER_COUNTRY"),
      await getEnv("REGISTER_STATE"),
      await getEnv("REGISTER_CITY"),
      await getEnv("REGISTER_ZIPCODE"),
      await getEnv("REGISTER_COMPANY_NAME"),
      await getEnv("REGISTER_MOBILE_NUMBER")
    );
    await cartPage.assertions.expectAddress(
      "billing",
      await getEnv("REGISTER_TITLE"),
      await getEnv("REGISTER_NAME_FIRST"),
      await getEnv("REGISTER_NAME_LAST"),
      await getEnv("REGISTER_ADDRESS"),
      await getEnv("REGISTER_ADDRESS2"),
      await getEnv("REGISTER_COUNTRY"),
      await getEnv("REGISTER_STATE"),
      await getEnv("REGISTER_CITY"),
      await getEnv("REGISTER_ZIPCODE"),
      await getEnv("REGISTER_COMPANY_NAME"),
      await getEnv("REGISTER_MOBILE_NUMBER")
    );
    //--------------------------------
    
    await cartPage.actions.inputDescriptionMessage(descriptionMessage);
    await cartPage.actions.clickPlaceOrderButton();

    await paymentPage.assertions.expectPageLoaded();
    await paymentPage.actions.fillPaymentForm(
      await getEnv("REGISTER_NAME_FIRST"),
      await getEnv("REGISTER_NAME_LAST"),
      await getEnv("CARD_NUMBER"),
      await getEnv("CARD_CVC"),
      await getEnv("CARD_EXPIRY_MONTH"),
      await getEnv("CARD_EXPIRY_YEAR")
    );
    await paymentPage.actions.clickPayButton();
    await paymentPage.assertions.expectOrderPlaced();
    await paymentPage.actions.clickContinueButton();

    //delete account and verify it
    await homePage.assertions.expectHomePageItemsLoaded();
    await homePage.actions.clickDeleteAccount();
    await accountDeletePage.assertions.expectAccountDeletedTextVisible();
    await accountDeletePage.actions.clickContinueButton();
    await homePage.assertions.expectPageLoaded();
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

  test('C41 Place Order: Register before Checkout', async ({ homePage,productsPage,cartPage,signUp_LoginPage,signUpPage,accountCreatedPage,paymentPage,accountDeletePage, authorizationAPI}) => {
    const email = await generateRandomEmail();
    let authorized = false;

    await authorizationAPI.POST_createAccount(
      Methods.POST,
      await getEnv("REGISTER_NAME_FIRST"),
      email,
      await getEnv("REGISTER_PASSWORD"),
      await getEnv("REGISTER_TITLE"),
      await getEnv("REGISTER_BIRTH_DAY"),
      await getEnv("REGISTER_BIRTH_MONTH"),
      await getEnv("REGISTER_BIRTH_YEAR"),
      await getEnv("REGISTER_NAME_FIRST"),
      await getEnv("REGISTER_NAME_LAST"),
      await getEnv("REGISTER_COMPANY_NAME"),
      await getEnv("REGISTER_ADDRESS"),
      await getEnv("REGISTER_ADDRESS2"),
      await getEnv("REGISTER_COUNTRY"),
      await getEnv("REGISTER_ZIPCODE"),
      await getEnv("REGISTER_STATE"),
      await getEnv("REGISTER_CITY"),
      await getEnv("REGISTER_MOBILE_NUMBER")
    )

    await homePage.actions.clickSignUpAndLoginLink();

    await signUp_LoginPage.actions.fillLoginForm(email,await getEnv("REGISTER_PASSWORD"));
    await signUp_LoginPage.actions.clickLoginButton();

    await homePage.assertions.expectLoggedInNameIsVisible(await getEnv("REGISTER_NAME_FIRST"));
    authorized = true;

    await homePage.actions.clickProductsPageButton();

    await productsPage.assertions.expectProductsTextIsVissible();
    await productsPage.assertions.expectProductsExist();
    const ProductInfo = await productsPage.actions.clickProductAddToCartButtonByIndex(productIndex);
    await productsPage.actions.clickViewCartButton();

    await cartPage.assertions.expectProductInfoByIndex(productIndex,ProductInfo.Name,ProductInfo.Price,ProductInfo.Quantity);
    await cartPage.actions.clickProcessButton(authorized);

    //This assertions will fail, because of the bug on the site. When you register with API, the title is free text field, and you can put anything there.
    //When we put Mr. or Mrs. during registration, it is saved as is, and Add additional dot on the end. So in the end we have "Mr.." or "Mrs.."
    //Anyway you can put any value there, wich is should be limited to Mr. or Mrs. only. Also it should check if it is already goes with dot or not.
    //
    //    Expected: "Mr. Max Petrov"
    //    Received: "Mr.. Max Petrov"
    //
    //--------------------------------

    await cartPage.assertions.expectAddress(
      "delivery",
      await getEnv("REGISTER_TITLE"),
      await getEnv("REGISTER_NAME_FIRST"),
      await getEnv("REGISTER_NAME_LAST"),
      await getEnv("REGISTER_ADDRESS"),
      await getEnv("REGISTER_ADDRESS2"),
      await getEnv("REGISTER_COUNTRY"),
      await getEnv("REGISTER_STATE"),
      await getEnv("REGISTER_CITY"),
      await getEnv("REGISTER_ZIPCODE"),
      await getEnv("REGISTER_COMPANY_NAME"),
      await getEnv("REGISTER_MOBILE_NUMBER")
    );
    await cartPage.assertions.expectAddress(
      "billing",
      await getEnv("REGISTER_TITLE"),
      await getEnv("REGISTER_NAME_FIRST"),
      await getEnv("REGISTER_NAME_LAST"),
      await getEnv("REGISTER_ADDRESS"),
      await getEnv("REGISTER_ADDRESS2"),
      await getEnv("REGISTER_COUNTRY"),
      await getEnv("REGISTER_STATE"),
      await getEnv("REGISTER_CITY"),
      await getEnv("REGISTER_ZIPCODE"),
      await getEnv("REGISTER_COMPANY_NAME"),
      await getEnv("REGISTER_MOBILE_NUMBER")
    );
    //--------------------------------

    await cartPage.actions.inputDescriptionMessage(descriptionMessage);
    await cartPage.actions.clickPlaceOrderButton();

    await paymentPage.assertions.expectPageLoaded();
    await paymentPage.actions.fillPaymentForm(
      await getEnv("REGISTER_NAME_FIRST"),
      await getEnv("REGISTER_NAME_LAST"),
      await getEnv("CARD_NUMBER"),
      await getEnv("CARD_CVC"),
      await getEnv("CARD_EXPIRY_MONTH"),
      await getEnv("CARD_EXPIRY_YEAR")
    );
    await paymentPage.actions.clickPayButton();
    await paymentPage.assertions.expectOrderPlaced();
    await paymentPage.actions.clickContinueButton();

    //delete account and verify it
    await homePage.assertions.expectHomePageItemsLoaded();
    await homePage.actions.clickDeleteAccount();
    await accountDeletePage.assertions.expectAccountDeletedTextVisible();
    await accountDeletePage.actions.clickContinueButton();
    await homePage.assertions.expectPageLoaded();
  });
});