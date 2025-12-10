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

    async scrollToElement(element: Locator){
        const handle = await element.elementHandle();
        if(!handle){
            throw new Error("Element not found to scroll to");
        }
        await this.page.evaluate((element) => {
             element?.scrollIntoView({ behavior: 'smooth', block: 'start' }); //same as "((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'start'});", element);"
        }, await handle);
    }

    async waitForImageToLoad(imageElement: Locator){
        const imageHover = await imageElement.elementHandle();
        if(!imageHover){
            throw new Error("Image element not found to wait for load");
        }
        await this.page.waitForFunction(
            (img) => (img instanceof HTMLImageElement) && img.complete && img.naturalWidth > 0,
            await imageHover
        );
    };
};