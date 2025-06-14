import { Locator, Page, expect } from "@playwright/test";

export class TestCasesPage{
    readonly page: Page;
    readonly testCasePageTextCheckLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.testCasePageTextCheckLocator = this.page.getByText("Below is the list of test Cases");
    }

    async verifyPageIsVisible(){
        await expect(await this.testCasePageTextCheckLocator).toBeVisible();
    }
}
