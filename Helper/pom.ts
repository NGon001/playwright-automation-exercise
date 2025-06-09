import { Locator, Page, expect } from "@playwright/test";
import {textPriceToFloat} from "./tools.ts"

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
        this.cartButtonLocator = this.page.getByRole("link",{name: "Cart"});
    }

    async goto(){
        await this.page.goto("/", { waitUntil: "domcontentloaded" });
    }

    async gotoSignUpAndLoginPage(){
        await this.signUpAndLoginPageLocator.click();
    }

    async gotoContactUsPage(){
        await this.contactUsButtonLocator.click();
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
    readonly productPriceTextSelector = ".cart_price p";
    readonly productQuantityTextSelector = ".cart_quantity button";
    readonly productNameTextSelector = "h4";

    readonly page: Page;
    readonly subscriptionTextLocator: Locator;
    readonly subscriptionEmailInputLocator: Locator;
    readonly subscribeButtonLocator: Locator;
    readonly subscribeMessage: Locator;
    readonly productsListLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.subscriptionTextLocator = this.page.getByText("Subscription");
        this.subscriptionEmailInputLocator = this.page.getByPlaceholder("Your email address");
        this.subscribeButtonLocator = this.page.locator("#subscribe");
        this.subscribeMessage = this.page.getByText("You have been successfully subscribed!");
        this.productsListLocator = this.page.locator("#cart_info_table tbody tr");
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

    async checkProductInfoByIndex(index: number, name: string, price: number, quantity: number){
        const products = await this.getProductsList();
        const product = await products.nth(index);
        const productName = await product.locator(this.productNameTextSelector).textContent();
        const productPrice = await textPriceToFloat(await product.locator(this.productPriceTextSelector).textContent() ?? "");
        const productQuantity = parseInt(await product.locator(this.productQuantityTextSelector).textContent() ?? "");
        
        await expect(productName).toBe(name);
        await expect(productPrice).toBe(price);
        await expect(productQuantity).toBe(quantity);
    }
}

export class ProductsPage{
    readonly page: Page;
    readonly allProductsTextLocator: Locator;
    readonly allProductsItemsLocator: Locator;
    readonly searchInputLocator: Locator;
    readonly submitSearchButtonLocator: Locator;
    readonly searchedProductsTextLocator: Locator;
    readonly cartModelContinueShoppingButton: Locator;
    readonly cartModelViewCartButton: Locator;
    readonly viewProductLinkLocator: (product: Locator) => Locator;
    readonly overlayContentLocator: (product: Locator) => Locator;
    readonly overlayContentAddProductButtonLocator: (overlayContent: Locator) => Locator;
    readonly productOverlayHoverLocator: (product: Locator) => Locator;
    readonly productViewProductButtonLocator: (product: Locator) => Locator;
    readonly productNameTextLocator: (product: Locator) => Locator;
    readonly productPriceTextLocator: (product: Locator) => Locator;

    constructor(page: Page){
        this.page = page;
        this.allProductsTextLocator = this.page.getByText("All Products", {exact: true});
        this.allProductsItemsLocator = this.page.locator(".features_items .col-sm-4");
        this.searchInputLocator = this.page.getByPlaceholder("Search Product");
        this.submitSearchButtonLocator = this.page.locator("#submit_search");
        this.searchedProductsTextLocator = this.page.getByText("Searched Products");
        this.cartModelContinueShoppingButton = this.page.getByRole("button",{name: "Continue Shopping"});
        this.cartModelViewCartButton = this.page.getByRole("link",{name: "View Cart"});
        this.viewProductLinkLocator = (product: Locator) => product.getByRole("link", { name: "View Product" });
        this.overlayContentLocator = (product: Locator) => product.locator(".overlay-content");
        this.overlayContentAddProductButtonLocator = (overlayContent: Locator) => overlayContent.locator("a.btn.add-to-cart");
        this.productOverlayHoverLocator = (product: Locator) => product.locator(".product-overlay");
        this.productViewProductButtonLocator = (product: Locator) => product.getByRole("link",{name: "View Product"});
        this.productNameTextLocator = (product: Locator) => product.locator("p").first();
        this.productPriceTextLocator = (product: Locator) => product.locator("h2").first();
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
        await this.productViewProductButtonLocator(await product).click();
    }

