import { Locator, Page, expect } from "@playwright/test";


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