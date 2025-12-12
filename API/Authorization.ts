import { APIRequestContext, APIResponse,expect } from '@playwright/test';
import { verifyResponseSchema, verifyResponseCode, makeRequest, getEnv } from '../Helper/Tools';
import { z } from 'zod';
import { Status, APIEndPoints } from '../Helper/API_Helper';

export class AuthorizationAPI{
    readonly request: APIRequestContext;

    readonly requests: {
        POST_verifyLogin: (method: string, email: string, password: string ) => Promise<APIResponse>;
        POST_createAccount: (method: string, name: string, email: string , password: string , title: string , birth_date: string , birth_month: string , birth_year: string , firstname: string , lastname: string , company: string , address1: string , address2: string , country: string , zipcode: string , state: string , city: string , mobile_number: string ) => Promise<APIResponse>;
        POST_deleteAccount: (method: string, email: string, password: string ) => Promise<APIResponse>;
        GET_getUserDetailByEmail: (method: string, email: string) => Promise<APIResponse>;
    };

    readonly methods: {
        createAccount: (method: string, ExpectedCode: number, ExpectedMessage:string , name: string , email: string , password: string , title: string , birth_date: string , birth_month: string , birth_year: string , firstname: string , lastname: string , company: string , address1: string , address2: string , country: string , zipcode: string , state: string , city: string , mobile_number: string ) => Promise<void>;
        deleteAccount: (method: string, email: string, password: string, ExpectedCode: number, ExpectedMessage: string) => Promise<void>;
        verifyLogin: (method: string, expectedCode: number, expectedMessage: string, email: string, password: string) => Promise<void>;
        getUserDetailByEmail: (method: string, email: string, ExpectedCode: number, ExpectedMessage: string ) => Promise<void>;
    };
     
    readonly assertions: {
        verifyLoginResponseSchema: (response: APIResponse, expectedCode: number, expectedMessage: string) => Promise<void>;
        verifyCreateAccountResponseSchema: (response: APIResponse, expectedCode: number, expectedMessage: string) => Promise<void>;
        verifyUserDetailResponseSchema: (response: APIResponse, expectedCode: number, expectedMessage: string ) => Promise<void>;
    };

