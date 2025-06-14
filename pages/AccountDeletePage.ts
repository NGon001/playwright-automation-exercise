import { Locator, Page, expect } from "@playwright/test";

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