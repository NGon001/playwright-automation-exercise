import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Helper/BasePage";

export class AccountDeletePage extends BasePage{
    readonly accountDeletedTextLocator: Locator;
    readonly continueButtonLocator: Locator;

    constructor(page: Page){
        super(page);
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