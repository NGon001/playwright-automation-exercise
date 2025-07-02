import { test } from '../Helper/base.ts';


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

  test('C2285 12: Add Products in Cart', async ({ homePage,productsPage,cartPage }) => {
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

  test('C2286 Verify Product quantity in Cart', async ({ homePage,productPage,cartPage }) => {
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

  test('C2287 Remove Products From Cart', async ({ homePage,cartPage}) => {
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

  test('C2288 Add to cart from Recommended items', async ({ homePage, cartPage }) => {
    await homePage.verifyRecomendedItemsTextVisible();
    const productInfo = await homePage.clickAddToCartRecomendedItemsByIndex(0);
    await homePage.clickViewCartButton();

    await cartPage.checkProductExistByName(productInfo.name);
  });
  
});
