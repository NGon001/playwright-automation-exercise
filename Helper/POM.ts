import { Locator, Page, expect } from "@playwright/test";
import {textPriceToFloat, expectAtLeastOneVisible} from "./tools.ts"
import { count } from "console";

export class HomePage{
    readonly page: Page;
    readonly signUpAndLoginPageLocator: Locator;
    readonly deleteButtonLocator: Locator;
    readonly logoutButtonLocator: Locator;
    readonly logedInTextLocator: Locator;
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
        this.logedInTextLocator = this.page.getByText('Logged in as', { exact: false });
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
        const loggedInMessage = await this.logedInTextLocator.textContent();
        await expect(await this.logedInTextLocator).toBeVisible();
        await expect(await loggedInMessage?.trim()).toBe(expectedMessage);
    }

    async clickDeleteAccount(){
        await this.deleteButtonLocator.click();
    }

    async gotoTestCasesPage(){
        const menu = await this.menuLocator;
        await menu.locator(this.testCasesButtonLocator).click();
    }

    async verifyHomepAgeItemsLoaded(){
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

    async checkSuccesSubscriptionMessage(){
        await expect(await this.subscribeMessage).toBeVisible();
    }

    async gotoCart(){
        await this.cartButtonLocator.click();
    }
}

export class CartPage{

    readonly page: Page;
    readonly subscriptionTextLocator: Locator;
    readonly subscriptionEmailInputLocator: Locator;
    readonly subscribeButtonLocator: Locator;
    readonly subscribeMessage: Locator;
    readonly productsListLocator: Locator;
    readonly productQuantityTextLocator: (product: Locator) => Locator;
    readonly productNameTextLocator: (product: Locator) => Locator;
    readonly productPriceTextLocator: (product: Locator) => Locator;
    readonly productPriceTotalTextLocator: (product: Locator) => Locator;
    readonly processToCheckoutButtonLocator: Locator;
    readonly modalContentLocator: Locator;
    readonly modalContentRegisterAndLoginButtonLocator: (modalContent: Locator) => Locator;
    readonly billingFormName: (form: Locator) => Locator;
    readonly billingFormAddress: (form: Locator) => Locator;
    readonly billingFormCityStatePostCode: (form: Locator) => Locator;
    readonly billingFormCountry: (form: Locator) => Locator;
    readonly billingFormPhoneNumber: (form: Locator) => Locator;
    readonly deliveryAdressLocator: Locator;
    readonly billingAdressLocator: Locator;
    readonly descriptionInputLocator: Locator;
    readonly placeOrderButtonLocator: Locator;
    readonly deliveryTextLocator: Locator;
    readonly productImageLocator: (product: Locator) => Locator;

    constructor(page: Page){
        this.page = page;
        this.subscriptionTextLocator = this.page.getByText("Subscription");
        this.subscriptionEmailInputLocator = this.page.getByPlaceholder("Your email address");
        this.subscribeButtonLocator = this.page.locator("#subscribe");
        this.subscribeMessage = this.page.getByText("You have been successfully subscribed!");
        this.productsListLocator = this.page.locator("#cart_info_table tbody tr");
        this.productQuantityTextLocator = (product: Locator) => product.locator(".cart_quantity button");
        this.productNameTextLocator = (product: Locator) => product.locator("h4");
        this.productPriceTextLocator = (product: Locator) => product.locator(".cart_price p");
        this.productPriceTotalTextLocator = (product: Locator) => product.locator(".cart_total_price");
        this.processToCheckoutButtonLocator = this.page.locator(".btn.btn-default.check_out");
        this.modalContentLocator = this.page.locator(".modal-content");
        this.modalContentRegisterAndLoginButtonLocator = (modalContent: Locator) => modalContent.getByRole("link",{name: "Register / Login"});
        this.billingFormName = (form: Locator) => form.locator(".address_firstname.address_lastname");
        this.billingFormAddress = (form: Locator) => form.locator(".address_address1.address_address2");
        this.billingFormCityStatePostCode = (form: Locator) => form.locator(".address_city.address_state_name.address_postcode");
        this.billingFormCountry = (form: Locator) => form.locator(".address_country_name");
        this.billingFormPhoneNumber = (form: Locator) => form.locator(".address_phone");
        this.deliveryAdressLocator = this.page.locator(".address.item.box");
        this.billingAdressLocator = this.page.locator(".address.alternate_item.box");
        this.descriptionInputLocator = this.page.locator(".form-control");
        this.placeOrderButtonLocator = this.page.getByRole("link",{name: "Place Order"});
        this.productImageLocator = (product: Locator) => product.locator("img");
        this.deliveryTextLocator = this.page.getByText("Your delivery address");
    }

