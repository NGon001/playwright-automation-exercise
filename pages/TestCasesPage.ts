import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Helper/BasePage";

export class TestCasesPage extends BasePage{
    readonly locators: {
        testCasePageTextCheckLocator: Locator;
    };

    readonly assertions: {
        expectTestCasePageTextVisible: () => Promise<void>;
    };

    readonly actions: {

    };

    constructor(page: Page){
        super(page);

        this.locators = {
            testCasePageTextCheckLocator: this.page.getByText("Below is the list of test Cases"),
        };

        this.assertions = {
            expectTestCasePageTextVisible: async () => {
                await expect(await this.locators.testCasePageTextCheckLocator).toBeVisible();
            }
        };

        this.actions = {

        };
    }
}
