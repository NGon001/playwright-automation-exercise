import { Locator, Page, expect } from "@playwright/test";

export class BasePage{
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    };

    async goto(path: string = ""){
        await this.page.goto("/" + path);
    }

    async goBack(){
        this.page.goBack();
    }
};