import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Helper/BasePage";

export class SignUp_LoginPage extends BasePage{
    readonly locators: {
        signUpFormLocator: Locator;
        loginFormLocator: Locator;
        loginButtonLocator: Locator;
        signUpButtonLocator: Locator;
        loginTextLocator: Locator;
        singUpTextLocator: Locator;
        incorectDataMessageLocator: Locator;
        exestedDataMessageLocator: Locator;
        signUpAndLoginPageLocator: Locator;
        FormNameInputLocator: (signUpForm: Locator) => Locator;
        FormEmailInputLocator: (signUpForm: Locator) => Locator;
        FormPasswordnputLocator: (signUpForm: Locator) => Locator;
    };

    readonly assertions: {
        expectPageIsVissible: () => Promise<void>;
        expectLoginTextVisible: () => Promise<void>;
        expectSignUpTextVisible: () => Promise<void>;
        expectIncorectDataMessageVisible: () => Promise<void>;
        expectExistedDataMessageVisible: () => Promise<void>;
    };

    readonly actions: {
        fillStartSignUpForm: (firstName: string, email: string) => Promise<void>;
        fillLoginForm: (email: string,password: string) => Promise<void>;
        clickLoginButton: () => Promise<void>;
        clickSignUpButton: () => Promise<void>;
    };

    constructor(page: Page){
        super(page);

        this.locators = {
            signUpFormLocator : this.page.locator('form[action="/signup"]'),
            loginFormLocator : this.page.locator('form[action="/login"]'),
            get loginButtonLocator() {
                return this.loginFormLocator.getByRole('button', { name: 'Login' });
            },
            get signUpButtonLocator() {
                return this.signUpFormLocator.getByRole('button', { name: 'Signup' });
            },
            loginTextLocator : this.page.getByText('Login to your account'),
            singUpTextLocator : this.page.getByText('New User Signup!'),
            incorectDataMessageLocator : this.page.getByText("Your email or password is incorrect!"),
            exestedDataMessageLocator : this.page.getByText("Email Address already exist!"),
            signUpAndLoginPageLocator : this.page.getByRole('link', { name: 'Signup / Login' }),
            FormNameInputLocator : (Form: Locator) => Form.getByPlaceholder('Name'),
            FormEmailInputLocator : (Form: Locator) => Form.getByPlaceholder('Email Address'),
            FormPasswordnputLocator : (Form: Locator) => Form.getByPlaceholder('Password'),
        };

        this.assertions = {
            expectPageIsVissible: async () => {
                await expect(await this.locators.signUpAndLoginPageLocator).toBeVisible();
            },

            expectLoginTextVisible: async () => {
                await expect(await this.locators.loginTextLocator).toBeVisible();
            },

            expectSignUpTextVisible: async () => {
                await expect(await this.locators.singUpTextLocator).toBeVisible();
            },

            expectIncorectDataMessageVisible: async () => {
                await expect(await this.locators.incorectDataMessageLocator).toBeVisible();
            },

            expectExistedDataMessageVisible: async () => {
                await expect(await this.locators.exestedDataMessageLocator).toBeVisible();
            }
        };

        this.actions = {
            fillStartSignUpForm: async (firstName: string, email: string) => {
                await this.locators.FormNameInputLocator(await this.locators.signUpFormLocator).fill(firstName);
                await this.locators.FormEmailInputLocator(await this.locators.signUpFormLocator).fill(email);
            },

            fillLoginForm: async (email: string,password: string) => {
                await this.locators.FormEmailInputLocator(await this.locators.loginFormLocator).fill(email);
                await this.locators.FormPasswordnputLocator(await this.locators.loginFormLocator).fill(password);
            },

            clickLoginButton: async () => {
                await this.locators.loginButtonLocator.click();
            },

            clickSignUpButton: async () => {
                await this.locators.signUpButtonLocator.click();
            }
        };
    }
}