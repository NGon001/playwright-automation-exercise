import { APIRequestContext, APIResponse,expect } from '@playwright/test';
import { verifyResponseSchema, verifyResponseCode, makeRequest } from '../Helper/tools';
import { z } from 'zod';
import { Status } from '../Helper/base';

export class ProductsAPI{
    readonly request: APIRequestContext;
    readonly GET_brandsList: (method) => Promise<APIResponse>;
    readonly POST_searchProduct: (method,productName: string) => Promise<APIResponse>;

    constructor(request: APIRequestContext){
        this.request = request;
        this.GET_brandsList = (method) => {
            expect(method).not.toBe(undefined);
            return makeRequest(this.request ,'/api/brandsList',method);
        };
        this.POST_searchProduct = (method,productName: string) => {
            expect(method).not.toBe(undefined);
            const form: Record<string, string> = {};
            if (productName !== undefined) form.search_product = productName;
            return makeRequest(this.request ,'/api/searchProduct',method,form);
        };
    }

    async brandsList(method, ExpectedCode, ExpectedMessage){
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
        const response = await this.GET_brandsList(method);
        await verifyResponseCode(response,ExpectedCode);
        await verifyResponseSchema(response,schema);
    }

    async searchProduct(method, ExpectedCode, ExpectedMessage, productName){
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
        const response = await this.POST_searchProduct(method,productName);
        await verifyResponseCode(response,ExpectedCode);
        await verifyResponseSchema(response,schema);
    }
}