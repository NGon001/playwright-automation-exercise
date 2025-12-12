import { APIRequestContext, APIResponse,expect } from '@playwright/test';
import { verifyResponseSchema, verifyResponseCode, makeRequest } from '../Helper/Tools';
import { z } from 'zod';
import { APIEndPoints, Status } from '../Helper/API_Helper';

export class ProductsAPI{
    readonly request: APIRequestContext;

    readonly requests: {
        GET_brandsList: (method: string) => Promise<APIResponse>;
        POST_searchProduct: (method: string, productName: string) => Promise<APIResponse>;
    };

    readonly methods: {
        brandsList: (method: string, ExpectedCode: number, ExpectedMessage?: string) => Promise<void>;
        searchProduct: (method: string, ExpectedCode: number, ExpectedMessage: string, productName: string) => Promise<void>;
    }

    constructor(request: APIRequestContext){
        this.request = request;

        this.requests = {
            GET_brandsList: async  (method) => {
                expect(method).not.toBe(undefined);
                return makeRequest(this.request , APIEndPoints.brandList, method);
            },
            POST_searchProduct: async  (method,productName: string) => {
                expect(method).not.toBe(undefined);
                const form: Record<string, string> = {};
                if (productName !== "") form.search_product = productName;
                return makeRequest(this.request, APIEndPoints.searchProduct, method, form);
            },
        };

        this.methods = {
            brandsList: async (method, ExpectedCode, ExpectedMessage="") => {
                let schema;
                if(ExpectedCode !== Status.success){
                    schema = z.object({
                        responseCode: z.literal(ExpectedCode),
                        message: z.literal(ExpectedMessage)
                    });
                }else{
                    schema = z.object({
                        responseCode: z.literal(ExpectedCode),
                        brands: z.array(
                            z.object({
                                id: z.number(),
                                brand: z.string(),
                            })
                        ).nonempty("brands array must contain at least one item")
                    });
                } 
                const response = await this.requests.GET_brandsList(method);
                await verifyResponseCode(response,ExpectedCode);
                await verifyResponseSchema(response,schema);
            },

            searchProduct: async (method, ExpectedCode, ExpectedMessage, productName) => {
                let schema;
                if(ExpectedCode !== Status.success){
                    schema = z.object({
                        responseCode: z.literal(ExpectedCode),
                        message: z.literal(ExpectedMessage)
                    });
                }else{
                    schema = z.object({
                        responseCode: z.literal(ExpectedCode),
                        products: z.array(
                            z.object({
                                id: z.number(),
                                name: z.string(),
                                price: z.string(),
                                brand: z.string(),
                                category: z.object({
                                    usertype: z.object({
                                        usertype: z.string()
                                    }),
                                    category: z.string()
                                })
                            })
                        )
                    });
                } 
                const response = await this.requests.POST_searchProduct(method,productName);
                await verifyResponseCode(response,ExpectedCode);
                await verifyResponseSchema(response,schema);
            },
        };
    }
}