import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Helper/BasePage";

export class TestCasesPage extends BasePage{
    readonly testCasePageTextCheckLocator: Locator;

    constructor(page: Page){
        super(page);
        this.testCasePageTextCheckLocator = this.page.getByText("Below is the list of test Cases");
    }

    async verifyPageIsVisible(){
        await expect(await this.testCasePageTextCheckLocator).toBeVisible();
    }
}