    async verifyImageWasLoaded(image: Locator){
        await expect(await this.page.waitForFunction(
            (img) => (img instanceof HTMLImageElement) && img.complete && img.naturalWidth > 0,
            await image.elementHandle()
        )).toBeTruthy();
    }

    async verifySubscriptionText(){
        await expect(await this.subscriptionTextLocator).toBeVisible();
    }

    async inputValueToSubscriptionEmailField(email: string){
        await this.subscriptionEmailInputLocator.fill(email);
        await this.subscribeButtonLocator.click();
    }

    async checkSuccesSubscriptionMessage(){
        await expect(await this.subscribeMessage).toBeVisible();
    }

    async getProductsList(){
        return await this.productsListLocator;
    }

    async clickProcessButton(){
        const products = await this.getProductsList();
        await this.verifyImageWasLoaded(await this.productImageLocator(await products.nth(0)));
        await expect(async() =>{
            await this.processToCheckoutButtonLocator.click();
            await expectAtLeastOneVisible(await this.modalContentLocator, await this.deliveryTextLocator);
        }).toPass();    
    }

    async clickRegisterAndLoginButton(){
        await expect(await this.modalContentLocator).toBeVisible();
        await expect(await this.modalContentRegisterAndLoginButtonLocator(await this.modalContentLocator)).toBeVisible({timeout: 20000});
        await this.modalContentRegisterAndLoginButtonLocator(await this.modalContentLocator).click();
    }

    async checkProductInfoByIndex(index: number, name: string, price: number, quantity: number){
        const products = await this.getProductsList();
        const product = await products.nth(index);
        const productName = await this.productNameTextLocator(product).textContent();
        const productPrice = await textPriceToFloat(await this.productPriceTextLocator(product).textContent() ?? "");
        const productQuantity = parseInt(await this.productQuantityTextLocator(product).textContent() ?? "");
        const productPriceTotal = await textPriceToFloat(await this.productPriceTotalTextLocator(product).textContent() ?? "");
        
        await expect(productName).toBe(name);
        await expect(productPrice).toBe(price);
        await expect(productQuantity).toBe(quantity);
        await expect(productPriceTotal).toBe((productPrice * quantity));
    }

    async verifyAddressFormInformation(addresForm: Locator,originalTitle, originalName,originalAddress,originalAddress2,originalCountry,originalState,originalCity,originalZipcode,originalCompanyName,originalMobileNumber){
        const Name = await this.billingFormName(addresForm).textContent();
        const AddressesLocators = await this.billingFormAddress(addresForm).all();
        let combinedAddress = '';
        for (const Address of AddressesLocators) {
          const text = await Address.textContent();
          combinedAddress += (text?.trim() ?? '') + ' ';
        }
        combinedAddress = combinedAddress.trim();
        const CityStatePostCode = (await this.billingFormCityStatePostCode(addresForm).textContent())?.replace(/\s+/g, ' ').trim();;
        const Country = await this.billingFormCountry(addresForm).textContent();
        const PhoneNumber = await this.billingFormPhoneNumber(addresForm).textContent();

        const expectedName = `${originalTitle} ${originalName.join(' ')}`;
        const expectedAddress = `${originalCompanyName} ${originalAddress} ${originalAddress2}`;
        const expectedCityStatePostcode = `${originalCity} ${originalState} ${originalZipcode}`;

        await expect(Name).toBe(expectedName);
        await expect(combinedAddress).toBe(expectedAddress);
        await expect(CityStatePostCode).toBe(expectedCityStatePostcode);
        await expect(Country).toBe(originalCountry);
        await expect(PhoneNumber).toBe(originalMobileNumber);
    }

    async verifyDeliveryAddress(originalTitle, originalName,originalAddress,originalAddress2,originalCountry,originalState,originalCity,originalZipcode,originalCompanyName,originalMobileNumber){
        await expect(await this.deliveryAdressLocator).toBeVisible();
        await this.verifyAddressFormInformation(await this.deliveryAdressLocator,originalTitle, originalName,originalAddress,originalAddress2,originalCountry,originalState,originalCity,originalZipcode,originalCompanyName,originalMobileNumber);
    }

