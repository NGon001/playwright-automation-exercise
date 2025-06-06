import { Locator, Page, expect } from "@playwright/test";

export class HomePage{
    readonly page: Page;
    readonly signUpAndLoginPageLocator: Locator;
    readonly deleteButtonLocator: Locator;
    readonly logoutButtonLocator: Locator;
    readonly logedInTextLocator: Locator;
    readonly contactUsButtonLocator: Locator;
    readonly featuredItemsTextLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signUpAndLoginPageLocator = this.page.getByRole('link', { name: 'Signup / Login' });
        this.deleteButtonLocator = this.page.getByRole("link",{name: " Delete Account"});
        this.logoutButtonLocator = this.page.getByRole('link', { name: 'Logout' });
        this.logedInTextLocator = this.page.getByText('Logged in as', { exact: false });
        this.contactUsButtonLocator = this.page.getByRole('link', { name: 'Contact us' });
        this.featuredItemsTextLocator = this.page.getByText('Features Items');
    }

    async goto(){
        await this.page.goto("/");
    }

    async gotoSignUpAndLoginPage(){
        await this.signUpAndLoginPageLocator.click();
    }

    async gotoContactUsPage(){
        await this.contactUsButtonLocator.click();
    }

    async checkLoggedInName(name){
        const expectedMessage = `Logged in as ${name[0]}`;
        const loggedInMessage = await this.logedInTextLocator.textContent();
        await expect(await this.logedInTextLocator).toBeVisible();
        await expect(await loggedInMessage?.trim()).toBe(expectedMessage);
    }

    async clickDeleteAccount(){
        await this.deleteButtonLocator.click();
    }

    async checkHomePageLoad(){
        await expect(await this.featuredItemsTextLocator).toBeVisible();
        await expect(await this.signUpAndLoginPageLocator).toBeVisible();
    }

    async logout(){
       await this.logoutButtonLocator.click();
    }
}


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
    }

    async fillStartSignUpForm(fullName, email){
        await this.signUpFormLocator.getByPlaceholder('Name').fill(fullName[0]);
        await this.signUpFormLocator.getByPlaceholder('Email Address').fill(email);
    }

    async fillLoginForm(email,password){
        await this.loginFormLocator.getByPlaceholder('Email Address').fill(email);
        await this.loginFormLocator.getByPlaceholder('Password').fill(password);
    }

    async checkLoginText(){
        await expect(await this.loginTextLocator).toBeVisible();
    }

    async checksignUpText(){
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

export class SignUpPage{
    readonly page: Page;
    readonly nameFieldLocator: Locator;
    readonly emailFieldLocator: Locator;
    readonly createAccountButton:Locator;

    constructor(page: Page){
        this.page = page;
        this.nameFieldLocator = this.page.locator("#name");
        this.emailFieldLocator = this.page.locator("#email");
        this.createAccountButton = this.page.getByRole('button', { name: 'Create Account' });
    }

    async checkDataInForm(fullName, email){
        await expect(await this.page.getByText('Enter Account Information')).toBeVisible();
        await expect(await this.nameFieldLocator.getAttribute('value')).toBe(fullName[0]);
        await expect(await this.emailFieldLocator.getAttribute('value')).toBe(email);   
    }

    async fillSignUpForm(Title,fullName,password,BirthDay,BirthMonth,BirthYear,companyName,Address,Address2,Country,State,City,Zipcode,mobileNumber){
        await this.page.getByRole('radio', { name: Title }).check();
        await this.page.locator('#password').fill(password);
        await this.page.locator('#days').selectOption({ label: BirthDay });
        await this.page.locator('#months').selectOption({ label: BirthMonth });
        await this.page.locator('#years').selectOption({ label: BirthYear });
        await this.page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();
        await this.page.getByRole('checkbox', { name: 'Receive special offers from our partners!' }).check();
        await this.page.locator('#first_name').fill(fullName[0]);
        await this.page.locator('#last_name').fill(fullName[1]);
        await this.page.locator('#company').fill(companyName);
        await this.page.locator('#address1').fill(Address);
        await this.page.locator('#address2').fill(Address2);
        await this.page.getByRole('combobox', { name: 'Country' }).selectOption({ label: Country });
        await this.page.locator('#state').fill(State);
        await this.page.locator('#city').fill(City);
        await this.page.locator('#zipcode').fill(Zipcode);
        await this.page.locator('#mobile_number').fill(mobileNumber);
    }

    async clickCreateAccountButton(){
        await this.createAccountButton.click();
    }
}

export class AccountCreatedPage{
    readonly page: Page;
    readonly accountCreatedTextLocator: Locator;
    readonly continueButtonLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.accountCreatedTextLocator = this.page.getByText('Account Created!');
        this.continueButtonLocator = this.page.getByRole('link', { name: 'Continue' });
    }

    async checkAccountCreationMessage(){
        await expect(await this.accountCreatedTextLocator).toBeVisible();
    }

    async clickContinueButton(){
        await this.continueButtonLocator.click();
    }
}

