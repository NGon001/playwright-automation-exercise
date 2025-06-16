import { Locator, Page, expect } from "@playwright/test";

export class SignUp_LoginPage{
    readonly page: Page;
    readonly signUpFormLocator: Locator;
    readonly loginFormLocator: Locator;
    readonly loginButtonLocator: Locator;
    readonly signUpButtonLocator: Locator;
    readonly loginTextLocator: Locator;
    readonly singUpTextLocator: Locator;
    readonly incorectDataMessageLocator: Locator;
    readonly exestedDataMessageLocator: Locator;
    readonly signUpAndLoginPageLocator: Locator;
    readonly FormNameInputLocator: (signUpForm: Locator) => Locator;
    readonly FormEmailInputLocator: (signUpForm: Locator) => Locator;
    readonly FormPasswordnputLocator: (signUpForm: Locator) => Locator;

    constructor(page: Page){
        this.page = page;
        this.signUpFormLocator = this.page.locator('form[action="/signup"]');
        this.loginFormLocator = this.page.locator('form[action="/login"]');
        this.loginButtonLocator = this.loginFormLocator.getByRole('button', { name: 'Login' });
        this.signUpButtonLocator = this.signUpFormLocator.getByRole('button', { name: 'Signup' });
        this.loginTextLocator = this.page.getByText('Login to your account');
        this.singUpTextLocator = this.page.getByText('New User Signup!');
        this.incorectDataMessageLocator = this.page.getByText("Your email or password is incorrect!");
        this.exestedDataMessageLocator = this.page.getByText("Email Address already exist!");
        this.signUpAndLoginPageLocator = this.page.getByRole('link', { name: 'Signup / Login' });
        this.FormNameInputLocator = (Form: Locator) => Form.getByPlaceholder('Name');
        this.FormEmailInputLocator = (Form: Locator) => Form.getByPlaceholder('Email Address');
        this.FormPasswordnputLocator = (Form: Locator) => Form.getByPlaceholder('Password');
    }

    async checkThatSignUpAndLoginButtonIsVissible(){
        await expect(await this.signUpAndLoginPageLocator).toBeVisible();
    }

    async fillStartSignUpForm(firstName: string, email: string){
        await this.FormNameInputLocator(await this.signUpFormLocator).fill(firstName);
        await this.FormEmailInputLocator(await this.signUpFormLocator).fill(email);
    }

    async fillLoginForm(email,password){
        await this.FormEmailInputLocator(await this.loginFormLocator).fill(email);
        await this.FormPasswordnputLocator(await this.loginFormLocator).fill(password);
    }

    async checkLoginText(){
        await expect(await this.loginTextLocator).toBeVisible();
    }

    async checkSignUpText(){
        await expect(await this.singUpTextLocator).toBeVisible();
    }

    async checkIncorectDataMessage(){
        await expect(await this.incorectDataMessageLocator).toBeVisible();
    }
    async checkExistedDataMessage(){
        await expect(await this.exestedDataMessageLocator).toBeVisible();
    }

    async clickLoginButton(){
        await this.loginButtonLocator.click();
    }
    async clickSignUpButton(){
        await this.signUpButtonLocator.click();
    }
}