import { Locator, Page, expect } from "@playwright/test";
import { textPriceToFloat } from "../Helper/Tools.ts";
import { BasePage } from "../Helper/BasePage";

export class CartPage extends BasePage{
    readonly locators: {
        subscriptionTextLocator: Locator;
        subscriptionEmailInputLocator: Locator;
        subscribeButtonLocator: Locator;
        subscribeMessage: Locator;
        productsListLocator: Locator;
        productQuantityTextLocator: (product: Locator) => Locator;
        productNameTextLocator: (product: Locator) => Locator;
        productPriceTextLocator: (product: Locator) => Locator;
        productPriceTotalTextLocator: (product: Locator) => Locator;
        CheckoutButtonLocator: Locator;
        modalContentLocator: Locator;
        modalContentRegisterAndLoginButtonLocator: (modalContent: Locator) => Locator;
        billingFormName: (form: Locator) => Locator;
        billingFormAddress: (form: Locator) => Locator;
        billingFormCityStatePostCode: (form: Locator) => Locator;
        billingFormCountry: (form: Locator) => Locator;
        billingFormPhoneNumber: (form: Locator) => Locator;
        deliveryAdressLocator: Locator;
        billingAdressLocator: Locator;
        descriptionInputLocator: Locator;
        placeOrderButtonLocator: Locator;
        deliveryTextLocator: Locator;
        productImageLocator: (product: Locator) => Locator;
        productDeleteButtonLocator: (product: Locator) => Locator;
        emptyCartTextLocator: Locator;
    };

    readonly assertions: {
        expectImageWasLoaded(image: Locator): Promise<void>;
        expectSubscriptionText(): Promise<void>;
        expectSuccessSubscriptionMessage(): Promise<void>;
        expectProductImageWasLoaded(product: Locator): Promise<void>;
        expectProductImageWasLoadedByName(name: string): Promise<void>;
        expectProductInfoByIndex(index: number, name: string, price: number, quantity: number): Promise<void>;
        expectProductExistence(exist: boolean, name: string): Promise<void>;
        expectAddress(addressName: string, originalTitle: string, originalFirstName: string,originalLastName: string,originalAddress: string,originalAddress2: string,originalCountry: string
            ,originalState: string,originalCity: string,originalZipcode: string,originalCompanyName: string,originalMobileNumber: string): Promise<void>;

        expectProductExistByName(name: string): Promise<boolean>;
        expectCheckOutButtonVisisble(): Promise<void>;
        expectAddressFormInformation(addresForm: Locator,originalTitle: string, originalFirstName: string,originalLastName: string,originalAddress: string
            ,originalAddress2: string,originalCountry: string,originalState: string,originalCity: string,originalZipcode: string,originalCompanyName: string,originalMobileNumber: string): Promise<void>;
    };

    readonly actions: {
        inputValueToSubscriptionEmailField(email: string): Promise<void>;
        isCartEmpty(): Promise<boolean>;
        getProductByName(name: string): Promise<Locator | null>;
        clickProcessButton(authorized: boolean): Promise<void>;
        clickRegisterAndLoginButton(): Promise<void>;
        clickDeleteButtonByProduct(product: Locator): Promise<void>;
        deleteProductByName(name: string): Promise<void>;
        inputDescriptionMessage(message: string): Promise<void>;
        clickPlaceOrderButton(): Promise<void>;
        getProductsCount(): Promise<number>;
    };

