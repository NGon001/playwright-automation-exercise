import {test as baseTest} from '@playwright/test';
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