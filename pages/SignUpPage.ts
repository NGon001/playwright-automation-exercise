import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Helper/BasePage.ts";

export class SignUpPage extends BasePage {
    readonly locators: {
        nameFieldLocator: Locator;
        emailFieldLocator: Locator;
        createAccountButton:Locator;
        RadioTitleLocator: (Title: string) => Locator;
        PasswordInputLocator: Locator;
        DayOptionLocator: Locator;
        MonthOptionLocator: Locator;
        YearOptionLocator: Locator;
        SignUpNewsletterCheckLocator: Locator;
        SignUpOffersChrckLocator: Locator;
        FirstNameInputLocator: Locator;
        LastNameInputLocator: Locator;
        CompanyInputLocator: Locator;
        Address1InputLocator: Locator;
        Address2InputLocator: Locator;
        CountryOptionLocator: Locator;
        StateInputLocator: Locator;
        CityInputLocator: Locator;
        ZipcodeInputLocator: Locator;
        MobileNumberInputLocator: Locator;
    };

    readonly assertions: {
        expectExtendedFormToBeVisible: (firstName: string, email: string) => Promise<void>;
    };

    readonly actions: {
        fillSignUpForm: (Title: string,firstName: string,lastName: string,password: string,BirthDay: string ,BirthMonth: string ,BirthYear: string ,companyName: string, Address: string ,Address2: string ,Country: string ,State: string ,City: string ,Zipcode: string ,mobileNumber: string, SignUpNewsletter?: boolean, SignUpOffers?: boolean ) => Promise<void>;
        clickCreateAccountButton: () => Promise<void>;
    };

    constructor(page: Page){
        super(page);

        this.locators = {
            nameFieldLocator : this.page.locator("#name"),
            emailFieldLocator : this.page.locator("#email"),
            createAccountButton : this.page.getByRole('button', { name: 'Create Account' }),
            RadioTitleLocator : (Title: string) => this.page.getByRole('radio', { name: Title }),
            PasswordInputLocator : this.page.locator('#password'),
            DayOptionLocator : this.page.locator('#days'),
            MonthOptionLocator : this.page.locator('#months'),
            YearOptionLocator : this.page.locator('#years'),
            SignUpNewsletterCheckLocator : this.page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }),
            SignUpOffersChrckLocator : this.page.getByRole('checkbox', { name: 'Receive special offers from our partners!' }),
            FirstNameInputLocator : this.page.locator('#first_name'),
            LastNameInputLocator : this.page.locator('#last_name'),
            CompanyInputLocator : this.page.locator('#company'),
            Address1InputLocator : this.page.locator('#address1'),
            Address2InputLocator : this.page.locator('#address2'),
            CountryOptionLocator : this.page.getByRole('combobox', { name: 'Country' }),
            StateInputLocator : this.page.locator('#state'),
            CityInputLocator : this.page.locator('#city'),
            ZipcodeInputLocator : this.page.locator('#zipcode'),
            MobileNumberInputLocator : this.page.locator('#mobile_number'),
        };

        this.assertions = {
            expectExtendedFormToBeVisible: async (firstName: string, email: string) => {
                await expect(await this.page.getByText('Enter Account Information')).toBeVisible();
                await expect(await this.locators.nameFieldLocator.getAttribute('value')).toBe(firstName);
                await expect(await this.locators.emailFieldLocator.getAttribute('value')).toBe(email);  
            }
        };

        this.actions = {
            fillSignUpForm: async (Title: string,firstName: string,lastName: string,password: string,BirthDay: string ,BirthMonth: string ,BirthYear: string ,companyName: string 
                ,Address: string ,Address2: string ,Country: string ,State: string ,City: string ,Zipcode: string ,mobileNumber: string, SignUpNewsletter: boolean = true, SignUpOffers: boolean = true 
            ) => {
                await this.locators.RadioTitleLocator(Title).check();
                await this.locators.PasswordInputLocator.fill(password);
                await this.locators.DayOptionLocator.selectOption({ label: BirthDay });
                await this.locators.MonthOptionLocator.selectOption({ label: BirthMonth });
                await this.locators.YearOptionLocator.selectOption({ label: BirthYear });
                if (SignUpNewsletter)
                    await this.locators.SignUpNewsletterCheckLocator.check();
                if (SignUpOffers)
                    await this.locators.SignUpOffersChrckLocator.check();
                await this.locators.FirstNameInputLocator.fill(firstName);
                await this.locators.LastNameInputLocator.fill(lastName);
                await this.locators.CompanyInputLocator.fill(companyName);
                await this.locators.Address1InputLocator.fill(Address);
                await this.locators.Address2InputLocator.fill(Address2);
                await this.locators.CountryOptionLocator.selectOption({ label: Country });
                await this.locators.StateInputLocator.fill(State);
                await this.locators.CityInputLocator.fill(City);
                await this.locators.ZipcodeInputLocator.fill(Zipcode);
                await this.locators.MobileNumberInputLocator.fill(mobileNumber);
            },

            clickCreateAccountButton: async () => {
                await this.locators.createAccountButton.click();
            }
        };
    }
}