    constructor(page: Page){
        super(page);

        this.locators = {
            subscriptionTextLocator : this.page.getByText("Subscription"),
            subscriptionEmailInputLocator : this.page.getByPlaceholder("Your email address"),
            subscribeButtonLocator : this.page.locator("#subscribe"),
            subscribeMessage : this.page.getByText("You have been successfully subscribed!"),
            productsListLocator : this.page.locator("#cart_info_table tbody tr"),
            productQuantityTextLocator : (product: Locator) => product.locator(".cart_quantity button"),
            productNameTextLocator : (product: Locator) => product.locator("h4"),
            productPriceTextLocator : (product: Locator) => product.locator(".cart_price p"),
            productPriceTotalTextLocator : (product: Locator) => product.locator(".cart_total_price"),
            CheckoutButtonLocator : this.page.locator(".btn.btn-default.check_out"),
            modalContentLocator : this.page.locator(".modal-content"),
            modalContentRegisterAndLoginButtonLocator : (modalContent: Locator) => modalContent.getByRole("link",{name: "Register / Login"}),
            billingFormName : (form: Locator) => form.locator(".address_firstname.address_lastname"),
            billingFormAddress : (form: Locator) => form.locator(".address_address1.address_address2"),
            billingFormCityStatePostCode : (form: Locator) => form.locator(".address_city.address_state_name.address_postcode"),
            billingFormCountry : (form: Locator) => form.locator(".address_country_name"),
            billingFormPhoneNumber : (form: Locator) => form.locator(".address_phone"),
            deliveryAdressLocator : this.page.locator(".address.item.box"),
            billingAdressLocator : this.page.locator(".address.alternate_item.box"),
            descriptionInputLocator : this.page.locator(".form-control"),
            placeOrderButtonLocator : this.page.getByRole("link",{name: "Place Order"}),
            productImageLocator : (product: Locator) => product.locator("img"),
            deliveryTextLocator : this.page.getByText("Your delivery address"),
            productDeleteButtonLocator : (product: Locator) => product.locator(".cart_quantity_delete"),
            emptyCartTextLocator : this.page.getByText("Cart is empty!"),
        };

        this.assertions = {
            expectImageWasLoaded: async (image: Locator) => {
                await expect(await this.page.waitForFunction(
                    (img) => (img instanceof HTMLImageElement) && img.complete && img.naturalWidth > 0,
                    await image.elementHandle()
                )).toBeTruthy();
            },

            expectSuccessSubscriptionMessage: async () => {
                await expect(await this.locators.subscribeMessage).toBeVisible();
            },

            expectSubscriptionText: async () => {
                await expect(await this.locators.subscriptionTextLocator).toBeVisible();
            },

            expectProductImageWasLoaded: async (product: Locator) => {
                await this.assertions.expectImageWasLoaded(await this.locators.productImageLocator(await product));
            },

            expectProductImageWasLoadedByName: async (name: string) => {
                const product = await this.actions.getProductByName(name);
                await expect(product).not.toBe(null);
                if(product) await this.assertions.expectProductImageWasLoaded(product);
            },

            expectProductInfoByIndex: async (index: number, name: string, price: number, quantity: number) => {
                const products = await this.locators.productsListLocator;
                const product = await products.nth(index);
                const productName = await this.locators.productNameTextLocator(product).textContent();
                const productPrice = await textPriceToFloat(await this.locators.productPriceTextLocator(product).textContent() ?? "");
                const productQuantity = parseInt(await this.locators.productQuantityTextLocator(product).textContent() ?? "");
                const productPriceTotal = await textPriceToFloat(await this.locators.productPriceTotalTextLocator(product).textContent() ?? "");

                await expect(productName).toBe(name);
                await expect(productPrice).toBe(price);
                await expect(productQuantity).toBe(quantity);
                await expect(productPriceTotal).toBe((productPrice * quantity));
            },

            expectProductExistence: async (exist: boolean, name: string) => {
                await expect(await this.assertions.expectProductExistByName(name)).toBe(exist);
            },

            expectAddress: async (addressName: string, originalTitle: string, originalFirstName: string,originalLastName: string,originalAddress: string,originalAddress2: string,originalCountry: string
                ,originalState: string,originalCity: string,originalZipcode: string,originalCompanyName: string,originalMobileNumber: string) => 
            {
                const adressLocator = addressName === "billing" ? await this.locators.billingAdressLocator : await this.locators.deliveryAdressLocator;
                await expect(adressLocator).toBeVisible();
                await this.assertions.expectAddressFormInformation(adressLocator,originalTitle, originalFirstName,originalLastName,originalAddress,originalAddress2,originalCountry,originalState,originalCity,originalZipcode,originalCompanyName,originalMobileNumber);
            },

            expectProductExistByName: async (name: string) => {
                if(await this.actions.isCartEmpty()) return false;
                const product = await this.actions.getProductByName(name);
                if(product === null) return false;
                return true;
            },

            expectCheckOutButtonVisisble: async () => {
                await expect(await this.locators.CheckoutButtonLocator).toBeVisible();
            },

            expectAddressFormInformation: async (addresForm: Locator,originalTitle: string, originalFirstName: string,originalLastName: string,originalAddress: string
                ,originalAddress2: string,originalCountry: string,originalState: string,originalCity: string,originalZipcode: string,originalCompanyName: string,originalMobileNumber: string) => 
            {
                const Name = await this.locators.billingFormName(addresForm).textContent();
                const AddressesLocators = await this.locators.billingFormAddress(addresForm).all();
                let combinedAddress = '';
                for (const Address of AddressesLocators) {
                  const text = await Address.textContent();
                  combinedAddress += (text?.trim() ?? '') + ' ';
                }
                combinedAddress = combinedAddress.trim();
                const CityStatePostCode = (await this.locators.billingFormCityStatePostCode(addresForm).textContent())?.replace(/\s+/g, ' ').trim();;
                const Country = await this.locators.billingFormCountry(addresForm).textContent();
                const PhoneNumber = await this.locators.billingFormPhoneNumber(addresForm).textContent();
            
                const expectedName = `${originalTitle} ${originalFirstName} ${originalLastName}`;
                const expectedAddress = `${originalCompanyName} ${originalAddress} ${originalAddress2}`;
                const expectedCityStatePostcode = `${originalCity} ${originalState} ${originalZipcode}`;
            
                await expect(Name).toBe(expectedName);
                await expect(combinedAddress).toBe(expectedAddress);
                await expect(CityStatePostCode).toBe(expectedCityStatePostcode);
                await expect(Country).toBe(originalCountry);
                await expect(PhoneNumber).toBe(originalMobileNumber);
            }
        };

        this.actions = {
            inputValueToSubscriptionEmailField: async (email: string) => {
                await expect(async () => {
                    await this.locators.subscriptionEmailInputLocator.fill(email);
                    await this.locators.subscribeButtonLocator.click();
                    await this.assertions.expectSuccessSubscriptionMessage();
                }).toPass();
            },

            isCartEmpty: async () => {
                return await this.locators.emptyCartTextLocator.isVisible();
            },

            getProductByName: async (name: string): Promise<Locator | null> => {
                const product =  (await await this.locators.productsListLocator).filter({
                    has: this.page.locator('h4', { hasText: name })
                });

                if (await product.count() === 0) {
                    return null;
                }
            
                return product;
            },

            clickProcessButton: async (authorized: boolean) => {
                const products = await await this.locators.productsListLocator;
                await this.assertions.expectImageWasLoaded(await this.locators.productImageLocator(await products.nth(0)));

                await expect(async () => {
                    await this.locators.CheckoutButtonLocator.click();
                    if (authorized) {
                        await expect(await this.locators.deliveryTextLocator).toBeVisible();
                    } else {
                        await expect(await this.locators.modalContentLocator).toBeVisible();
                    }
                }).toPass();
            },

            clickRegisterAndLoginButton: async () => {
                await expect(await this.locators.modalContentLocator).toBeVisible();
                await expect(await this.locators.modalContentRegisterAndLoginButtonLocator(await this.locators.modalContentLocator)).toBeVisible({timeout: 20000});
                await this.locators.modalContentRegisterAndLoginButtonLocator(await this.locators.modalContentLocator).click();
            },

            clickDeleteButtonByProduct: async (product: Locator) => {
                if (await product.count() === 0) {
                    throw new Error('Product does not exist, cannot click delete.');
                }
                await expect(async () => {
                    await this.locators.productDeleteButtonLocator(product).click();
                    await expect(product).toHaveCount(0, { timeout: 10000 });
                }).toPass();
            },

            deleteProductByName: async (name: string) => {
                const product = await this.actions.getProductByName(name);
                await expect(product).not.toBe(null);
                if (product) await this.actions.clickDeleteButtonByProduct(product);
            },

            inputDescriptionMessage: async (message: string) => {
                await this.locators.descriptionInputLocator.fill(message);
            },

            clickPlaceOrderButton: async () => {
                await this.locators.placeOrderButtonLocator.click();
            },

            getProductsCount: async () => {
                return await (await await this.locators.productsListLocator).count();
            },
        };
    }
}