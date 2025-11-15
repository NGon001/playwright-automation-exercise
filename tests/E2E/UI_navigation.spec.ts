import { test } from '../../Helper/base.ts';

test.describe("E2E UI & Navigation", () => {
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

  test('C48 Verify Test Cases Page', async ({ homePage,testCasesPage }) => {
    await homePage.gotoTestCasesPage();
    await testCasesPage.assertions.expectTestCasePageTextVisible();
  });

});