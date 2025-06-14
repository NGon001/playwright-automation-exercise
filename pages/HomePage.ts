import { Locator, Page, expect } from "@playwright/test";
import { textPriceToFloat } from "../Helper/tools";

export class HomePage{
    readonly page: Page;

    readonly signUpAndLoginPageLocator: Locator;
    readonly deleteButtonLocator: Locator;
    readonly logoutButtonLocator: Locator;
    readonly textLoggedInUserLocator: Locator;
    readonly contactUsButtonLocator: Locator;
    readonly featuredItemsTextLocator: Locator;
    readonly testCasesButtonLocator: Locator;
    readonly menuLocator: Locator;
    readonly productsButtonLocator: Locator;
    readonly subscriptionTextLocator: Locator;
    readonly subscriptionEmailInputLocator: Locator;
    readonly subscribeButtonLocator: Locator;
    readonly subscribeMessage: Locator;
    readonly cartButtonLocator: Locator;
    readonly allProductsItemsLocator: Locator;

    readonly productViewProductButtonLocator: (product: Locator) => Locator;
    readonly productNameTextLocator: (product: Locator) => Locator;
    readonly productPriceTextLocator: (product: Locator) => Locator;


    constructor(page: Page) {
        this.page = page;
        this.signUpAndLoginPageLocator = this.page.getByRole('link', { name: 'Signup / Login' });
        this.deleteButtonLocator = this.page.getByRole("link",{name: " Delete Account"});
        this.logoutButtonLocator = this.page.getByRole('link', { name: 'Logout' });
        this.textLoggedInUserLocator = this.page.getByText('Logged in as', { exact: false });
        this.contactUsButtonLocator = this.page.getByRole('link', { name: 'Contact us' });
        this.featuredItemsTextLocator = this.page.getByText('Features Items');
        this.testCasesButtonLocator = this.page.getByRole("link",{name: "Test Cases"});
        this.menuLocator = this.page.locator(".col-sm-8");
        this.productsButtonLocator = this.page.getByRole("link",{name: "Products"});
        this.subscriptionTextLocator = this.page.getByText("Subscription");
        this.subscriptionEmailInputLocator = this.page.getByPlaceholder("Your email address");
        this.subscribeButtonLocator = this.page.locator("#subscribe");
        this.subscribeMessage = this.page.getByText("You have been successfully subscribed!");
        this.cartButtonLocator = this.page.locator('.col-sm-8 a[href="/view_cart"]');
        this.allProductsItemsLocator = this.page.locator(".features_items .col-sm-4");
        this.productViewProductButtonLocator = (product: Locator) => product.getByRole("link",{name: "View Product"});
        this.productNameTextLocator = (product: Locator) => product.locator("p").first();
        this.productPriceTextLocator = (product: Locator) => product.locator("h2").first();
    }

    async goto(){
        await this.page.goto("/");
    }

    async gotoSignUpAndLoginPage(){
        await this.signUpAndLoginPageLocator.click();
    }

    async gotoContactUsPage(){
        await this.contactUsButtonLocator.click();
    }

    async getAllProducts() {
        return this.allProductsItemsLocator;
    }
  
    async clickViewProductButton(product: Locator){
        await this.productViewProductButtonLocator(product).click();
    }

    async clickViewProductButtonByIndex(index: number): Promise<{name: string, price: number}>{
        const products = await this.getAllProducts();
        const product = await products.nth(index);
        const productName = await this.productNameTextLocator(product).textContent() ?? "";
        const productPrice = await textPriceToFloat(await this.productPriceTextLocator(product).textContent() ?? "");
        await this.clickViewProductButton(product);
        return {name: productName, price: productPrice};
    }

    async checkLoggedInName(name){
        const expectedMessage = `Logged in as ${name[0]}`;
        const loggedInMessage = await this.textLoggedInUserLocator.textContent();
        await expect(await this.textLoggedInUserLocator).toBeVisible();
        await expect(await loggedInMessage?.trim()).toBe(expectedMessage);
    }

    async clickDeleteAccount(){
        await this.deleteButtonLocator.click();
    }

    async gotoTestCasesPage(){
        const menu = await this.menuLocator;
        await menu.locator(this.testCasesButtonLocator).click();
    }

    async verifyHomePageItemsLoaded(){
        await expect(await this.featuredItemsTextLocator).toBeVisible();
    }

    async checkHomePageLoad(){
        await expect(await this.featuredItemsTextLocator).toBeVisible();
        await expect(await this.signUpAndLoginPageLocator).toBeVisible();
    }

    async gotoProductsPage(){
        await this.productsButtonLocator.click();
    }

    async logout(){
       await this.logoutButtonLocator.click();
    }

    async verifySubscriptionText(){
        await expect(await this.subscriptionTextLocator).toBeVisible();
    }

    async inputValueToSubscriptionEmailField(email: string){
        await this.subscriptionEmailInputLocator.fill(email);
        await this.subscribeButtonLocator.click();
    }

    async checkSuccessSubscriptionMessage(){
        await expect(await this.subscribeMessage).toBeVisible();
    }

    async gotoCart(){
        await this.cartButtonLocator.click();
    }
}