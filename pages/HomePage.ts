import { Locator, Page, expect } from "@playwright/test";
import { textPriceToFloat } from "../Helper/tools";
import { BasePage } from "../Helper/BasePage";
import { ProductInfo } from "../Helper/ProductInfo";

export class HomePage extends BasePage {
    readonly locators: {
        signUpAndLoginPageLocator: Locator;
        deleteButtonLocator: Locator;
        logoutButtonLocator: Locator;
        textLoggedInUserLocator: Locator;
        contactUsButtonLocator: Locator;
        featuredItemsTextLocator: Locator;
        testCasesButtonLocator: Locator;
        menuLocator: Locator;
        productsButtonLocator: Locator;
        subscriptionTextLocator: Locator;
        subscriptionEmailInputLocator: Locator;
        subscribeButtonLocator: Locator;
        subscribeMessage: Locator;
        cartButtonLocator: Locator;
        allProductsItemsLocator: Locator;
        modalContentLocator: Locator;
        categoriesLeftPanelLocator: Locator;
        recomendedItemsTextLocator: Locator;
        recomendedItemsActiveLocator: Locator;
        productViewProductButtonLocator: (product: Locator) => Locator;
        productNameTextLocator: (product: Locator) => Locator;
        productPriceTextLocator: (product: Locator) => Locator;
        productImageLocator: (product: Locator) => Locator;
        overlayContentAddProductButtonLocator: (overlayContent: Locator) => Locator;
        cartModelContinueShoppingButton: (modalContent: Locator) => Locator;
        cartModelViewCartButton: (modalContent: Locator) => Locator;
        categoriesLocator: (categoriesLeftPanelLocator: Locator) => Locator;
        categoryWithNameLocator: (category: Locator, categoryName: string) => Locator;
        panelDefaultClass: (link: Locator) => Locator;
        productsTextSearchByCategoryLocator: (text: string) => Locator;
        subCategoryCollabseOrInLocator: (panelCategory: Locator,option: string) => Locator;
        recomendedItemsAddToCartButtonLocator: (product: Locator) => Locator;
    };

    readonly assertions: {
        expectPageLoaded: () => Promise<void>;
        expectLoggedInNameIsVisible: (firstName: string) => Promise<void>;
        expectRecomendedItemsTextVisible: () => Promise<void>;
        expectCategoryLeftPanelVisisble: () => Promise<void>;
        expectSearchByGroupTextIsVissible: (categoryName: string, subCategoryName: string) => Promise<void>;
        expectHomePageItemsLoaded: () => Promise<void>;
        expectSubscriptionText: () => Promise<void>;
        expectSuccessSubscriptionMessage: () => Promise<void>;
    };

    readonly actions: {
        clickSignUpAndLoginLink: () => Promise<void>;
        clickContactUs: () => Promise<void>;
        clickViewProductButton: (product: Locator) => Promise<void>;
        clickViewProductButtonByIndex: (index: number) => Promise<ProductInfo>;
        getAllCategories: () => Promise<Locator>;
        clickCategoryByName: (name: string) => Promise<Locator>;
        clickSubCategoryOfCategory: (categoryName: string, subCategoryName: string) => Promise<void>;
        clickDeleteAccount: () => Promise<void>;
        gotoTestCasesPage: () => Promise<void>;
        clickProductsPageButton: () => Promise<void>;
        clickLogoutButton: () => Promise<void>;
        inputValueToSubscriptionEmailField: (email: string) => Promise<void>;
        clickProductAddToCartButtonByIndex: (index: number) => Promise<ProductInfo>;
        getActiveRecomendedItems: () => Promise<Locator>;
        clickAddToCartRecomendedItemsByIndex: (index: number) => Promise<ProductInfo>;
        clickCartButton: () => Promise<void>;
        clickContinueShoppingButton: () => Promise<void>;
        clickViewCartButton: () => Promise<void>;
    };



