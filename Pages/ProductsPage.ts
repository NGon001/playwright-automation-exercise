import { Locator, Page, expect } from "@playwright/test";
import { textPriceToFloat } from "../Helper/Tools";
import { BasePage } from "../Helper/BasePage";
import { ProductInfo } from "../Helper/ProductInfo";

export class ProductsPage extends BasePage{
    readonly locators: {
        allProductsTextLocator: Locator;
        allProductsItemsLocator: Locator;
        searchInputLocator: Locator;
        submitSearchButtonLocator: Locator;
        searchedProductsTextLocator: Locator;
        cartModelContinueShoppingButton: (modalContent: Locator) => Locator;
        cartModelViewCartButton: (modalContent: Locator) => Locator;
        productAddToCartTextLocator: Locator;
        viewProductLinkLocator: (product: Locator) => Locator;
        overlayContentAddProductButtonLocator: (overlayContent: Locator) => Locator;
        productOverlayHoverLocator: (product: Locator) => Locator;
        productViewProductButtonLocator: (product: Locator) => Locator;
        productNameTextLocator: (product: Locator) => Locator;
        productPriceTextLocator: (product: Locator) => Locator;
        productImageLocator: (product: Locator) => Locator;
        modalContentLocator: Locator;
        categoriesLeftPanelLocator: Locator;
        categoriesLocator: (categoriesLeftPanelLocator: Locator) => Locator;
        categoryWithNameLocator: (category: Locator, categoryName: string) => Locator;
        panelDefaultClass: (link: Locator) => Locator;
        productsTextSearchByCategoryLocator: (text: string) => Locator;
        subCategoryCollabseOrInLocator: (panelCategory: Locator,option: string) => Locator;
    };

    readonly assertions: {
        expectProductsTextIsVissible: () => Promise<void>;
        expectProductsExist: () => Promise<void>;
        expectSearchedProductsComplited: () => Promise<void>;
        expectProductNameMatchesKeyWord: (product: Locator,keyWord: string) => Promise<boolean>;
        expectPassedProducts: (productCount: string, expectProductCount: string) => Promise<void>;
        expectSearchByGroupTextIsVissible: (categoryName: string, subCategoryName: string) => Promise<void>;
        expectCategoryLeftPanelVisisble: () => Promise<void>;
    };

    readonly actions: {
        gotoProduct: (link: string) => Promise<void>;
        getProductDetailLink: (product: Locator) => Promise<string | null>;
        clickViewProductButton: (product: Locator) => Promise<void>;
        clickViewProductButtonByIndex: (index: number) => Promise<ProductInfo>;
        searchProducts: (productsName: string) => Promise<void>;
        getLinksOfProductsThatDoNotMatchKeyword: (keyWord: string) => Promise<string[]>;
        clickProductAddToCartButtonByIndex: (index: number) => Promise<ProductInfo>;
        clickContinueShoppingButton: () => Promise<void>;
        clickViewCartButton: () => Promise<void>;
        getAllCategories: () => Promise<Locator>;
        clickCategoryByName: (name: string) => Promise<Locator>;
        clickSubCategoryOfCategory: (categoryName: string, subCategoryName: string) => Promise<void>;
        getProductCount: () => Promise<number>;
    };

