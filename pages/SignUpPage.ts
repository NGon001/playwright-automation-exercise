import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Helper/BasePage.ts";

export class SignUpPage extends BasePage {
    readonly nameFieldLocator: Locator;
    readonly emailFieldLocator: Locator;
    readonly createAccountButton:Locator;
    readonly RadioTitleLocator: (Title: string) => Locator;
    readonly PasswordInputLocator: Locator;
    readonly DayOptionLocator: Locator;
    readonly MonthOptionLocator: Locator;
    readonly YearOptionLocator: Locator;
    readonly SignUpNewsletterCheckLocator: Locator;
    readonly SignUpOffersChrckLocator: Locator;
    readonly FirstNameInputLocator: Locator;
    readonly LastNameInputLocator: Locator;
    readonly CompanyInputLocator: Locator;
    readonly Address1InputLocator: Locator;
    readonly Address2InputLocator: Locator;
    readonly CountryOptionLocator: Locator;
    readonly StateInputLocator: Locator;
    readonly CityInputLocator: Locator;
    readonly ZipcodeInputLocator: Locator;
    readonly MobileNumberInputLocator: Locator;

    constructor(page: Page){
        super(page);
        this.nameFieldLocator = this.page.locator("#name");
        this.emailFieldLocator = this.page.locator("#email");
        this.createAccountButton = this.page.getByRole('button', { name: 'Create Account' });
        this.RadioTitleLocator = (Title: string) => this.page.getByRole('radio', { name: Title });
        this.PasswordInputLocator = this.page.locator('#password');
        this.DayOptionLocator = this.page.locator('#days');
        this.MonthOptionLocator = this.page.locator('#months');
        this.YearOptionLocator = this.page.locator('#years');
        this.SignUpNewsletterCheckLocator = this.page.getByRole('checkbox', { name: 'Sign up for our newsletter!' });
        this.SignUpOffersChrckLocator = this.page.getByRole('checkbox', { name: 'Receive special offers from our partners!' });
        this.FirstNameInputLocator = this.page.locator('#first_name');
        this.LastNameInputLocator = this.page.locator('#last_name');
        this.CompanyInputLocator = this.page.locator('#company');
        this.Address1InputLocator = this.page.locator('#address1');
        this.Address2InputLocator = this.page.locator('#address2');
        this.CountryOptionLocator = this.page.getByRole('combobox', { name: 'Country' });
        this.StateInputLocator = this.page.locator('#state');
        this.CityInputLocator = this.page.locator('#city');
        this.ZipcodeInputLocator = this.page.locator('#zipcode');
        this.MobileNumberInputLocator = this.page.locator('#mobile_number');
    }

    async checkDataInForm(firstName: string | unknown, email: string | unknown){
        await expect(await this.page.getByText('Enter Account Information')).toBeVisible();
        await expect(await this.nameFieldLocator.getAttribute('value')).toBe(firstName);
        await expect(await this.emailFieldLocator.getAttribute('value')).toBe(email);   
    }

    async fillSignUpForm(Title: string,firstName: string,lastName: string,password: string,BirthDay: string ,BirthMonth: string ,BirthYear: string ,companyName: string 
        ,Address: string ,Address2: string ,Country: string ,State: string ,City: string ,Zipcode: string ,mobileNumber: string 
    ){
        await this.RadioTitleLocator(Title).check();
        await this.PasswordInputLocator.fill(password);
        await this.DayOptionLocator.selectOption({ label: BirthDay });
        await this.MonthOptionLocator.selectOption({ label: BirthMonth });
        await this.YearOptionLocator.selectOption({ label: BirthYear });
        await this.SignUpNewsletterCheckLocator.check();
        await this.SignUpOffersChrckLocator.check();
        await this.FirstNameInputLocator.fill(firstName);
        await this.LastNameInputLocator.fill(lastName);
        await this.CompanyInputLocator.fill(companyName);
        await this.Address1InputLocator.fill(Address);
        await this.Address2InputLocator.fill(Address2);
        await this.CountryOptionLocator.selectOption({ label: Country });
        await this.StateInputLocator.fill(State);
        await this.CityInputLocator.fill(City);
        await this.ZipcodeInputLocator.fill(Zipcode);
        await this.MobileNumberInputLocator.fill(mobileNumber);
    }

    async clickCreateAccountButton(){
        await this.createAccountButton.click();
    }
}