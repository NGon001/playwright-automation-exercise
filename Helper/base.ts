import {test as baseTest} from '@playwright/test';
import { HomePage, SignUp_LoginPage, SignUpPage, AccountCreatedPage, AccountDeletePage,ContactUsPage,TestCasesPage,ProductsPage,ProductPage,CartPage, PaymentPage} from './POM';


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
}

export const test = baseTest.extend<MyFixtures>({
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
});

export {expect} from '@playwright/test';