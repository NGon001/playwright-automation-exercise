import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Helper/BasePage";


export class AccountCreatedPage extends BasePage{
    readonly accountCreatedTextLocator: Locator;
    readonly continueButtonLocator: Locator;

    constructor(page: Page){
        super(page);
        this.accountCreatedTextLocator = this.page.getByText('Account Created!').describe("Green Account Created! Text on Page");
        this.continueButtonLocator = this.page.getByRole('link', { name: 'Continue' }).describe("Continue Button");
    }

    async checkAccountCreationMessage(){
        await expect(await this.accountCreatedTextLocator).toBeVisible();
    }

    async clickContinueButton(){
        await this.continueButtonLocator.click();
    }
}