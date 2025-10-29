import { Locator, Page, expect } from "@playwright/test";
import { textPriceToFloat } from "../Helper/tools";
import { BasePage } from "../Helper/BasePage";
import { ProductInfo } from "../Helper/base";

export class ProductsPage extends BasePage{
    readonly allProductsTextLocator: Locator;
    readonly allProductsItemsLocator: Locator;
    readonly searchInputLocator: Locator;
    readonly submitSearchButtonLocator: Locator;
    readonly searchedProductsTextLocator: Locator;
    readonly cartModelContinueShoppingButton: (modalContent: Locator) => Locator;
    readonly cartModelViewCartButton: (modalContent: Locator) => Locator;
    readonly productAddToCartTextLocator: Locator;
    readonly viewProductLinkLocator: (product: Locator) => Locator;
    readonly overlayContentAddProductButtonLocator: (overlayContent: Locator) => Locator;
    readonly productOverlayHoverLocator: (product: Locator) => Locator;
    readonly productViewProductButtonLocator: (product: Locator) => Locator;
    readonly productNameTextLocator: (product: Locator) => Locator;
    readonly productPriceTextLocator: (product: Locator) => Locator;
    readonly productImageLocator: (product: Locator) => Locator;
    readonly modalContentLocator: Locator;
    readonly categoriesLeftPanelLocator: Locator;
    readonly categoriesLocator: (categoriesLeftPanelLocator: Locator) => Locator;
    readonly categoryWithNameLocator: (category: Locator, categoryName: string) => Locator;
    readonly panelDefaultClass: (link: Locator) => Locator;
    readonly productsTextSearchByCategoryLocator: (text: string) => Locator;
    readonly subCategoryCollabseOrInLocator: (panelCategory: Locator,option: string) => Locator;

    constructor(page: Page){
        super(page);
        this.allProductsTextLocator = this.page.getByText("All Products", {exact: true});
        this.allProductsItemsLocator = this.page.locator(".features_items .col-sm-4");
        this.searchInputLocator = this.page.getByPlaceholder("Search Product");
        this.submitSearchButtonLocator = this.page.locator("#submit_search");
        this.searchedProductsTextLocator = this.page.getByText("Searched Products");
        this.cartModelContinueShoppingButton = (modalContent: Locator) => modalContent.getByRole("button",{name: "Continue Shopping"});
        this.cartModelViewCartButton = (modalContent: Locator) => modalContent.getByRole("link",{name: "View Cart"});
        this.viewProductLinkLocator = (product: Locator) => product.getByRole("link", { name: "View Product" });
        this.overlayContentAddProductButtonLocator = (product: Locator) => product.locator(".product-overlay a");
        this.productOverlayHoverLocator = (product: Locator) => product.locator(".product-overlay");
        this.productViewProductButtonLocator = (product: Locator) => product.getByRole("link",{name: "View Product"});
        this.productNameTextLocator = (product: Locator) => product.locator("p").first();
        this.productPriceTextLocator = (product: Locator) => product.locator("h2").first();
        this.productImageLocator = (product: Locator) => product.locator("img");
        this.productAddToCartTextLocator = this.page.getByText("Your product has been added");
        this.modalContentLocator = this.page.locator(".modal-content");
        this.categoriesLeftPanelLocator = this.page.locator(".panel-group.category-products");
        this.categoriesLocator = (categoriesLeftPanelLocator: Locator) => categoriesLeftPanelLocator.locator(".panel.panel-default");
        this.categoryWithNameLocator = (category: Locator, categoryName: string) => category.getByRole('link', { name: categoryName });
        this.panelDefaultClass = (link: Locator) => link.locator('xpath=ancestor::div[contains(@class,"panel") and contains(@class,"panel-default")]');
        this.productsTextSearchByCategoryLocator = (text: string) => this.page.getByText(text);
        this.subCategoryCollabseOrInLocator = (panelCategory: Locator,option: string) => panelCategory.locator((".panel-collapse" + option));
    }