    async verifyBillingAddress(originalTitle, originalName,originalAddress,originalAddress2,originalCountry,originalState,originalCity,originalZipcode,originalCompanyName,originalMobileNumber){
        await expect(await this.billingAdressLocator).toBeVisible();
        await this.verifyAddressFormInformation(await this.billingAdressLocator,originalTitle, originalName,originalAddress,originalAddress2,originalCountry,originalState,originalCity,originalZipcode,originalCompanyName,originalMobileNumber);
    }

    async inputDescriptionMessage(message: string){
        await this.descriptionInputLocator.fill(message);
    }

    async clickPlaceOrderButton(){
        await this.placeOrderButtonLocator.click();
    }
}

export class PaymentPage{
    readonly page: Page;
    readonly paymentTextLocator: Locator;
    readonly nameOnCardInputLocator: Locator;
    readonly cardNumberInputLocator: Locator;
    readonly cardCVCInputLocator: Locator;
    readonly expiryMonthInputLocator: Locator;
    readonly expiryYearInputLocator: Locator;
    readonly payButtonInputLocator: Locator;
    readonly orderPlacedTextLocator: Locator;
    readonly continueButtonLocator: Locator;
    readonly paymentMessageLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.paymentTextLocator = this.page.getByText("Name on Card");
        this.nameOnCardInputLocator = this.page.locator('input[data-qa="name-on-card"]');
        this.cardNumberInputLocator = this.page.locator('input[data-qa="card-number"]');
        this.cardCVCInputLocator = this.page.locator('input[data-qa="cvc"]');
        this.expiryMonthInputLocator = this.page.locator('input[data-qa="expiry-month"]');
        this.expiryYearInputLocator = this.page.locator('input[data-qa="expiry-year"]');
        this.payButtonInputLocator = this.page.getByRole("button",{name: "Pay and Confirm Order"});
        this.orderPlacedTextLocator = this.page.getByText("Order Placed!");
        this.continueButtonLocator = this.page.getByRole("link",{name: "Continue"});
        this.paymentMessageLocator = this.page.getByText("Your order has been placed successfully!");
    }

    async verifyPageLoaded(){
        await expect(await this.paymentTextLocator).toBeVisible();
    }

    async fillPaymentForm(name,cardNumber,CVC,expiryMonth,expiryYear){
        await this.verifyPageLoaded();
        await this.nameOnCardInputLocator.fill(name.join(" "));
        await this.cardNumberInputLocator.fill(cardNumber);
        await this.cardCVCInputLocator.fill(CVC);
        await this.expiryMonthInputLocator.fill(expiryMonth);
        await this.expiryYearInputLocator.fill(expiryYear);
    }

    async clickPayButton(){
        await this.payButtonInputLocator.click();
    }

    async verifyOrderPlaced(){
        await expect(await this.orderPlacedTextLocator).toBeVisible();
    }

    async verifyPaymentMessage(){
        await expect(await this.paymentMessageLocator).toBeVisible();
    }

    async clickContinueButton(){
        await this.continueButtonLocator.click();
    }
}

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

    async clickFirstProductViewProductButton(){
        const products = await this.getAllProducts();
        await this.clickViewProductButton(products.nth(0));
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
        const productName = await product.locator("p").first().textContent() ?? "";
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
        this.productImageLocator = this.page.locator(".col-sm-5 img");
    }

    async goBack(){
        this.page.goBack();
    }

    private async expectTextNotBeNull(...values: string[]) {
        for(const value of values){
            await expect(value).not.toBe("");
        }
    }

    async verifyImageWasLoaded(image: Locator){
        await expect(await this.page.waitForFunction(
            (img) => (img instanceof HTMLImageElement) && img.complete && img.naturalWidth > 0,
            await image.elementHandle()
        )).toBeTruthy();
    }

    async getProductCategory(){
        return await this.prductInformationSectionCategoryLocator(await this.productInformationSectionLocator).textContent() || "";
    }

    async getProductPriceText(){
        return await this.prductInformationSectionPriceLocator(await this.productInformationSectionLocator).textContent() || "";
    }

    async getProductAvailability(){
        return await this.prductInformationSectionAvailabilityLocator(await this.productInformationSectionLocator).textContent() || "";
    }

    async getProductBrand(){
        return await this.prductInformationSectionBrandLocator(await this.productInformationSectionLocator).textContent() || "";
    }

    async getProductCondition(){
        return await this.prductInformationSectionConditionLocator(await this.productInformationSectionLocator).textContent() || "";
    }

    async getProductName(){
        return await this.prductInformationNameLocator(await this.productInformationSectionLocator).textContent() || "";
    }

    async verifyThatProductInformationIsVisible(){
        const productName = await this.productInformationSectionLocator.locator("h2").textContent() || "";
        const productCategoryText = await this.getProductCategory();
        const productPriceText = await this.productInformationSectionLocator.locator("span span").textContent() || "";
        const productAvailability = await this.productInformationSectionLocator.locator("p",{hasText: "Availability:"}).textContent() || "";
        const productBrand = await this.productInformationSectionLocator.locator("p",{hasText: "Brand:"}).textContent() || "";
        const productCondition = await this.productInformationSectionLocator.locator("p",{hasText: "Condition:"}).textContent() || "";
        await this.expectTextNotBeNull(productName,productCategoryText,productPriceText,productAvailability,productBrand,productCondition);
    }

    async verifyMatchingCategory(keyWord: string) {
        const productCategory = await this.getProductCategory();
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
}

