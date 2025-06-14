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