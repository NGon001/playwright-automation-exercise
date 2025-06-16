import { Locator, Page, expect } from "@playwright/test";

export class SignUpPage{
    readonly page: Page;
    readonly nameFieldLocator: Locator;
    readonly emailFieldLocator: Locator;
    readonly createAccountButton:Locator;
    readonly enterAccountInfTextLocator: Locator;
    readonly fillFormRadioTitleLocator: (Title: string) => Locator;
    readonly fillFormPasswordLocator: Locator;
    readonly fillFormDayOptionLocator: Locator;
    readonly fillFormMonthOptionLocator: Locator;
    readonly fillFormYearOptionLocator: Locator;
    readonly fillFormSignUpNewsletterLocator: Locator;
    readonly fillFormSignUpOffersLocator: Locator;
    readonly fillFormFirstNameInputLocator: Locator;
    readonly fillFormLastNameInputLocator: Locator;
    readonly fillFormCompanyInputLocator: Locator;
    readonly fillFormAddress1InputLocator: Locator;
    readonly fillFormAddress2InputLocator: Locator;
    readonly fillFormCountryOptionLocator: Locator;
    readonly fillFormStateInputLocator: Locator;
    readonly fillFormCityInputLocator: Locator;
    readonly fillFormZipcodeInputLocator: Locator;
    readonly fillFormMobileNumberInputLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.nameFieldLocator = this.page.locator("#name");
        this.emailFieldLocator = this.page.locator("#email");
        this.createAccountButton = this.page.getByRole('button', { name: 'Create Account' });
        this.enterAccountInfTextLocator = this.page.getByText('Enter Account Information');
        this.fillFormRadioTitleLocator = (Title: string) => this.page.getByRole('radio', { name: Title });
        this.fillFormPasswordLocator = this.page.locator('#password');
        this.fillFormDayOptionLocator = this.page.locator('#days');
        this.fillFormMonthOptionLocator = this.page.locator('#months');
        this.fillFormYearOptionLocator = this.page.locator('#years');
        this.fillFormSignUpNewsletterLocator = this.page.getByRole('checkbox', { name: 'Sign up for our newsletter!' });
        this.fillFormSignUpOffersLocator = this.page.getByRole('checkbox', { name: 'Receive special offers from our partners!' });
        this.fillFormFirstNameInputLocator = this.page.locator('#first_name');
        this.fillFormLastNameInputLocator = this.page.locator('#last_name');
        this.fillFormCompanyInputLocator = this.page.locator('#company');
        this.fillFormAddress1InputLocator = this.page.locator('#address1');
        this.fillFormAddress2InputLocator = this.page.locator('#address2');
        this.fillFormCountryOptionLocator = this.page.getByRole('combobox', { name: 'Country' });
        this.fillFormStateInputLocator = this.page.locator('#state');
        this.fillFormCityInputLocator = this.page.locator('#city');
        this.fillFormZipcodeInputLocator = this.page.locator('#zipcode');
        this.fillFormMobileNumberInputLocator = this.page.locator('#mobile_number');
    }

    async checkDataInForm(firstName, email){
        await expect(await this.page.getByText('Enter Account Information')).toBeVisible();
        await expect(await this.nameFieldLocator.getAttribute('value')).toBe(firstName);
        await expect(await this.emailFieldLocator.getAttribute('value')).toBe(email);   
    }

    async fillSignUpForm(Title,firstName,lastName,password,BirthDay,BirthMonth,BirthYear,companyName,Address,Address2,Country,State,City,Zipcode,mobileNumber){
        const fullName = [firstName,lastName];
        await this.fillFormRadioTitleLocator(Title).check();
        await this.fillFormPasswordLocator.fill(password);
        await this.fillFormDayOptionLocator.selectOption({ label: BirthDay });
        await this.fillFormMonthOptionLocator.selectOption({ label: BirthMonth });
        await this.fillFormYearOptionLocator.selectOption({ label: BirthYear });
        await this.fillFormSignUpNewsletterLocator.check();
        await this.fillFormSignUpOffersLocator.check();
        await this.fillFormFirstNameInputLocator.fill(fullName[0]);
        await this.fillFormLastNameInputLocator.fill(fullName[1]);
        await this.fillFormCompanyInputLocator.fill(companyName);
        await this.fillFormAddress1InputLocator.fill(Address);
        await this.fillFormAddress2InputLocator.fill(Address2);
        await this.fillFormCountryOptionLocator.selectOption({ label: Country });
        await this.fillFormStateInputLocator.fill(State);
        await this.fillFormCityInputLocator.fill(City);
        await this.fillFormZipcodeInputLocator.fill(Zipcode);
        await this.fillFormMobileNumberInputLocator.fill(mobileNumber);
    }

    async clickCreateAccountButton(){
        await this.createAccountButton.click();
    }
}