export class TestCasesPage{
    readonly page: Page;
    readonly testCasePageTextCheckLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.testCasePageTextCheckLocator = this.page.getByText("Below is the list of test Cases");
    }

    async verifyPageIsVisible(){
        await expect(await this.testCasePageTextCheckLocator).toBeVisible();
    }
}

export class SignUp_LoginPage{
    readonly page: Page;
    readonly signUpFormLocator: Locator;
    readonly loginFormLocator: Locator;
    readonly loginButtonLocator: Locator;
    readonly signUpButtonLocator: Locator;
    readonly loginTextLocator: Locator;
    readonly singUpTextLocator: Locator;
    readonly incorectDataMessageLocator: Locator;
    readonly exestedDataMessageLocator: Locator;
    readonly signUpAndLoginPageLocator: Locator;
    readonly FormNameInputLocator: (signUpForm: Locator) => Locator;
    readonly FormEmailInputLocator: (signUpForm: Locator) => Locator;
    readonly FormPasswordnputLocator: (signUpForm: Locator) => Locator;

    constructor(page: Page){
        this.page = page;
        this.signUpFormLocator = this.page.locator('form[action="/signup"]');
        this.loginFormLocator = this.page.locator('form[action="/login"]');
        this.loginButtonLocator = this.loginFormLocator.getByRole('button', { name: 'Login' });
        this.signUpButtonLocator = this.signUpFormLocator.getByRole('button', { name: 'Signup' });
        this.loginTextLocator = this.page.getByText('Login to your account');
        this.singUpTextLocator = this.page.getByText('New User Signup!');
        this.incorectDataMessageLocator = this.page.getByText("Your email or password is incorrect!");
        this.exestedDataMessageLocator = this.page.getByText("Email Address already exist!");
        this.signUpAndLoginPageLocator = this.page.getByRole('link', { name: 'Signup / Login' });
        this.FormNameInputLocator = (Form: Locator) => Form.getByPlaceholder('Name');
        this.FormEmailInputLocator = (Form: Locator) => Form.getByPlaceholder('Email Address');
        this.FormPasswordnputLocator = (Form: Locator) => Form.getByPlaceholder('Password');
    }

    async checkThatSignUpAndLoginButtonIsVissible(){
        await expect(await this.signUpAndLoginPageLocator).toBeVisible();
    }

    async fillStartSignUpForm(fullName, email){
        await this.FormNameInputLocator(await this.signUpFormLocator).fill(fullName[0]);
        await this.FormEmailInputLocator(await this.signUpFormLocator).fill(email);
    }

    async fillLoginForm(email,password){
        await this.loginFormLocator.getByPlaceholder('Email Address').fill(email);
        await this.loginFormLocator.getByPlaceholder('Password').fill(password);
    }

    async checkLoginText(){
        await expect(await this.loginTextLocator).toBeVisible();
    }

    async checksignUpText(){
        await expect(await this.singUpTextLocator).toBeVisible();
    }

    async checkIncorectDataMessage(){
        await expect(await this.incorectDataMessageLocator).toBeVisible();
    }
    async checkExistedDataMessage(){
        await expect(await this.exestedDataMessageLocator).toBeVisible();
    }

    async clickLoginButton(){
        await this.loginButtonLocator.click();
    }
    async clickSignUpButton(){
        await this.signUpButtonLocator.click();
    }
}

