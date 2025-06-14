import { Locator, Page, expect } from "@playwright/test";
import { textPriceToFloat } from "../Helper/tools";

export class ProductsPage{
    readonly page: Page;
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

    constructor(page: Page){
        this.page = page;
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

    async clickProductViewProductButtonByIndex(index: number){
        const products = await this.getAllProducts();
        await this.clickViewProductButton(products.nth(index));
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

    async verifyPassedProducts(productCount,expectProductCount){
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