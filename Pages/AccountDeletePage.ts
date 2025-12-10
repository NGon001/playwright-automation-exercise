import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Helper/BasePage";

export class AccountDeletePage extends BasePage{

    readonly locators: {
        accountDeletedTextLocator: Locator;
        continueButtonLocator: Locator;
    };

    readonly actions: {
        clickContinueButton: () => Promise<void>;
    };

    readonly assertions: {
        expectAccountDeletedTextVisible: () => Promise<void>;
    };

    constructor(page: Page){
        super(page);

        this.locators = {
            accountDeletedTextLocator: this.page.getByText('Account Deleted!'),
            continueButtonLocator: this.page.getByRole('link', { name: 'Continue' }),
        };

        this.assertions = {
            expectAccountDeletedTextVisible: async () => {
                await expect(await this.locators.accountDeletedTextLocator).toBeVisible();
            }
        };

        this.actions = {
            clickContinueButton: async () => {
                await this.locators.continueButtonLocator.click();
            }
        };
    }
}