import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Helper/BasePage";

export class PaymentPage extends BasePage{
    readonly locators: {
        paymentTextLocator: Locator;
        nameOnCardInputLocator: Locator;
        cardNumberInputLocator: Locator;
        cardCVCInputLocator: Locator;
        expiryMonthInputLocator: Locator;
        expiryYearInputLocator: Locator;
        payButtonInputLocator: Locator;
        orderPlacedTextLocator: Locator;
        continueButtonLocator: Locator;
        paymentMessageLocator: Locator;
    };

    readonly actions: {
        fillPaymentForm: (firstName: string,lastName: string,cardNumber: string,CVC: string,expiryMonth: string,expiryYear: string) => Promise<void>;
        clickPayButton: () => Promise<void>;
        clickContinueButton: () => Promise<void>;
    };

    readonly assertions: {
        expectPageLoaded: () => Promise<void>;
        expectOrderPlaced: () => Promise<void>;
        expectPaymentMessage: () => Promise<void>;
    };

    constructor(page: Page){
        super(page);

        this.locators = {
            paymentTextLocator : this.page.getByText("Name on Card"),
            nameOnCardInputLocator : this.page.locator('input[data-qa="name-on-card"]'),
            cardNumberInputLocator : this.page.locator('input[data-qa="card-number"]'),
            cardCVCInputLocator : this.page.locator('input[data-qa="cvc"]'),
            expiryMonthInputLocator : this.page.locator('input[data-qa="expiry-month"]'),
            expiryYearInputLocator : this.page.locator('input[data-qa="expiry-year"]'),
            payButtonInputLocator : this.page.getByRole("button",{name: "Pay and Confirm Order"}),
            orderPlacedTextLocator : this.page.getByText("Order Placed!"),
            continueButtonLocator : this.page.getByRole("link",{name: "Continue"}),
            paymentMessageLocator : this.page.getByText("Your order has been placed successfully!"),
        };

        this.assertions = {
            expectPageLoaded: async () => {
                await expect(await this.locators.paymentTextLocator).toBeVisible();
            },

            expectOrderPlaced: async () => {
                await expect(await this.locators.orderPlacedTextLocator).toBeVisible();
            },

            expectPaymentMessage: async () => {
                await expect(await this.locators.paymentMessageLocator).toBeVisible();
            }
        };

        this.actions = {
            fillPaymentForm: async (firstName: string,lastName: string,cardNumber: string,CVC: string,expiryMonth: string,expiryYear: string) => {
                await this.assertions.expectPageLoaded();
                await this.locators.nameOnCardInputLocator.fill((firstName + ' ' + lastName));
                await this.locators.cardNumberInputLocator.fill(cardNumber);
                await this.locators.cardCVCInputLocator.fill(CVC);
                await this.locators.expiryMonthInputLocator.fill(expiryMonth);
                await this.locators.expiryYearInputLocator.fill(expiryYear);
            },

            clickPayButton: async () => {
                await this.locators.payButtonInputLocator.click();
            },

            clickContinueButton: async () => {
                await this.locators.continueButtonLocator.click();
            }
        };
    }
}
