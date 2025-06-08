import { Locator, Page, expect } from "@playwright/test";

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
        await this.page.goto("/");
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
    readonly page: Page;
    readonly subscriptionTextLocator: Locator;
    readonly subscriptionEmailInputLocator: Locator;
    readonly subscribeButtonLocator: Locator;
    readonly subscribeMessage: Locator;

    constructor(page: Page){
        this.page = page;
        this.subscriptionTextLocator = this.page.getByText("Subscription");
        this.subscriptionEmailInputLocator = this.page.getByPlaceholder("Your email address");
        this.subscribeButtonLocator = this.page.locator("#subscribe");
        this.subscribeMessage = this.page.getByText("You have been successfully subscribed!");
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

    constructor(page: Page){
        this.page = page;
        this.allProductsTextLocator = this.page.getByText("All Products", {exact: true});
        this.allProductsItemsLocator = this.page.locator(".features_items .col-sm-4");
        this.searchInputLocator = this.page.getByPlaceholder("Search Product");
        this.submitSearchButtonLocator = this.page.locator("#submit_search");
        this.searchedProductsTextLocator = this.page.getByText("Searched Products");
        this.cartModelContinueShoppingButton = this.page.getByRole("button",{name: "Continue Shopping"});
        this.cartModelViewCartButton = this.page.getByRole("link",{name: "View Cart"});
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
        return await product.getByRole("link",{name: "View Product"}).getAttribute("href");
    }

    async clickViewProductButton(product: Locator){
        await product.getByRole("link",{name: "View Product"}).click();
    }

    async clickFirstProductViewProductButton(){
        const products = await this.getAllProducts();
        await this.clickViewProductButton(products.nth(0));
    }

    async verefyThatProductsSearchComplited(){
        await expect(this.searchedProductsTextLocator).toBeVisible();
    }

    async searchProducts(productsName: string){
        await this.searchInputLocator.fill(productsName);
        await this.submitSearchButtonLocator.click();
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

    private async hoverToProduct(product: Locator){
        await product.hover();
    }

    private async clickAddToCartInOverlayContent(product: Locator){
        await this.hoverToProduct(product);
        const overlayContent = await product.locator(".overlay-content");
        await overlayContent.locator("a.btn.add-to-cart").click();
    }

    async addToCartProductByIndex(index){
        const products = await this.getAllProducts();
        await expect(await products.count()).not.toBe(0);
        await this.clickAddToCartInOverlayContent(products.nth(index));
    }

    async clickContinueShoppingButton(){
        await this.cartModelContinueShoppingButton.click();
    }

    async clickViewCartButton(){
        await this.cartModelViewCartButton.click();
    }
}

export class ProductPage{
    readonly page: Page;
    readonly productInformationSectionLocator: Locator;

    constructor(page: Page){
        this.page = page;
        this.productInformationSectionLocator = this.page.locator(".product-information");
    }

    async goBack(){
        this.page.goBack();
    }

    private async expectTextNotBeNull(...values: string[]) {
        for(const value of values){
            //console.log(`Currennt valueCheck: ${value}`);
            await expect(value).not.toBe("");
        }
    }

    async getProductCategory(){
        return await this.productInformationSectionLocator.getByText("Category:").textContent() || "";
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
    }

    async checkThatSignUpAndLoginButtonIsVissible(){
        await expect(await this.signUpAndLoginPageLocator).toBeVisible();
    }

    async fillStartSignUpForm(fullName, email){
        await this.signUpFormLocator.getByPlaceholder('Name').fill(fullName[0]);
        await this.signUpFormLocator.getByPlaceholder('Email Address').fill(email);
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

    constructor(page: Page){
        this.page = page;
        this.nameFieldLocator = this.page.locator("#name");
        this.emailFieldLocator = this.page.locator("#email");
        this.createAccountButton = this.page.getByRole('button', { name: 'Create Account' });
    }

    async checkDataInForm(fullName, email){
        await expect(await this.page.getByText('Enter Account Information')).toBeVisible();
        await expect(await this.nameFieldLocator.getAttribute('value')).toBe(fullName[0]);
        await expect(await this.emailFieldLocator.getAttribute('value')).toBe(email);   
    }

    async fillSignUpForm(Title,fullName,password,BirthDay,BirthMonth,BirthYear,companyName,Address,Address2,Country,State,City,Zipcode,mobileNumber){
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