export class SignUpPage{
    readonly page: Page;
    readonly nameFieldLocator: Locator;
    readonly emailFieldLocator: Locator;
    readonly createAccountButton:Locator;
    readonly enterAccountInfTextLocator: Locator;
    readonly fillFormRadioTitleLocator: (Title: string) => Locator;
    readonly fillFormPasswordLocator: Locator;
    readonly fillFormDayOptionLocator: Locator;
    readonly fillFormMonthOptionLocator: Locator;
    readonly fillFormYearOptionLocator: Locator;
    readonly fillFormSignUpNewsletterLocator: Locator;
    readonly fillFormSignUpOffersLocator: Locator;
    readonly fillFormFirstNameInputLocator: Locator;
    readonly fillFormLastNameInputLocator: Locator;
    readonly fillFormCompanyInputLocator: Locator;
    readonly fillFormAddress1InputLocator: Locator;
    readonly fillFormAddress2InputLocator: Locator;
    readonly fillFormCountryOptionLocator: Locator;
    readonly fillFormStateInputLocator: Locator;
    readonly fillFormCityInputLocator: Locator;
    readonly fillFormZipcodeInputLocator: Locator;
    readonly fillFormMobileNumberInputLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.nameFieldLocator = this.page.locator("#name");
        this.emailFieldLocator = this.page.locator("#email");
        this.createAccountButton = this.page.getByRole('button', { name: 'Create Account' });
        this.enterAccountInfTextLocator = this.page.getByText('Enter Account Information');
        this.fillFormRadioTitleLocator = (Title: string) => this.page.getByRole('radio', { name: Title });
        this.fillFormPasswordLocator = this.page.locator('#password');
        this.fillFormDayOptionLocator = this.page.locator('#days');
        this.fillFormMonthOptionLocator = this.page.locator('#months');
        this.fillFormYearOptionLocator = this.page.locator('#years');
        this.fillFormSignUpNewsletterLocator = this.page.getByRole('checkbox', { name: 'Sign up for our newsletter!' });
        this.fillFormSignUpOffersLocator = this.page.getByRole('checkbox', { name: 'Receive special offers from our partners!' });
        this.fillFormFirstNameInputLocator = this.page.locator('#first_name');
        this.fillFormLastNameInputLocator = this.page.locator('#last_name');
        this.fillFormCompanyInputLocator = this.page.locator('#company');
        this.fillFormAddress1InputLocator = this.page.locator('#address1');
        this.fillFormAddress2InputLocator = this.page.locator('#address2');
        this.fillFormCountryOptionLocator = this.page.getByRole('combobox', { name: 'Country' });
        this.fillFormStateInputLocator = this.page.locator('#state');
        this.fillFormCityInputLocator = this.page.locator('#city');
        this.fillFormZipcodeInputLocator = this.page.locator('#zipcode');
        this.fillFormMobileNumberInputLocator = this.page.locator('#mobile_number');
    }

    async checkDataInForm(fullName, email){
        await expect(await this.page.getByText('Enter Account Information')).toBeVisible();
        await expect(await this.nameFieldLocator.getAttribute('value')).toBe(fullName[0]);
        await expect(await this.emailFieldLocator.getAttribute('value')).toBe(email);   
    }

    async fillSignUpForm(Title,fullName,password,BirthDay,BirthMonth,BirthYear,companyName,Address,Address2,Country,State,City,Zipcode,mobileNumber){
        await this.fillFormRadioTitleLocator(Title).check();
        await this.fillFormPasswordLocator.fill(password);
        await this.fillFormDayOptionLocator.selectOption({ label: BirthDay });
        await this.fillFormMonthOptionLocator.selectOption({ label: BirthMonth });
        await this.fillFormYearOptionLocator.selectOption({ label: BirthYear });
        await this.fillFormSignUpNewsletterLocator.check();
        await this.fillFormSignUpOffersLocator.check();
        await this.fillFormFirstNameInputLocator.fill(fullName[0]);
        await this.fillFormLastNameInputLocator.fill(fullName[1]);
        await this.fillFormCompanyInputLocator.fill(companyName);
        await this.fillFormAddress1InputLocator.fill(Address);
        await this.fillFormAddress2InputLocator.fill(Address2);
        await this.fillFormCountryOptionLocator.selectOption({ label: Country });
        await this.fillFormStateInputLocator.fill(State);
        await this.fillFormCityInputLocator.fill(City);
        await this.fillFormZipcodeInputLocator.fill(Zipcode);
        await this.fillFormMobileNumberInputLocator.fill(mobileNumber);
        await this.page.getByRole('radio', { name: Title }).check();
        await this.page.locator('#password').fill(password);
        await this.page.locator('#days').selectOption({ label: BirthDay });
        await this.page.locator('#months').selectOption({ label: BirthMonth });
        await this.page.locator('#years').selectOption({ label: BirthYear });
        await this.page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();
        await this.page.getByRole('checkbox', { name: 'Receive special offers from our partners!' }).check();
        await this.page.locator('#first_name').fill(fullName[0]);
        await this.page.locator('#last_name').fill(fullName[1]);
        await this.page.locator('#company').fill(companyName);
        await this.page.locator('#address1').fill(Address);
        await this.page.locator('#address2').fill(Address2);
        await this.page.getByRole('combobox', { name: 'Country' }).selectOption({ label: Country });
        await this.page.locator('#state').fill(State);
        await this.page.locator('#city').fill(City);
        await this.page.locator('#zipcode').fill(Zipcode);
        await this.page.locator('#mobile_number').fill(mobileNumber);
    }

    async clickCreateAccountButton(){
        await this.createAccountButton.click();
    }
}