    async gotoProduct(link: string){
        await this.page.goto(link);
    }

    async checkIfAllProductsTextIsVissible(){
        await expect(await this.allProductsTextLocator).toBeVisible();
    }

    async getAllProducts() {
        return this.allProductsItemsLocator;
    }

    async checkIfProductsExist() {
        const products = await this.getAllProducts();
        await expect(await products.count()).not.toBe(0);
    }

    async getProductDetailLink(product: Locator){
        return await this.viewProductLinkLocator(await product).getAttribute("href");
    }

    async clickViewProductButton(product: Locator){
        await this.productViewProductButtonLocator(product).click();
    }

    async clickViewProductButtonByIndex(index: number): Promise<ProductInfo>{
        const products = await this.getAllProducts();
        const product = await products.nth(index);
        const productName = await this.productNameTextLocator(product).textContent() ?? "";
        const productPrice = await textPriceToFloat(await this.productPriceTextLocator(product).textContent() ?? "");
        await this.clickViewProductButton(product);
        return new ProductInfo(productName, productPrice, 1);
    }

    async verefyThatProductsSearchComplited(){
        await expect(this.searchedProductsTextLocator).toBeVisible({timeout: 500});
    }

    async searchProducts(productsName: string){
        await this.searchInputLocator.clear();
        await this.searchInputLocator.fill(productsName);
        await expect(async() =>{
            await this.submitSearchButtonLocator.click();
            await this.verefyThatProductsSearchComplited();
        }).toPass();
    }

    async checkIfProductNameIsMatchingWithKeyWord(product: Locator,keyWord: string){
        const productName = await this.productNameTextLocator(await product).textContent() ?? "";
        return productName.toLowerCase().includes(keyWord.toLowerCase());
    }

    async verifyPassedProducts(productCount: string, expectProductCount: string){
        await expect(productCount).toBe(expectProductCount);
    }

    async getLinksOfProductsThatDoNotMatchKeyword(keyWord: string){
        const products = await this.getAllProducts();
        let productsLinksToCheck: string[] = [];

        for(const product of await products.all()){
            if(!await this.checkIfProductNameIsMatchingWithKeyWord(product,keyWord))
            {
                const productDetailLink = await this.getProductDetailLink(product) ?? "";
                await expect(productDetailLink).not.toBe("");
                productsLinksToCheck.push(productDetailLink);
            }
            else{
                await expect(this.checkIfProductNameIsMatchingWithKeyWord(product,keyWord)).toBeTruthy();
            }
        }

        return productsLinksToCheck;
    }

    async clickProductAddToCartButtonByIndex(index: number): Promise<ProductInfo>{
        const products = await this.getAllProducts();
        const product = await products.nth(index);
        const productImage = await this.productImageLocator(product);

        //Get product data
        const productName = await this.productNameTextLocator(product).textContent() ?? "";
        const productPrice = await textPriceToFloat(await this.productPriceTextLocator(product).textContent() ?? "");
        await expect(productPrice).not.toBe(0 || "");
        
        // wait image to load, because it will depend on hover (not loaded image, will not have size and hover will not work)
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

        return new ProductInfo(productName, productPrice,1);
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

    async verifySearchByGroupTextIsVissible(categoryName: string, subCategoryName: string){
        await expect(await this.productsTextSearchByCategoryLocator((categoryName + " - " + subCategoryName + " Products"))).toBeVisible();
    }

    async verifyCategoryLeftPanelVisisble(){
        await expect(await this.categoriesLeftPanelLocator).toBeVisible();
    }

    async getAllCategories(){
        await this.verifyCategoryLeftPanelVisisble();
        return await this.categoriesLocator(await this.categoriesLeftPanelLocator);
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

    async getProductCount(){
        return await (await this.getAllProducts()).count();
    }
}