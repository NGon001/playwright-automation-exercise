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
import { AuthorizationAPI } from '../API/authorization';
import { ProductsAPI } from '../API/products';
import { randomUUID } from 'crypto';
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
    authorizationAPI: async({request},use) => {
        await use(new AuthorizationAPI(request));
    },
    productsAPI: async({request},use) => {
        await use(new ProductsAPI(request));
    },
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
        await context.route("**/*", route => {
          route.request().url().startsWith("https://googleads.") ?
          route.abort() : route.continue();
          return;
        })

        // Start tracing (with screenshots, snapshots, and sources)
        await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

        await use();

        // Stop tracing and save it
        const tracePath = `test-resultsSave/traces/trace-${randomUUID()}.zip`;
        await context.tracing.stop({ path: tracePath });
        testInfo.annotations.push({ type: 'testrail_attachment', description: tracePath });

        let screenshotPath = `test-resultsSave/screenshots/screenshot-${randomUUID()}.png`;
        const videoPath = `test-resultsSave/videos/video-${randomUUID()}.webm`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        await page.close();
        testInfo.annotations.push({ type: 'testrail_attachment', description: screenshotPath });
        if (page.video()) {
            await page.video()?.saveAs(videoPath);
            testInfo.annotations.push({ type: 'testrail_attachment', description: videoPath });
        }

    }, { auto: true }],
    // -----
});

export {expect} from '@playwright/test';

export const Status = { success: 200, resourceCreated: 201, badReq: 400, notFound: 404, methodNotAllowed: 405, serverError: 500};
export const Methods = { GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE'};

export class ProductInfo{
    Name: string;
    Price: number;
    Quantity: number;

    constructor(name: string, price: number, quantity: number){
        this.Name = name;
        this.Price = price;
        this.Quantity = quantity;
    }
}

export const Messages = {
    userFoundMessage: "User exists!",
    userNotFoundMessage: "User not found!",
    userCreatedMessage: "User created!",
    userDeletedMessage: "Account deleted!",
    accountNotFoundMessage: "Account not found with this email, try another email!",
    badRequestMessage: (method: string) => `Bad request, email or password parameter is missing in ${method} request.`,
    badRequestParameterMessage: (method: string, parameter: string) => `Bad request, ${parameter} parameter is missing in ${method} request.`,
    notSupportedReqMethodMessage: "This request method is not supported.",
    emailAlreadyExistsMessage: "Email already exists!",
    methodNotAllowedMessage: (method: string) => `Method \"${method}\" not allowed.`,
}