import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Helper/BasePage";


export class AccountCreatedPage extends BasePage{

    readonly locators: {
        accountCreatedTextLocator: Locator;
        continueButtonLocator: Locator;
    };

    readonly assertions: {
        expectAccountCreatedTextVisible: () => Promise<void>;
    }

    readonly actions: {
        clickContinueButton: () => Promise<void>;
    }

    constructor(page: Page){
        super(page);

        this.locators = {
            accountCreatedTextLocator: this.page.getByText('Account Created!').describe("Green Account Created! Text on Page"),
            continueButtonLocator: this.page.getByRole('link', { name: 'Continue' }).describe("Continue Button"),
        };

        this.assertions = {
            expectAccountCreatedTextVisible: async () => {
                await expect(await this.locators.accountCreatedTextLocator).toBeVisible();
            },
        };

        this.actions = {
            clickContinueButton: async () => {
                await this.locators.continueButtonLocator.click();
            }
        };
    }
}