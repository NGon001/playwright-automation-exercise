import { Locator, Page, expect } from "@playwright/test";
import { expectTextNotBeNull } from "../Helper/tools";
import { BasePage } from "../Helper/BasePage";

export class ProductPage extends BasePage{
    readonly locators: {
        productInformationSectionLocator: Locator;
        prductInformationSectionCategoryLocator: (productInformationSection: Locator) => Locator;
        prductInformationSectionPriceLocator: (productInformationSection: Locator) => Locator;
        prductInformationSectionAvailabilityLocator: (productInformationSection: Locator) => Locator;
        prductInformationNameLocator: (productInformationSection: Locator) => Locator;
        prductInformationSectionBrandLocator: (productInformationSection: Locator) => Locator;
        prductInformationSectionConditionLocator: (productInformationSection: Locator) => Locator;
        productInformationSectionQuantityLocator: (productInformationSection: Locator) => Locator;
        productInformationSectionAddToCartButtonLocator: (productInformationSection: Locator) => Locator;
        cartModelViewCartButton: (modalContent: Locator) => Locator;
        modalContentLocator: Locator;
        cartModelContinueShoppingButton: (modalContent: Locator) => Locator;
        productImageLocator: Locator;
        cartButtonLocator: Locator;
        writeReviewTextLocator: Locator;
        reviewNameInputLocator: Locator;
        reviewEmailInputLocator: Locator;
        reviewTextAreaInputLocator: Locator;
        reviewSubmitButtonLocator: Locator;
        reviewSuccessMessageTextLocator: Locator;
    };

    readonly assertions: {
        expectImageWasLoaded: (image: Locator) => Promise<void>;
        expectWriteReviewTextVissible: () => Promise<void>;
        expectThatProductInformationIsVisible: () => Promise<void>;
        expectMatchingCategory: (keyWord: string) => Promise<void>;
    };

    readonly actions: {
        fillReviewForm: (firstName: string, lastName: string, email: string, message: string) => Promise<void>;
        clickReviewSubmitButton: () => Promise<void>;
        setQuantity: (quantity: number) => Promise<void>;
        clickAddToCartButton: () => Promise<void>;
        clickContinueShoppingButton: () => Promise<void>;
        clickViewCartButton: () => Promise<void>;
        gotoCart: () => Promise<void>;
    };

    constructor(page: Page){
        super(page);

        this.locators = {
            productInformationSectionLocator : this.page.locator(".product-information"),
            prductInformationSectionCategoryLocator : (productInformationSection: Locator) => productInformationSection.getByText("Category:"),
            prductInformationSectionPriceLocator : (productInformationSection: Locator) => productInformationSection.locator("span span"),
            prductInformationSectionAvailabilityLocator : (productInformationSection: Locator) => productInformationSection.locator("p",{hasText: "Availability:"}),
            prductInformationNameLocator : (productInformationSection: Locator) => productInformationSection.locator("h2"),
            prductInformationSectionBrandLocator : (productInformationSection: Locator) => productInformationSection.locator("p",{hasText: "Brand:"}),
            prductInformationSectionConditionLocator : (productInformationSection: Locator) => productInformationSection.locator("p",{hasText: "Condition:"}),
            productInformationSectionQuantityLocator : (productInformationSection: Locator) => productInformationSection.locator("#quantity"),
            productInformationSectionAddToCartButtonLocator : (productInformationSection: Locator) => productInformationSection.getByRole("button",{name: "Add to cart"}),
            cartModelViewCartButton : (modalContent: Locator) => modalContent.getByRole("link",{name: "View Cart"}),
            modalContentLocator : this.page.locator(".modal-content"),
            cartModelContinueShoppingButton : (modalContent: Locator) => modalContent.getByRole("button",{name: "Continue Shopping"}),
            writeReviewTextLocator : this.page.getByRole("link",{name: "Write Your Review"}),
            productImageLocator : this.page.locator(".col-sm-5 img"),
            cartButtonLocator : this.page.locator('.col-sm-8 a[href:"/view_cart"]'),
            reviewNameInputLocator : this.page.getByPlaceholder("Your Name"),
            reviewEmailInputLocator : this.page.getByPlaceholder("Email Address",{exact:true}),
            reviewTextAreaInputLocator : this.page.getByPlaceholder("Add Review Here!"),
            reviewSubmitButtonLocator : this.page.getByRole("button",{name: "Submit"}),
            reviewSuccessMessageTextLocator : this.page.getByText("Thank you for your review."),
        };

        this.assertions = {
            expectImageWasLoaded: async (image: Locator) => {
                await expect(await this.page.waitForFunction(
                    (img) => (img instanceof HTMLImageElement) && img.complete && img.naturalWidth > 0,
                    await image.elementHandle()
                )).toBeTruthy();
            },

            expectWriteReviewTextVissible: async () => {
                await this.assertions.expectImageWasLoaded(await this.locators.productImageLocator);
                await expect(await this.locators.writeReviewTextLocator).toBeVisible();
            },

            expectThatProductInformationIsVisible: async () => {
                const productName = await this.locators.prductInformationNameLocator(await this.locators.productInformationSectionLocator).textContent();
                const productCategoryText = await this.locators.prductInformationSectionCategoryLocator(await this.locators.productInformationSectionLocator).textContent();
                const productPriceText = await this.locators.prductInformationSectionPriceLocator(await this.locators.productInformationSectionLocator).textContent();
                const productAvailability = await this.locators.prductInformationSectionAvailabilityLocator(await this.locators.productInformationSectionLocator).textContent();
                const productBrand = await this.locators.prductInformationSectionBrandLocator(await this.locators.productInformationSectionLocator).textContent();
                const productCondition = await this.locators.prductInformationSectionConditionLocator(await this.locators.productInformationSectionLocator).textContent();
                await expectTextNotBeNull(productName,productCategoryText,productPriceText,productAvailability,productBrand,productCondition);
            },

            expectMatchingCategory: async (keyWord: string) => {
                const productCategory = await this.locators.prductInformationSectionCategoryLocator(await this.locators.productInformationSectionLocator).textContent() || "";
                const isMatching = productCategory.toLowerCase().includes(keyWord.toLowerCase());
                await expect(isMatching).toBeTruthy();
            }
        };

        this.actions = {
            fillReviewForm: async (firstName: string, lastName: string, email: string, message: string) => {
                await this.assertions.expectWriteReviewTextVissible();
                await this.locators.reviewNameInputLocator.fill((`${firstName} ${lastName}`));
                await this.locators.reviewEmailInputLocator.fill(email);
                await this.locators.reviewTextAreaInputLocator.fill(message);
            },

            clickReviewSubmitButton: async () => {
                await this.locators.reviewSubmitButtonLocator.click();
                await expect(await this.locators.reviewSuccessMessageTextLocator).toBeVisible();
            },

            setQuantity: async (quantity: number) => {
                const quantityInput = await this.locators.productInformationSectionQuantityLocator(await this.locators.productInformationSectionLocator);
                await quantityInput.clear();
                await quantityInput.fill(quantity.toString());
            },

            clickAddToCartButton: async () => {
                await this.assertions.expectImageWasLoaded(await this.locators.productImageLocator);
                await expect(async() =>{
                    await this.locators.productInformationSectionAddToCartButtonLocator(await this.locators.productInformationSectionLocator).click();
                    await expect(await this.locators.modalContentLocator).toBeVisible({ timeout: 1000 });
                }).toPass();
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

            gotoCart: async () => {
                await this.locators.cartButtonLocator.click();
            }
        };
    }
}
