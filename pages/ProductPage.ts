import { Locator, Page, expect } from "@playwright/test";
import { expectTextNotBeNull } from "../Helper/tools";

export class ProductPage{
    readonly page: Page;
    readonly productInformationSectionLocator: Locator;
    readonly prductInformationSectionCategoryLocator: (productInformationSection: Locator) => Locator;
    readonly prductInformationSectionPriceLocator: (productInformationSection: Locator) => Locator;
    readonly prductInformationSectionAvailabilityLocator: (productInformationSection: Locator) => Locator;
    readonly prductInformationNameLocator: (productInformationSection: Locator) => Locator;
    readonly prductInformationSectionBrandLocator: (productInformationSection: Locator) => Locator;
    readonly prductInformationSectionConditionLocator: (productInformationSection: Locator) => Locator;
    readonly productInformationSectionQuantityLocator: (productInformationSection: Locator) => Locator;
    readonly productInformationSectionAddToCartButtonLocator: (productInformationSection: Locator) => Locator;
    readonly cartModelViewCartButton: (modalContent: Locator) => Locator;
    readonly modalContentLocator: Locator;
    readonly cartModelContinueShoppingButton: (modalContent: Locator) => Locator;
    readonly productImageLocator: Locator;
    readonly cartButtonLocator: Locator;
    readonly writeReviewTextLocator: Locator;
    readonly reviewNameInputLocator: Locator;
    readonly reviewEmailInputLocator: Locator;
    readonly reviewTextAreaInputLocator: Locator;
    readonly reviewSubmitButtonLocator: Locator;
    readonly reviewSuccessMessageTextLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.productInformationSectionLocator = this.page.locator(".product-information");
        this.prductInformationSectionCategoryLocator = (productInformationSection: Locator) => productInformationSection.getByText("Category:");
        this.prductInformationSectionPriceLocator = (productInformationSection: Locator) => productInformationSection.locator("span span");
        this.prductInformationSectionAvailabilityLocator = (productInformationSection: Locator) => productInformationSection.locator("p",{hasText: "Availability:"});
        this.prductInformationNameLocator = (productInformationSection: Locator) => productInformationSection.locator("h2");
        this.prductInformationSectionBrandLocator = (productInformationSection: Locator) => productInformationSection.locator("p",{hasText: "Brand:"});
        this.prductInformationSectionConditionLocator = (productInformationSection: Locator) => productInformationSection.locator("p",{hasText: "Condition:"});
        this.productInformationSectionQuantityLocator = (productInformationSection: Locator) => productInformationSection.locator("#quantity");
        this.productInformationSectionAddToCartButtonLocator = (productInformationSection: Locator) => productInformationSection.getByRole("button",{name: "Add to cart"});
        this.cartModelViewCartButton = (modalContent: Locator) => modalContent.getByRole("link",{name: "View Cart"});
        this.modalContentLocator = this.page.locator(".modal-content");
        this.cartModelContinueShoppingButton = (modalContent: Locator) => modalContent.getByRole("button",{name: "Continue Shopping"});
        this.writeReviewTextLocator = this.page.getByRole("link",{name: "Write Your Review"});
        this.productImageLocator = this.page.locator(".col-sm-5 img");
        this.cartButtonLocator = this.page.locator('.col-sm-8 a[href="/view_cart"]');
        this.reviewNameInputLocator = this.page.getByPlaceholder("Your Name");
        this.reviewEmailInputLocator = this.page.getByPlaceholder("Email Address",{exact:true});
        this.reviewTextAreaInputLocator = this.page.getByPlaceholder("Add Review Here!");
        this.reviewSubmitButtonLocator = this.page.getByRole("button",{name: "Submit"});
        this.reviewSuccessMessageTextLocator = this.page.getByText("Thank you for your review.");
    }

    async goBack(){
        this.page.goBack();
    }

    async verifyImageWasLoaded(image: Locator){
        await expect(await this.page.waitForFunction(
            (img) => (img instanceof HTMLImageElement) && img.complete && img.naturalWidth > 0,
            await image.elementHandle()
        )).toBeTruthy();
    }

    async verifyWriteReviewTextVissible(){
        await this.verifyImageWasLoaded(await this.productImageLocator);
        await expect(await this.writeReviewTextLocator).toBeVisible();
    }

    async fillReviewForm(fullName: string[], email: string, message: string){
        await this.verifyWriteReviewTextVissible();
        await this.reviewNameInputLocator.fill(fullName.join(" "));
        await this.reviewEmailInputLocator.fill(email);
        await this.reviewTextAreaInputLocator.fill(message);
    }

    async clickReviewSubmitButton(){
        await this.reviewSubmitButtonLocator.click();
        await expect(await this.reviewSuccessMessageTextLocator).toBeVisible();
    }

    async verifyThatProductInformationIsVisible(){
        const productName = await this.prductInformationNameLocator(await this.productInformationSectionLocator).textContent() || "";
        const productCategoryText = await this.prductInformationSectionCategoryLocator(await this.productInformationSectionLocator).textContent() || "";
        const productPriceText = await this.prductInformationSectionPriceLocator(await this.productInformationSectionLocator).textContent() || "";
        const productAvailability = await this.prductInformationSectionAvailabilityLocator(await this.productInformationSectionLocator).textContent() || "";
        const productBrand = await this.prductInformationSectionBrandLocator(await this.productInformationSectionLocator).textContent() || "";
        const productCondition = await this.prductInformationSectionConditionLocator(await this.productInformationSectionLocator).textContent() || "";
        await expectTextNotBeNull(productName,productCategoryText,productPriceText,productAvailability,productBrand,productCondition);
    }

    async verifyMatchingCategory(keyWord: string) {
        const productCategory = await this.prductInformationSectionCategoryLocator(await this.productInformationSectionLocator).textContent() || "";
        const isMatching = productCategory.toLowerCase().includes(keyWord.toLowerCase());
        await expect(isMatching).toBeTruthy();
    }

    async setQuantity(quantity: number){
        const quantityInput = await this.productInformationSectionQuantityLocator(await this.productInformationSectionLocator);
        await quantityInput.clear();
        await quantityInput.fill(quantity.toString());
    }

    async clickAddToCartButton(){
        await this.verifyImageWasLoaded(await this.productImageLocator);
        await expect(async() =>{
            await this.productInformationSectionAddToCartButtonLocator(await this.productInformationSectionLocator).click();
            await expect(await this.modalContentLocator).toBeVisible({ timeout: 1000 });
        }).toPass();
        
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

    async gotoCart(){
        await this.cartButtonLocator.click();
    }
}
