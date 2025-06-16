import { Locator, Page, expect } from "@playwright/test";

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

    async fillContactUsForm(firstName,lastName, email, subject, message, filePath) {
        await this.nameFieldLocator.fill(`${firstName}  ${lastName}`);
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
