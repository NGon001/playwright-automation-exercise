import {test as baseTest} from '@playwright/test';
import { HomePage, SignUp_LoginPage, SignUpPage, AccountCreatedPage, AccountDeletePage} from './pom';


type MyFixtures = {
    homePage: HomePage;
    signUp_LoginPage: SignUp_LoginPage;
    signUpPage: SignUpPage;
    accountCreatedPage: AccountCreatedPage;
    accountDeletePage: AccountDeletePage;
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
});

export {expect} from '@playwright/test';