export class AccountDeletePage{
    readonly page: Page;
    readonly accountDeletedTextLocator: Locator;
    readonly continueButtonLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.accountDeletedTextLocator = this.page.getByText('Account Deleted!');
        this.continueButtonLocator = this.page.getByRole('link', { name: 'Continue' });
    }

    async checkAccountDeletedMessage(){
        await expect(await this.accountDeletedTextLocator).toBeVisible();
    }

    async clickContinueButton(){
        await this.continueButtonLocator.click();
    }
}

export class ContactUsPage{
    readonly page: Page;
    readonly getInTouchTextLocator: Locator;
    readonly nameFieldLocator: Locator;
    readonly emailFieldLocator: Locator;
    readonly subjectFieldLocator: Locator;
    readonly messageFieldLocator: Locator;
    readonly submitButtonLocator: Locator;
    readonly chooseFileButtonLocator: Locator;
    readonly successMessageLocator: Locator;
    readonly returnHomeButtonLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.getInTouchTextLocator = this.page.getByText('Get In Touch');
        this.nameFieldLocator = this.page.getByPlaceholder('Name',{ exact: true });
        this.emailFieldLocator = this.page.getByPlaceholder('Email',{ exact: true });
        this.subjectFieldLocator = this.page.getByPlaceholder('Subject',{ exact: true });
        this.messageFieldLocator = this.page.getByPlaceholder('Your Message Here',{ exact: true });
        this.submitButtonLocator = this.page.getByRole('button', { name: 'Submit' });
        this.chooseFileButtonLocator = this.page.getByRole('button', { name: 'Choose File' });
        this.successMessageLocator = this.page.locator('.status.alert.alert-success');
        this.returnHomeButtonLocator = this.page.locator("#form-section").getByRole('link', { name: ' Home' });
    }

    async checkGetInTouchText(){
        await expect(await this.getInTouchTextLocator).toBeVisible();
    }

    async fillContactUsForm(name, email, subject, message, filePath) {
        await this.nameFieldLocator.fill(name.join(' '));
        await this.emailFieldLocator.fill(email);
        await this.subjectFieldLocator.fill(subject);
        await this.messageFieldLocator.fill(message);
        if (filePath) {
            await this.chooseFileButtonLocator.setInputFiles(filePath);
        }
    }

    async clickSubmitButton() {
        let AlertMessage = '';
        this.page.on('dialog', dialog => { AlertMessage = dialog.message();dialog.accept()});
        await this.submitButtonLocator.click();
        expect(AlertMessage).toBe("Press OK to proceed!");
    }


    async checkSuccessMessage() {
        await expect(await this.successMessageLocator).toBeVisible();
    }

    async clickReturnHomeButton() {
        await this.returnHomeButtonLocator.click();
    }
}