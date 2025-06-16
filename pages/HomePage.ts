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
    readonly modalContentLocator: Locator;
    readonly categoriesLeftPanelLocator: Locator;
    readonly recomendedItemsTextLocator: Locator;

    readonly productViewProductButtonLocator: (product: Locator) => Locator;
    readonly productNameTextLocator: (product: Locator) => Locator;
    readonly productPriceTextLocator: (product: Locator) => Locator;
    readonly productImageLocator: (product: Locator) => Locator;
    readonly overlayContentAddProductButtonLocator: (overlayContent: Locator) => Locator;
    readonly cartModelContinueShoppingButton: (modalContent: Locator) => Locator;
    readonly cartModelViewCartButton: (modalContent: Locator) => Locator;
    readonly categoriesLocator: (categoriesLeftPanelLocator: Locator) => Locator;
    readonly categoryWithNameLocator: (category: Locator, categoryName: string) => Locator;
    readonly panelDefaultClass: (link: Locator) => Locator;
    readonly productsTextSearchByCategoryLocator: (text: string) => Locator;
    readonly subCategoryCollabseOrInLocator: (panelCategory: Locator,option: string) => Locator;


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
        this.recomendedItemsTextLocator = this.page.getByText("recommended items");
        this.cartButtonLocator = this.page.locator('.col-sm-8 a[href="/view_cart"]');
        this.allProductsItemsLocator = this.page.locator(".features_items .col-sm-4");
        this.modalContentLocator = this.page.locator(".modal-content");
        this.categoriesLeftPanelLocator = this.page.locator(".panel-group.category-products");
        this.productViewProductButtonLocator = (product: Locator) => product.getByRole("link",{name: "View Product"});
        this.productNameTextLocator = (product: Locator) => product.locator("p").first();
        this.productPriceTextLocator = (product: Locator) => product.locator("h2").first();
        this.productImageLocator = (product: Locator) => product.locator("img");
        this.overlayContentAddProductButtonLocator = (product: Locator) => product.locator(".product-overlay a");    
        this.cartModelContinueShoppingButton = (modalContent: Locator) => modalContent.getByRole("button",{name: "Continue Shopping"});
        this.cartModelViewCartButton = (modalContent: Locator) => modalContent.getByRole("link",{name: "View Cart"});
        this.categoriesLocator = (categoriesLeftPanelLocator: Locator) => categoriesLeftPanelLocator.locator(".panel.panel-default");
        this.categoryWithNameLocator = (category: Locator, categoryName: string) => category.getByRole('link', { name: categoryName });
        this.panelDefaultClass = (link: Locator) => link.locator('xpath=ancestor::div[contains(@class,"panel") and contains(@class,"panel-default")]');
        this.productsTextSearchByCategoryLocator = (text: string) => this.page.getByText(text);
        this.subCategoryCollabseOrInLocator = (panelCategory: Locator,option: string) => panelCategory.locator((".panel-collapse" + option));
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

    async verifyRecomendedItemsTextVisible(){
        await expect(this.recomendedItemsTextLocator).toBeVisible();
    }

    async verifyCategoryLeftPanelVisisble(){
        await expect(await this.categoriesLeftPanelLocator).toBeVisible();
    }

    async getAllCategories(){
        await this.verifyCategoryLeftPanelVisisble();
        return await this.categoriesLocator(await this.categoriesLeftPanelLocator);
    }

    async verifySearchByGroupTextIsVissible(categoryName: string, subCategoryName: string){
        await expect(await this.productsTextSearchByCategoryLocator((categoryName + " - " + subCategoryName + " Products"))).toBeVisible();
    }

    // exact option is not working here, beasuse of spaces
    private async clickCategoryByName(name: string): Promise<Locator> {
        await this.categoriesLeftPanelLocator.scrollIntoViewIfNeeded();
        await this.verifyCategoryLeftPanelVisisble();
        const categories = await this.getAllCategories();
        const categoryLinks: Locator[] = [];
        for(const category of await categories.all()){
            const link = await this.categoryWithNameLocator(category,name);
            if(await link.count() > 0)
                categoryLinks.push(link);
        }
        if(categoryLinks.length === 0)
            throw new Error(`Category with name "${name}" not found`);

        if(categoryLinks.length > 1){
            for(const potentialCategoryLink of await categoryLinks){
                const text = (await potentialCategoryLink.textContent() ?? '').trim();
                if (text === name.trim()) {
                    const panelCategory = await this.panelDefaultClass(potentialCategoryLink);
                    await expect(async () => {
                        await potentialCategoryLink.click();
                        await this.page.waitForTimeout(500); // i know it is not a best practice, but for now ;-;
                        const subCategoryIn = await this.subCategoryCollabseOrInLocator(panelCategory,".in");
                        await expect(await subCategoryIn.count()).not.toBe(0);
                    }).toPass();         
                    return panelCategory;
                }
            }
            throw new Error(`Link with name "${name}" not found`);
        }
        else{
            if(categoryLinks.length === 0) throw new Error(`Link with name "${name}" not found`);
            const link = categoryLinks[0];
            const panelCategory = await this.panelDefaultClass(link);   
            await expect(async () => {
                await link.click();
                await this.page.waitForTimeout(500); // i know it is not a best practice, but for now ;-;
                const subCategoryIn = await this.subCategoryCollabseOrInLocator(panelCategory,".in");       
                await expect(await subCategoryIn.count()).not.toBe(0);
            }).toPass();  
            return await this.panelDefaultClass(link);
        }
    }

    async clickSubCategoryOfCategory(categoryName: string, subCategoryName: string){
        const categoty = await this.clickCategoryByName(categoryName);
        const subCategory = await categoty.getByRole("link", {name: subCategoryName});
        await subCategory.click();  
        await this.verifySearchByGroupTextIsVissible(categoryName, subCategoryName); 
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

    async clickProductAddToCartButtonByIndex(index: number): Promise<{ name: string; price: number }>{
        const products = await this.getAllProducts();
        const product = await products.nth(index);
        const productImage = await this.productImageLocator(product);

        //Get product data
        const productName = await this.productNameTextLocator(product).textContent() ?? "";
        const productPrice = await textPriceToFloat(await this.productPriceTextLocator(product).textContent() ?? "");
        await expect(productPrice).not.toBe(0 || "");

        //for all images in page
        /*await this.page.waitForFunction(() => {
            const images = Array.from(document.images);
            return images.length === 0 || images.every(img => img.complete && img.naturalWidth > 0);
        });*/
        
        // wait image to load, because it will depend on hover
        //----
        await this.page.waitForFunction(
            (img) => (img instanceof HTMLImageElement) && img.complete && img.naturalWidth > 0,
            await productImage.elementHandle()
        );
        //----

        //scroll to element (better then scrollIntoViewIfNeeded, because it will scroll element to the top)
        //----
        await this.page.evaluate((element) => {
             element?.scrollIntoView({ behavior: 'smooth', block: 'start' }); //same as "((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'start'});", element);"
        }, await productImage.elementHandle());
        //----
        
        this.page.waitForTimeout(300);

        await product.hover();
        await this.page.waitForTimeout(600);

        const overlayContentAddProductButton = await this.overlayContentAddProductButtonLocator(product);
        await expect(overlayContentAddProductButton).toBeVisible();
        await expect(overlayContentAddProductButton).toBeInViewport();
        await expect(await overlayContentAddProductButton.isEnabled()).toBeTruthy();
        await overlayContentAddProductButton.hover();
        await overlayContentAddProductButton.click();

        return {name: productName, price: productPrice};
    }

    async checkSuccessSubscriptionMessage(){
        await expect(await this.subscribeMessage).toBeVisible();
    }

    async gotoCart(){
        await this.cartButtonLocator.click();
    }

    async clickContinueShoppingButton(){
        await expect(await this.modalContentLocator).toBeVisible();
        await expect(await this.cartModelContinueShoppingButton(await this.modalContentLocator)).toBeVisible({timeout: 20000});
        await this.cartModelContinueShoppingButton(await this.modalContentLocator).click();
    }

    async clickViewCartButton(){
        await expect(await this.modalContentLocator).toBeVisible();
        await expect(await this.cartModelViewCartButton(await this.modalContentLocator)).toBeVisible({timeout: 20000});
        await this.cartModelViewCartButton(await this.modalContentLocator).click();
    }
}