    constructor(page: Page){
        super(page);

        this.locators = {
            allProductsTextLocator : this.page.getByText("All Products", {exact: true}),
            allProductsItemsLocator : this.page.locator(".features_items .col-sm-4"),
            searchInputLocator : this.page.getByPlaceholder("Search Product"),
            submitSearchButtonLocator : this.page.locator("#submit_search"),
            searchedProductsTextLocator : this.page.getByText("Searched Products"),
            cartModelContinueShoppingButton : (modalContent: Locator) => modalContent.getByRole("button",{name: "Continue Shopping"}),
            cartModelViewCartButton : (modalContent: Locator) => modalContent.getByRole("link",{name: "View Cart"}),
            viewProductLinkLocator : (product: Locator) => product.getByRole("link", { name: "View Product" }),
            overlayContentAddProductButtonLocator : (product: Locator) => product.locator(".product-overlay a"),
            productOverlayHoverLocator : (product: Locator) => product.locator(".product-overlay"),
            productViewProductButtonLocator : (product: Locator) => product.getByRole("link",{name: "View Product"}),
            productNameTextLocator : (product: Locator) => product.locator("p").first(),
            productPriceTextLocator : (product: Locator) => product.locator("h2").first(),
            productImageLocator : (product: Locator) => product.locator("img"),
            productAddToCartTextLocator : this.page.getByText("Your product has been added"),
            modalContentLocator : this.page.locator(".modal-content"),
            categoriesLeftPanelLocator : this.page.locator(".panel-group.category-products"),
            categoriesLocator : (categoriesLeftPanelLocator: Locator) => categoriesLeftPanelLocator.locator(".panel.panel-default"),
            categoryWithNameLocator : (category: Locator, categoryName: string) => category.getByRole('link', { name: categoryName }),
            panelDefaultClass : (link: Locator) => link.locator('xpath=ancestor::div[contains(@class,"panel") and contains(@class,"panel-default")]'),
            productsTextSearchByCategoryLocator : (text: string) => this.page.getByText(text),
            subCategoryCollabseOrInLocator : (panelCategory: Locator,option: string) => panelCategory.locator((".panel-collapse" + option)),
        };

        this.assertions = {
            expectProductsTextIsVissible: async () => {
                await expect(await this.locators.allProductsTextLocator).toBeVisible();
            },

            expectProductsExist: async () => {
                const products = await this.locators.allProductsItemsLocator;
                await expect(await products.count()).not.toBe(0);
            },

            expectSearchedProductsComplited: async () => {
                await expect(this.locators.searchedProductsTextLocator).toBeVisible({timeout: 500});
            },

            expectProductNameMatchesKeyWord: async (product: Locator,keyWord: string): Promise<boolean> => {
                const productName = await this.locators.productNameTextLocator(await product).textContent();
                if(!productName) throw new Error("Product name is null");
                return productName.toLowerCase().includes(keyWord.toLowerCase());
            },

            expectPassedProducts: async (productCount: string, expectProductCount: string) => {
                await expect(productCount).toBe(expectProductCount);
            },

            expectSearchByGroupTextIsVissible: async (categoryName: string, subCategoryName: string) => {
                await expect(await this.locators.productsTextSearchByCategoryLocator((categoryName + " - " + subCategoryName + " Products"))).toBeVisible();
            },

            expectCategoryLeftPanelVisisble: async () => {
                await expect(await this.locators.categoriesLeftPanelLocator).toBeVisible();
            }
        };

        this.actions = {
            gotoProduct: async (link: string) => {
                await this.page.goto(link);
            },

            getProductDetailLink: async (product: Locator) => {
                return await this.locators.viewProductLinkLocator(await product).getAttribute("href");
            },

            clickViewProductButton: async (product: Locator) => {
                await this.locators.productViewProductButtonLocator(product).click();
            },

            clickViewProductButtonByIndex: async (index: number) => {
                const products = await this.locators.allProductsItemsLocator;
                const product = await products.nth(index);
                const productName = await this.locators.productNameTextLocator(product).textContent() ?? "";
                const productPrice = await textPriceToFloat(await this.locators.productPriceTextLocator(product).textContent() ?? "");
                await this.actions.clickViewProductButton(product);
                return new ProductInfo(productName, productPrice, 1);
            },

            searchProducts: async (productsName: string) => {
                await this.locators.searchInputLocator.clear();
                await this.locators.searchInputLocator.fill(productsName);
                await expect(async() =>{
                    await this.locators.submitSearchButtonLocator.click();
                    await this.assertions.expectSearchedProductsComplited();
                }).toPass();
            },

            getLinksOfProductsThatDoNotMatchKeyword: async (keyWord: string) => {
                const products = await this.locators.allProductsItemsLocator;
                let productsLinksToCheck: string[] = [];

                for(const product of await products.all()){
                    if(!await this.assertions.expectProductNameMatchesKeyWord(product,keyWord))
                    {
                        const productDetailLink = await this.actions.getProductDetailLink(product) ?? "";
                        await expect(productDetailLink).not.toBe("");
                        productsLinksToCheck.push(productDetailLink);
                    }
                    else{
                        await expect(this.assertions.expectProductNameMatchesKeyWord(product,keyWord)).toBeTruthy();
                    }
                }
            
                return productsLinksToCheck;
            },

            clickProductAddToCartButtonByIndex: async (index: number): Promise<ProductInfo> => {
                const products = await this.locators.allProductsItemsLocator;
                const product = await products.nth(index);
                const productImage = await this.locators.productImageLocator(product);

                //Get product data
                const productName = await this.locators.productNameTextLocator(product).textContent() ?? "";
                const productPrice = await textPriceToFloat(await this.locators.productPriceTextLocator(product).textContent() ?? "");
                await expect(productPrice).not.toBe(0 || "");

                await this.waitForImageToLoad(productImage);
            
                await this.scrollToElement(productImage);

                await product.hover({ trial: true });

                const overlayContentAddProductButton = this.locators.overlayContentAddProductButtonLocator(product);
                await expect(overlayContentAddProductButton).toBeVisible();
                await expect(overlayContentAddProductButton).toBeInViewport();
                await expect(await overlayContentAddProductButton.isEnabled()).toBeTruthy();
                await overlayContentAddProductButton.hover();
                await overlayContentAddProductButton.click();
            
                return new ProductInfo(productName, productPrice,1);
            },

            clickContinueShoppingButton: async () => {
                await expect(await this.locators.modalContentLocator).toBeVisible();
                await expect(await this.locators.cartModelContinueShoppingButton(await this.locators.modalContentLocator)).toBeVisible({timeout: 20000});
                await this.locators.cartModelContinueShoppingButton(await this.locators.modalContentLocator).click();
            },

            clickViewCartButton: async () => {
                await expect(await this.locators.modalContentLocator).toBeVisible();
                await expect(await this.locators.cartModelViewCartButton(await this.locators.modalContentLocator)).toBeVisible({timeout: 20000});
                await this.locators.cartModelViewCartButton(await this.locators.modalContentLocator).click();
            },

            getAllCategories: async () => {
                await this.assertions.expectCategoryLeftPanelVisisble();
                return await this.locators.categoriesLocator(await this.locators.categoriesLeftPanelLocator);
            },

            clickCategoryByName: async (name: string): Promise<Locator> => {
                await this.locators.categoriesLeftPanelLocator.scrollIntoViewIfNeeded();
                await this.assertions.expectCategoryLeftPanelVisisble();
                const categories = await this.actions.getAllCategories();
                const categoryLinks: Locator[] = [];
                for(const category of await categories.all()){
                    const link = await this.locators.categoryWithNameLocator(category,name);
                    if(await link.count() > 0)
                        categoryLinks.push(link);
                }
                if(categoryLinks.length === 0)
                    throw new Error(`Category with name "${name}" not found`);
            
                if(categoryLinks.length > 1){
                    for(const potentialCategoryLink of await categoryLinks){
                        const text = (await potentialCategoryLink.textContent() ?? '').trim();
                        if (text === name.trim()) {
                            const panelCategory = await this.locators.panelDefaultClass(potentialCategoryLink);
                            await expect(async () => {
                                await potentialCategoryLink.click();
                                await this.page.waitForTimeout(500); // i know it is not a best practice, but for now ;-;
                                const subCategoryIn = await this.locators.subCategoryCollabseOrInLocator(panelCategory,".in");
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
                    const panelCategory = await this.locators.panelDefaultClass(link);   
                    await expect(async () => {
                        await link.click();
                        await this.page.waitForTimeout(500); // i know it is not a best practice, but for now ;-;
                        const subCategoryIn = await this.locators.subCategoryCollabseOrInLocator(panelCategory,".in");       
                        await expect(await subCategoryIn.count()).not.toBe(0);
                    }).toPass();  
                    return await this.locators.panelDefaultClass(link);
                }
            },

            clickSubCategoryOfCategory: async (categoryName: string, subCategoryName: string) => {
                const categoty = await this.actions.clickCategoryByName(categoryName);
                const subCategory = await categoty.getByRole("link", {name: subCategoryName});
                await subCategory.click();  
                await this.assertions.expectSearchByGroupTextIsVissible(categoryName, subCategoryName); 
            },

            getProductCount: async () => {
                return await (await this.locators.allProductsItemsLocator).count();
            }
        };
    }
}