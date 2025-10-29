import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Helper/BasePage";

export class PaymentPage extends BasePage{
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
        super(page);
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

    async fillPaymentForm(firstName: string,lastName: string,cardNumber: string,CVC: string,expiryMonth: string,expiryYear: string){
        await this.verifyPageLoaded();
        await this.nameOnCardInputLocator.fill((firstName + ' ' + lastName));
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