    constructor(page: Page) {
        super(page);

        this.locators = {
            signUpAndLoginPageLocator : this.page.getByRole('link', { name: 'Signup / Login' }),
            deleteButtonLocator : this.page.getByRole("link",{name: " Delete Account"}),
            logoutButtonLocator : this.page.getByRole('link', { name: 'Logout' }),
            textLoggedInUserLocator : this.page.getByText('Logged in as', { exact: false }),
            contactUsButtonLocator : this.page.getByRole('link', { name: 'Contact us' }),
            featuredItemsTextLocator : this.page.getByText('Features Items'),
            testCasesButtonLocator : this.page.getByRole("link",{name: "Test Cases"}),
            menuLocator : this.page.locator(".col-sm-8"),
            productsButtonLocator : this.page.getByRole("link",{name: "Products"}),
            subscriptionTextLocator : this.page.getByText("Subscription"),
            subscriptionEmailInputLocator : this.page.getByPlaceholder("Your email address"),
            subscribeButtonLocator : this.page.locator("#subscribe"),
            subscribeMessage : this.page.getByText("You have been successfully subscribed!"),
            recomendedItemsTextLocator : this.page.getByText("recommended items"),
            cartButtonLocator : this.page.locator('.col-sm-8 a[href="/view_cart"]'),
            allProductsItemsLocator : this.page.locator(".features_items .col-sm-4"),
            modalContentLocator : this.page.locator(".modal-content"),
            categoriesLeftPanelLocator : this.page.locator(".panel-group.category-products"),
            recomendedItemsActiveLocator : this.page.locator("#recommended-item-carousel .item.active .col-sm-4"),
            recomendedItemsAddToCartButtonLocator : (product: Locator) => product.locator(".btn.btn-default.add-to-cart"),
            productViewProductButtonLocator : (product: Locator) => product.getByRole("link",{name: "View Product"}),
            productNameTextLocator : (product: Locator) => product.locator("p").first(),
            productPriceTextLocator : (product: Locator) => product.locator("h2").first(),
            productImageLocator : (product: Locator) => product.locator("img"),
            overlayContentAddProductButtonLocator : (product: Locator) => product.locator(".product-overlay a"),    
            cartModelContinueShoppingButton : (modalContent: Locator) => modalContent.getByRole("button",{name: "Continue Shopping"}),
            cartModelViewCartButton : (modalContent: Locator) => modalContent.getByRole("link",{name: "View Cart"}),
            categoriesLocator : (categoriesLeftPanelLocator: Locator) => categoriesLeftPanelLocator.locator(".panel.panel-default"),
            categoryWithNameLocator : (category: Locator, categoryName: string) => category.getByRole('link', { name: categoryName }),
            panelDefaultClass : (link: Locator) => link.locator('xpath=ancestor::div[contains(@class,"panel") and contains(@class,"panel-default")]'),
            productsTextSearchByCategoryLocator : (text: string) => this.page.getByText(text),
            subCategoryCollabseOrInLocator : (panelCategory: Locator,option: string) => panelCategory.locator((".panel-collapse" + option)),
        };

        this.assertions = {
            expectPageLoaded: async () => {
                await expect(await this.locators.featuredItemsTextLocator).toBeVisible();
            },
            
            expectLoggedInNameIsVisible: async (firstName: string) => {
                const expectedMessage = `Logged in as ${firstName}`;
                const loggedInMessage = await this.locators.textLoggedInUserLocator.textContent();
                await expect(await this.locators.textLoggedInUserLocator).toBeVisible();
                await expect(await loggedInMessage?.trim()).toBe(expectedMessage);
            },

            expectRecomendedItemsTextVisible: async () => {
                await expect(this.locators.recomendedItemsTextLocator).toBeVisible();
            },

            expectCategoryLeftPanelVisisble: async () => {
                await expect(await this.locators.categoriesLeftPanelLocator).toBeVisible();
            }, 

            expectSearchByGroupTextIsVissible: async (categoryName: string, subCategoryName: string) => {
                await expect(await this.locators.productsTextSearchByCategoryLocator((categoryName + " - " + subCategoryName + " Products"))).toBeVisible();
            },

            expectHomePageItemsLoaded: async () => {
                await expect(await this.locators.featuredItemsTextLocator).toBeVisible();
            },

            expectSubscriptionText: async () => {
                await expect(await this.locators.subscriptionTextLocator).toBeVisible();
            },

            expectSuccessSubscriptionMessage: async () => {
                await expect(await this.locators.subscribeMessage).toBeVisible();
            },
        };

        this.actions = {
            clickSignUpAndLoginLink: async () => {
                await this.locators.signUpAndLoginPageLocator.click();
            },

            clickContactUs: async () => {
                await this.locators.contactUsButtonLocator.click();
            },

            clickViewProductButton: async (product: Locator) => {
                await this.locators.productViewProductButtonLocator(product).click();
            },

            clickViewProductButtonByIndex: async (index: number): Promise<ProductInfo> => {
                const products = await this.locators.allProductsItemsLocator;
                const product = await products.nth(index);
                const productName = await this.locators.productNameTextLocator(product).textContent() ?? "";
                const productPrice = await textPriceToFloat(await this.locators.productPriceTextLocator(product).textContent() ?? "");
                await this.actions.clickViewProductButton(product);
                return new ProductInfo(productName, productPrice,1);
            },

            getAllCategories: async (): Promise<Locator> => {
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
                                await this.page.waitForTimeout(500); //wait for animation
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
                        await this.page.waitForTimeout(500); //wait for animation
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

            clickDeleteAccount: async () => {
                await this.locators.deleteButtonLocator.click();
            },

            gotoTestCasesPage: async () => {
                const menu = await this.locators.menuLocator;
                await menu.locator(this.locators.testCasesButtonLocator).click();
            },

            clickProductsPageButton: async () => {
                await this.locators.productsButtonLocator.click();
            },

            clickLogoutButton: async () => {
                await this.locators.logoutButtonLocator.click();
            },

            inputValueToSubscriptionEmailField: async (email: string) => {
                await this.locators.subscriptionEmailInputLocator.fill(email);
                await this.locators.subscribeButtonLocator.click();
            },

            clickProductAddToCartButtonByIndex: async (index: number): Promise<ProductInfo> => {
                const products = await this.locators.allProductsItemsLocator;
                const product = await products.nth(index);
                const productImage = await this.locators.productImageLocator(product);

                //Get product data
                const productName = await this.locators.productNameTextLocator(product).textContent() ?? "";
                const productPrice = await textPriceToFloat(await this.locators.productPriceTextLocator(product).textContent() ?? "");
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
            
                const overlayContentAddProductButton = await this.locators.overlayContentAddProductButtonLocator(product);
                await expect(overlayContentAddProductButton).toBeVisible();
                await expect(overlayContentAddProductButton).toBeInViewport();
                await expect(await overlayContentAddProductButton.isEnabled()).toBeTruthy();
                await overlayContentAddProductButton.hover();
                await overlayContentAddProductButton.click();
            
                return new ProductInfo(productName, productPrice,1);
            },

            getActiveRecomendedItems: async (): Promise<Locator> => {
                return await this.locators.recomendedItemsActiveLocator;
            },

            clickAddToCartRecomendedItemsByIndex: async (index: number): Promise<ProductInfo> => {
                const products = await this.actions.getActiveRecomendedItems();
                const product = await products.nth(index);

                //Get product data
                const productName = await this.locators.productNameTextLocator(product).textContent() ?? "";
                const productPrice = await textPriceToFloat(await this.locators.productPriceTextLocator(product).textContent() ?? "");

                await this.locators.recomendedItemsAddToCartButtonLocator(product).click();
                return new ProductInfo(productName, productPrice,1);
            },

            clickCartButton: async () => {
                await this.locators.cartButtonLocator.click();
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
        };

    }
}