    async clickFirstProductViewProductButton(){
        const products = await this.getAllProducts();
        await this.clickViewProductButton(products.nth(0));
    }

    async verefyThatProductsSearchComplited(){
        await expect(this.searchedProductsTextLocator).toBeVisible({timeout: 500});
    }

    async searchProducts(productsName: string){
        await expect(async() =>{
            await this.searchInputLocator.clear();
            await this.searchInputLocator.fill(productsName);
            await this.submitSearchButtonLocator.click();
            await this.verefyThatProductsSearchComplited();
        }).toPass();
    }

    async checkIfProductNameIsMatchingWithKeyWord(product: Locator,keyWord: string){
        const productName = await this.productNameTextLocator(await product).textContent() ?? "";
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

    private async hoverToProduct(product: Locator){
        await product.hover({ force: true });
    }


    private async clickAddToCartInOverlayContent(product: Locator){
        await expect(async() => {
            await product.scrollIntoViewIfNeeded();
            await this.hoverToProduct(product);
            await this.page.waitForTimeout(600);  // 500ms(how long is animation) + small buffer
            const overlayContent = await this.overlayContentLocator(product);
            await expect(await this.overlayContentAddProductButtonLocator(overlayContent)).toBeVisible({timeout: 500});
        }).toPass({timeout: 30000});

        const overlayContent = await this.overlayContentLocator(product);
        await this.overlayContentAddProductButtonLocator(overlayContent).click();
    }

    async addToCartProductByIndex(index): Promise<{ name: string; price: number }> {
        const products = await this.getAllProducts();
        await expect(await products.count()).not.toBe(0);
        const product = await products.nth(index);
        const name = await this.productNameTextLocator(await product).textContent() ?? "";
        const priceFloat = await textPriceToFloat(await this.productPriceTextLocator(await product).textContent() ?? "");
        await expect(name).not.toBe("");
        await expect(priceFloat).not.toBe(0 || null || "");
        await this.clickAddToCartInOverlayContent(products.nth(index));
        return {name: name, price: priceFloat};
    }

    async clickContinueShoppingButton(){
        await this.cartModelContinueShoppingButton.click();
    }

    async clickViewCartButton(){
        await this.cartModelViewCartButton.click();
    }

    async addwait(time){
        await this.page.waitForTimeout(time); 
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

    constructor(page: Page){
        this.page = page;
        this.productInformationSectionLocator = this.page.locator(".product-information");
        this.prductInformationSectionCategoryLocator = (productInformationSection: Locator) => productInformationSection.getByText("Category:");
        this.prductInformationSectionPriceLocator = (productInformationSection: Locator) => productInformationSection.locator("span span");
        this.prductInformationSectionAvailabilityLocator = (productInformationSection: Locator) => productInformationSection.locator("p",{hasText: "Availability:"});
        this.prductInformationNameLocator = (productInformationSection: Locator) => productInformationSection.locator("h2");
        this.prductInformationSectionBrandLocator = (productInformationSection: Locator) => productInformationSection.locator("p",{hasText: "Brand:"});
        this.prductInformationSectionConditionLocator = (productInformationSection: Locator) => productInformationSection.locator("p",{hasText: "Condition:"});
    }

    async goBack(){
        this.page.goBack();
    }

    private async expectTextNotBeNull(...values: string[]) {
        for(const value of values){
            await expect(value).not.toBe("");
        }
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
        const productName = await this.getProductName();
        const productCategoryText = await this.getProductCategory();
        const productPriceText = await this.getProductPriceText();
        const productAvailability = await this.getProductAvailability();
        const productBrand = await this.getProductBrand();
        const productCondition = await this.getProductCondition();

        await this.expectTextNotBeNull(productName,productCategoryText,productPriceText,productAvailability,productBrand,productCondition);
    }

    async verifyMatchingCategory(keyWord: string) {
        const productCategory = await this.getProductCategory();
        const isMatching = productCategory.toLowerCase().includes(keyWord.toLowerCase());
        await expect(isMatching).toBeTruthy();
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
        await this.FormEmailInputLocator(await this.loginFormLocator).fill(email);
        await this.FormPasswordnputLocator(await this.loginFormLocator).fill(password);
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
        await expect(await this.enterAccountInfTextLocator).toBeVisible();
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