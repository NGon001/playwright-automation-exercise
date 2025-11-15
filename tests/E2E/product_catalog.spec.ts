import { test } from '../../Helper/base.ts';
import { getEnv } from '../../Helper/tools.ts';

test.describe("E2E Product & Catalog", () =>{
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

  test('C45 Verify All Products and product detail page', async ({ homePage, productsPage, productPage }) => {
    await homePage.gotoProductsPage();
    await productsPage.assertions.expectProductsTextIsVissible();
    await productsPage.assertions.expectProductsExist();
    await productsPage.actions.clickViewProductButtonByIndex(0);

    await productPage.assertions.expectThatProductInformationIsVisible();
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

  test('C46 Search Products', async ({ homePage, productsPage, productPage}) => {
    //data
    const productsNames = ["dress","top","tshirt"]; //keyWords

    //go through all productsNames
    for(const productsName of productsNames){
      //open ProductsPage
      await homePage.gotoProductsPage();

      //Verefying page loaded and search products by products name (keyWord)
      await productsPage.assertions.expectProductsTextIsVissible();
      await productsPage.actions.searchProducts(productsName);
      await productsPage.assertions.expectSearchedProductsComplited();

      //saved links for products when name is not include keyword
      const productLinks = await productsPage.actions.getLinksOfProductsThatDoNotMatchKeyword(productsName);

      //go through all products links and check if category include keyWord
      for(const productLink of productLinks){
        await productsPage.actions.gotoProduct(productLink);
        await productPage.assertions.expectMatchingCategory(productsName);
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

  test('C47 View Category Products', async ({ homePage}) => {
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

  test('C49 View & Cart Brand Products', async ({ homePage,productsPage}) => {
    //data
    const WomantCategory = { category: "Women", subCategory: "Dress" };
    const KidstCategory = { category: "Kids", subCategory: "Tops & Shirts" };
    const MentCategory = { category: "Men", subCategory: "Tshirts" };


    await homePage.gotoProductsPage();
    await productsPage.actions.clickSubCategoryOfCategory(WomantCategory.category,WomantCategory.subCategory); // verify text like "WOMEN - TOPS PRODUCTS" is inside of function
    await productsPage.actions.clickSubCategoryOfCategory(KidstCategory.category, KidstCategory.subCategory); // verify text like "WOMEN - TOPS PRODUCTS" is inside of function
    await productsPage.actions.clickSubCategoryOfCategory(MentCategory.category, MentCategory.subCategory); // verify text like "WOMEN - TOPS PRODUCTS" is inside of function
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

  test('C50 Add review on product', async ({ homePage,productsPage,productPage}) => {
    const message = "Test review message.";

    await homePage.gotoProductsPage();
    await productsPage.assertions.expectProductsTextIsVissible();
    await productsPage.assertions.expectProductsExist();
    await productsPage.actions.clickViewProductButtonByIndex(0);

    await productPage.assertions.expectWriteReviewTextVissible();
    await productPage.actions.fillReviewForm(await getEnv("REGISTER_NAME_FIRST"),await getEnv("REGISTER_NAME_LAST"),await getEnv("VALID_LOGIN_EMAIL"),message);
    await productPage.actions.clickReviewSubmitButton();
  });
});