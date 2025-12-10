import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Helper/BasePage";

export class ContactUsPage extends BasePage{
    readonly locators: {
        getInTouchTextLocator: Locator;
        nameFieldLocator: Locator;
        emailFieldLocator: Locator;
        subjectFieldLocator: Locator;
        messageFieldLocator: Locator;
        submitButtonLocator: Locator;
        chooseFileButtonLocator: Locator;
        successMessageLocator: Locator;
        returnHomeButtonLocator: Locator;
    }

    readonly actions: {
        fillContactUsForm: (firstName: string,lastName: string, email: string, subject: string, message: string, filePath: string) => Promise<void>;
        clickSubmitButton: () => Promise<void>;
        clickReturnHomeButton: () => Promise<void>;
    };

    readonly assertions: {
        expectGetInTouchTextVisible: () => Promise<void>;
        expectSuccessMessageVisible: () => Promise<void>;
    };

    constructor(page: Page){
        super(page);

        this.locators = {
            getInTouchTextLocator : this.page.getByText('Get In Touch'),
            nameFieldLocator : this.page.getByPlaceholder('Name',{ exact: true }),
            emailFieldLocator : this.page.getByPlaceholder('Email',{ exact: true }),
            subjectFieldLocator : this.page.getByPlaceholder('Subject',{ exact: true }),
            messageFieldLocator : this.page.getByPlaceholder('Your Message Here',{ exact: true }),
            submitButtonLocator : this.page.getByRole('button', { name: 'Submit' }),
            chooseFileButtonLocator : this.page.getByRole('button', { name: 'Choose File' }),
            successMessageLocator : this.page.locator('.status.alert.alert-success'),
            returnHomeButtonLocator : this.page.locator("#form-section").getByRole('link', { name: ' Home' }),
        };

        this.assertions = {
            expectGetInTouchTextVisible: async () => {
                await expect(await this.locators.getInTouchTextLocator).toBeVisible();
            },

            expectSuccessMessageVisible: async () => {
                await expect(await this.locators.successMessageLocator).toBeVisible();
            }
        };

        this.actions = {
            fillContactUsForm: async (firstName: string,lastName: string, email: string, subject: string, message: string, filePath: string) => {
                await this.locators.nameFieldLocator.fill(`${firstName}  ${lastName}`);
                await this.locators.emailFieldLocator.fill(email);
                await this.locators.subjectFieldLocator.fill(subject);
                await this.locators.messageFieldLocator.fill(message);
                if (filePath) {
                    await this.locators.chooseFileButtonLocator.setInputFiles(filePath);
                }
            },

            clickSubmitButton: async () => {
                let AlertMessage = '';
                this.page.on('dialog', dialog => { AlertMessage = dialog.message();dialog.accept()});
                await this.locators.submitButtonLocator.click();
                expect(AlertMessage).toBe("Press OK to proceed!");
            },

            clickReturnHomeButton: async () => {
                await this.locators.returnHomeButtonLocator.click();
            }
        };
    }
}