    constructor(request: APIRequestContext){
        this.request = request;

        this.requests = {
            POST_verifyLogin: async (method, email: string , password: string ) => {
                expect(method).not.toBe(undefined);
                const form: Record<string, string> = {};
                if (email !== undefined) form.email = email;
                if (password !== undefined) form.password = password;
                return makeRequest(this.request ,APIEndPoints.verifyLogin,method, form);
            },
            POST_createAccount: async  (method, name: string , email: string , password: string , title: string , birth_date: string , birth_month: string , birth_year: string , firstname: string , lastname: string , company: string , address1: string , address2: string , country: string , zipcode: string , state: string , city: string , mobile_number: string ) => {
                expect(method).not.toBe(undefined);
                const form: Record<string, string> = {};
                if (name !== undefined) form.name = name;
                if (email !== undefined) form.email = email;
                if (password !== undefined) form.password = password;
                if (title !== undefined) form.title = title;
                if (birth_date !== undefined) form.birth_date = birth_date;
                if (birth_month !== undefined) form.birth_month = birth_month;
                if (birth_year !== undefined) form.birth_year = birth_year;
                if (firstname !== undefined) form.firstname = firstname;
                if (lastname !== undefined) form.lastname = lastname;
                if (company !== undefined) form.company = company;
                if (address1 !== undefined) form.address1 = address1;
                if (address2 !== undefined) form.address2 = address2;
                if (country !== undefined) form.country = country;
                if (zipcode !== undefined) form.zipcode = zipcode;
                if (state !== undefined) form.state = state;
                if (city !== undefined) form.city = city;
                if (mobile_number !== undefined) form.mobile_number = mobile_number;
                return makeRequest(this.request, APIEndPoints.createAccount, method, form);
            },
            POST_deleteAccount: async  (method, email: string , password: string ) => {
                expect(method).not.toBe(undefined);
                const form: Record<string, string> = {};
                if (email !== undefined) form.email = email;
                if (password !== undefined) form.password = password;
                return makeRequest(this.request ,APIEndPoints.deleteAccount, method, form);
            },
            GET_getUserDetailByEmail: async  (method, email: string ) => {
                expect(method).not.toBe(undefined);
                const form: Record<string, string> = {};
                if (email !== undefined) form.email = email;
                return makeRequest(this.request , APIEndPoints.getUserDetailByEmail, method, form); 
            }
        };

        this.assertions = {
            verifyLoginResponseSchema: async (response: APIResponse, expectedCode: number, expectedMessage: string) => {
                const schema = z.object({
                  responseCode: z.literal(expectedCode),
                  message: z.literal(expectedMessage),
                });
                await verifyResponseSchema(response,schema);
            },

            verifyCreateAccountResponseSchema: async (response: APIResponse, expectedCode: number, expectedMessage: string) => {
                let schema;
                if(expectedCode !== 405){
                    schema = z.object({
                      responseCode: z.literal(expectedCode),
                      message: z.literal(expectedMessage),
                    });
                }else{
                    schema = z.object({
                      detail: z.literal(expectedMessage),
                    });
                }
                await verifyResponseSchema(response,schema);
            },

            verifyUserDetailResponseSchema: async (response: APIResponse, expectedCode: number, expectedMessage: string ) => {
                const responseBody = await response.json();
                let schema;
                if(responseBody.responseCode !== Status.success)
                {
                    schema = z.object({
                      responseCode: z.literal(expectedCode),
                      message: z.literal(expectedMessage),
                    });
                }
                else{
                    schema = z.object({
                      responseCode: z.literal(expectedCode),
                      user: z.object({
                            id: z.number(),
                            name: z.literal(await getEnv("VALID_LOGIN_NAME_FIRST")),
                            email: z.literal(await getEnv("VALID_LOGIN_EMAIL")),
                            title: z.string(),
                            birth_day: z.string(),
                            birth_month: z.string(),
                            birth_year: z.string(),
                            first_name: z.string(),
                            last_name: z.string(),
                            company: z.string(),
                            address1: z.string(),
                            address2: z.string(),
                            country: z.string(),
                            state: z.string(),
                            city: z.string(),
                            zipcode: z.string()
                        })
                    });
                }

                await verifyResponseSchema(response,schema);
            },
        };

        this.methods = {
          createAccount: async (method, ExpectedCode, ExpectedMessage , name , email , password , title , birth_date , birth_month , birth_year , firstname , lastname , company , address1 , address2 , country , zipcode , state , city , mobile_number ) => {
            const response = await this.requests.POST_createAccount(
                method,
                name,
                email,
                password,
                title,
                birth_date,
                birth_month,
                birth_year,
                firstname,
                lastname,
                company,
                address1,
                address2,
                country,
                zipcode,
                state,
                city,
                mobile_number
            );
            await expect((await response).ok()).toBe((ExpectedMessage.includes("not allowed.") ? false : true));
            await this.assertions.verifyCreateAccountResponseSchema(response,ExpectedCode,ExpectedMessage);
          },
          deleteAccount: async (method, email, password, ExpectedCode, ExpectedMessage) => {
            const response = await this.requests.POST_deleteAccount(method,email,password);
            await verifyResponseCode(response,ExpectedCode);
            await this.assertions.verifyLoginResponseSchema(response,ExpectedCode,ExpectedMessage);
          },

          verifyLogin: async (method, expectedCode, expectedMessage, email, password) => {
            const response = await this.requests.POST_verifyLogin(method,email,password);
            await verifyResponseCode(response,expectedCode);
            await this.assertions.verifyLoginResponseSchema(response,expectedCode,expectedMessage);
          },

          getUserDetailByEmail: async (method, email, ExpectedCode, ExpectedMessage ) => {
            const response = await this.requests.GET_getUserDetailByEmail(method,email);
            await verifyResponseCode(response,ExpectedCode);
            await this.assertions.verifyUserDetailResponseSchema(response,ExpectedCode,ExpectedMessage);
          },
        };
    }
}