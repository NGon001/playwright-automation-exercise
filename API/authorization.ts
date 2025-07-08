import { APIRequestContext, APIResponse,expect } from '@playwright/test';
import { z } from 'zod';

export class AuthorizationAPI{
    readonly Status = { success: 200, badReq: 400, serverError: 500, notFound: 404};
    readonly Methods = ["GET", "POST", "PUT", "DELETE"];

    readonly request: APIRequestContext;
    readonly POST_verifyLogin: (email: string | undefined, password: string | undefined) => Promise<APIResponse>;

    constructor(request: APIRequestContext){
        this.request = request;
        this.POST_verifyLogin = (email: string | undefined, password: string | undefined) => {
            const form: Record<string, string> = {};
            if (email !== undefined) form.email = email;
            if (password !== undefined) form.password = password;
            return this.request.post('/api/verifyLogin', { form });
        };
    }

    async verifyResponseCode(response, expectedCode){
        const responseBody = await response.json();
        await expect(responseBody.responseCode).toBe(expectedCode);
        await expect((await response).ok()).toBeTruthy();
    }

    async verifyResponseSchema(response, schema) {
      const responseBody = await response.json();
      expect(() => {
        schema.parse(responseBody);
      }).not.toThrow();
    }

    async verifyLoginAPISchema(response, expectedCode: number, expectedMessage: string){
        const schema = z.object({
          responseCode: z.literal(expectedCode),
          message: z.literal(expectedMessage),
        });
        await this.verifyResponseSchema(response,schema);
    }
}