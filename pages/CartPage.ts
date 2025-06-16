import { Locator, Page, expect } from "@playwright/test";
import { textPriceToFloat } from "../Helper/tools";

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
    readonly productDeleteButtonLocator: (product: Locator) => Locator;
    readonly emptyCartTextLocator: Locator;
    readonly signUpAndLoginPageLocator: Locator;

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
        this.productDeleteButtonLocator = (product: Locator) => product.locator(".cart_quantity_delete");
        this.emptyCartTextLocator = this.page.getByText("Cart is empty!");
        this.signUpAndLoginPageLocator = this.page.getByRole('link', { name: 'Signup / Login' });
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
        await expect(async () => {
            await this.subscriptionEmailInputLocator.fill(email);
            await this.subscribeButtonLocator.click();
            await this.checkSuccesSubscriptionMessage();
        }).toPass();
    }

    async checkSuccesSubscriptionMessage(){
        await expect(await this.subscribeMessage).toBeVisible();
    }

    async isCartEmpty(){
        return await this.emptyCartTextLocator.isVisible();
    }

    async getProductsList(){
        return await this.productsListLocator;
    }

    async getProductByName(name: string): Promise<Locator | null> {
        const product =  (await this.getProductsList()).filter({
            has: this.page.locator('h4', { hasText: name })
        });
        
        if (await product.count() === 0) {
            return null;
        }

        return product;
    }

    async verifyProductImageWasLoaded(product: Locator){
        await this.verifyImageWasLoaded(await this.productImageLocator(await product));
    }

    async checkIfProcessButtonVisisble(){
        await expect(await this.processToCheckoutButtonLocator).toBeVisible();
    }

    async verifyProductImageWasLoadedByName(name: string){
        const product = await this.getProductByName(name);
        await expect(product).not.toBe(null);
        if(product) await this.verifyProductImageWasLoaded(product);
    }

    async clickProcessButton(authorized: boolean) {
        const products = await this.getProductsList();
        await this.verifyImageWasLoaded(await this.productImageLocator(await products.nth(0)));
    
        await expect(async () => {
            await this.processToCheckoutButtonLocator.click();
            if (authorized) {
                await expect(await this.deliveryTextLocator).toBeVisible();
            } else {
                await expect(await this.modalContentLocator).toBeVisible();
            }
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

    async clickDeleteButtonByProduct(product: Locator) {
        if (await product.count() === 0) {
            throw new Error('Product does not exist, cannot click delete.');
        }
        await expect(async () => {
            await this.productDeleteButtonLocator(product).click();
            await expect(product).toHaveCount(0, { timeout: 10000 });
        }).toPass();
    }

    async deleteProductByName(name: string){
        const product = await this.getProductByName(name);
        await expect(product).not.toBe(null);
        if (product) await this.clickDeleteButtonByProduct(product);
    }

    async checkProductExistByName(name: string){
        if(await this.isCartEmpty()) return false;
        const product = await this.getProductByName(name);
        if(product === null) return false;
        return true;
    }

    async verifyProductExistOrNot(exist: boolean, name: string){
        await expect(await this.checkProductExistByName(name)).toBe(exist);
    }

    async verifyAddressFormInformation(addresForm: Locator,originalTitle, originalFirstName,originalLastName,originalAddress,originalAddress2,originalCountry,originalState,originalCity,originalZipcode,originalCompanyName,originalMobileNumber){
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

        const expectedName = `${originalTitle} ${originalFirstName} ${originalLastName}`;
        const expectedAddress = `${originalCompanyName} ${originalAddress} ${originalAddress2}`;
        const expectedCityStatePostcode = `${originalCity} ${originalState} ${originalZipcode}`;

        await expect(Name).toBe(expectedName);
        await expect(combinedAddress).toBe(expectedAddress);
        await expect(CityStatePostCode).toBe(expectedCityStatePostcode);
        await expect(Country).toBe(originalCountry);
        await expect(PhoneNumber).toBe(originalMobileNumber);
    }

    async verifyAddress(addressName: string, originalTitle, originalFirstName,originalLastName,originalAddress,originalAddress2,originalCountry,originalState,originalCity,originalZipcode,originalCompanyName,originalMobileNumber){
        const adressLocator = addressName === "billing" ? await this.billingAdressLocator : await this.deliveryAdressLocator;
        await expect(adressLocator).toBeVisible();
        await this.verifyAddressFormInformation(adressLocator,originalTitle, originalFirstName,originalLastName,originalAddress,originalAddress2,originalCountry,originalState,originalCity,originalZipcode,originalCompanyName,originalMobileNumber);
    }

    async inputDescriptionMessage(message: string){
        await this.descriptionInputLocator.fill(message);
    }

    async clickPlaceOrderButton(){
        await this.placeOrderButtonLocator.click();
    }

    async getProductsCount(){
        return await (await this.getProductsList()).count();
    }

    async gotoSignUpAndLoginPage(){
        await this.signUpAndLoginPageLocator.click();
    }

    async checkValues(value1, value2){
        await expect(value1).toBe(value2);
    }
}