export class AccountCreatedPage{
    readonly page: Page;
    readonly accountCreatedTextLocator: Locator;
    readonly continueButtonLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.accountCreatedTextLocator = this.page.getByText('Account Created!');
        this.continueButtonLocator = this.page.getByRole('link', { name: 'Continue' });
    }

    async checkAccountCreationMessage(){
        await expect(await this.accountCreatedTextLocator).toBeVisible();
    }

    async clickContinueButton(){
        await this.continueButtonLocator.click();
    }
}

export class AccountDeletePage{
    readonly page: Page;
    readonly accountDeletedTextLocator: Locator;
    readonly continueButtonLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.accountDeletedTextLocator = this.page.getByText('Account Deleted!');
        this.continueButtonLocator = this.page.getByRole('link', { name: 'Continue' });
    }

    async checkAccountDeletedMessage(){
        await expect(await this.accountDeletedTextLocator).toBeVisible();
    }

    async clickContinueButton(){
        await this.continueButtonLocator.click();
    }
}

export class ContactUsPage{
    readonly page: Page;
    readonly getInTouchTextLocator: Locator;
    readonly nameFieldLocator: Locator;
    readonly emailFieldLocator: Locator;
    readonly subjectFieldLocator: Locator;
    readonly messageFieldLocator: Locator;
    readonly submitButtonLocator: Locator;
    readonly chooseFileButtonLocator: Locator;
    readonly successMessageLocator: Locator;
    readonly returnHomeButtonLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.getInTouchTextLocator = this.page.getByText('Get In Touch');
        this.nameFieldLocator = this.page.getByPlaceholder('Name',{ exact: true });
        this.emailFieldLocator = this.page.getByPlaceholder('Email',{ exact: true });
        this.subjectFieldLocator = this.page.getByPlaceholder('Subject',{ exact: true });
        this.messageFieldLocator = this.page.getByPlaceholder('Your Message Here',{ exact: true });
        this.submitButtonLocator = this.page.getByRole('button', { name: 'Submit' });
        this.chooseFileButtonLocator = this.page.getByRole('button', { name: 'Choose File' });
        this.successMessageLocator = this.page.locator('.status.alert.alert-success');
        this.returnHomeButtonLocator = this.page.locator("#form-section").getByRole('link', { name: ' Home' });
    }

    async checkGetInTouchText(){
        await expect(await this.getInTouchTextLocator).toBeVisible();
    }

    async fillContactUsForm(name, email, subject, message, filePath) {
        await this.nameFieldLocator.fill(name.join(' '));
        await this.emailFieldLocator.fill(email);
        await this.subjectFieldLocator.fill(subject);
        await this.messageFieldLocator.fill(message);
        if (filePath) {
            await this.chooseFileButtonLocator.setInputFiles(filePath);
        }
    }

    async clickSubmitButton() {
        let AlertMessage = '';
        this.page.on('dialog', dialog => { AlertMessage = dialog.message();dialog.accept()});
        await this.submitButtonLocator.click();
        expect(AlertMessage).toBe("Press OK to proceed!");
    }


    async checkSuccessMessage() {
        await expect(await this.successMessageLocator).toBeVisible();
    }

    async clickReturnHomeButton() {
        await this.returnHomeButtonLocator.click();
    }
}
