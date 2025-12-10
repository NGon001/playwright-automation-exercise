import {test as baseTest} from '@playwright/test';
import {test as apiBaseTest} from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SignUp_LoginPage } from '../pages/SignUp_LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { AccountDeletePage } from '../pages/AccountDeletePage';
import { ContactUsPage } from '../pages/ContactUsPage';
import { TestCasesPage } from '../pages/TestCasesPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { PaymentPage } from '../pages/PaymentPage';
import { AuthorizationAPI } from '../API/Authorization';
import { ProductsAPI } from '../API/Products.ts';
import { blockAds, saveAdditionsAttachments } from './Tools.ts';
import dotenv from 'dotenv';
dotenv.config();

type MyFixtures = {
    homePage: HomePage;
    signUp_LoginPage: SignUp_LoginPage;
    signUpPage: SignUpPage;
    accountCreatedPage: AccountCreatedPage;
    accountDeletePage: AccountDeletePage;
    contactUsPage: ContactUsPage;
    testCasesPage: TestCasesPage;
    productsPage :ProductsPage;
    productPage: ProductPage;
    cartPage: CartPage;
    paymentPage: PaymentPage;
    saveData: void;
    authorizationAPI: AuthorizationAPI;
    productsAPI: ProductsAPI;
}

// To not open browser
export const apiTest = apiBaseTest.extend<MyFixtures>({
    authorizationAPI: async({request},use) => {
        await use(new AuthorizationAPI(request));
    },
    productsAPI: async({request},use) => {
        await use(new ProductsAPI(request));
    },
});

export const test = baseTest.extend<MyFixtures>({

    //Didnt found better way to do it without dublication, if you have idea please share
    //--------------------------------
    authorizationAPI: async({request},use) => {
        await use(new AuthorizationAPI(request));
    },
    productsAPI: async({request},use) => {
        await use(new ProductsAPI(request));
    },
    //--------------------------------

    homePage: async ({page}, use) => {
        await use(new HomePage(page));
    },
    signUp_LoginPage: async({page}, use) =>{
        await use(new SignUp_LoginPage(page));
    },
    signUpPage: async({page}, use) =>{
        await use(new SignUpPage(page));
    },
    accountCreatedPage: async({page}, use) =>{
        await use(new AccountCreatedPage(page));
    },
    accountDeletePage: async({page}, use) =>{
        await use(new AccountDeletePage(page));
    },
    contactUsPage: async({page}, use) =>{
        await use(new ContactUsPage(page));
    },
    testCasesPage: async({page}, use) =>{
        await use(new TestCasesPage(page));
    },
    productsPage: async({page}, use) =>{
        await use(new ProductsPage(page));
    },
    productPage: async({page}, use) =>{
        await use(new ProductPage(page));
    },
    cartPage: async({page}, use) =>{
        await use(new CartPage(page));
    },
    paymentPage: async({page}, use) =>{
        await use(new PaymentPage(page));
    },

    // Thanks to Checkly for that https://www.youtube.com/watch?v=hegZS46J0rA
    // -----
    saveData: [async ({ context, page }, use, testInfo) => {
        await blockAds(context);

        // Start tracing (with screenshots, snapshots, and sources)
        await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

        await use();

        testInfo.setTimeout(30000);

        try{
            await saveAdditionsAttachments(context, page, testInfo);
        }catch(err){
            console.error("Error during saving attachments:", err);
        }

    }, { auto: true }],
    // -----
});

export {expect} from '@playwright/test';