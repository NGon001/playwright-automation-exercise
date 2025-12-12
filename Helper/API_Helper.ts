import { expect, type APIRequestContext, type APIResponse } from "@playwright/test";
import { z } from 'zod';

export async function buildSchema(successSchema: z.ZodTypeAny, ExpectedCode: number, ExpectedMessage?: string) {
    if (ExpectedCode !== Status.success) {
        return z.object({
            responseCode: z.literal(ExpectedCode),
            message: z.literal(ExpectedMessage)
        });
    }
    return successSchema;
}

export async function makeRequest(request: APIRequestContext, url: string, method: string, form: Record<string, string> = {}): Promise<APIResponse> {
  expect(method).not.toBe(undefined);
  switch (method) {
    case 'POST':
      return request.post(url, { form });
    case 'GET':
      return request.get(url, {  params: form });
    case 'PUT':
      return request.put(url, { form });
    case 'DELETE':
      return request.delete(url, { form });
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
}

export async function verifyResponseCode(response: APIResponse, expectedCode: Number){
  const responseBody = await response.json();
  //console.log(responseBody);
  await expect(responseBody.responseCode,`Expected: ${expectedCode}\nReceived: ${responseBody.responseCode}\nFull response: ${JSON.stringify(responseBody, null, 2)}`).toBe(expectedCode);
  await expect((await response).ok()).toBeTruthy();
}

export async function verifyResponseSchema(response: APIResponse, schema: z.ZodTypeAny){ {
  const responseBody = await response.json();
  expect(() => {
    schema.parse(responseBody);
  }).not.toThrow();
}}

export const APIEndPoints = {
    verifyLogin: '/api/verifyLogin',
    createAccount: '/api/createAccount',
    deleteAccount: '/api/deleteAccount',
    getUserDetailByEmail: '/api/getUserDetailByEmail',
    brandList: '/api/brandsList',
    searchProduct: '/api/searchProduct',
};

export const Status = { success: 200, resourceCreated: 201, badReq: 400, notFound: 404, methodNotAllowed: 405, serverError: 500};
export const Methods = { GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE'};

export const Messages = {
    userFoundMessage: "User exists!",
    userNotFoundMessage: "User not found!",
    userCreatedMessage: "User created!",
    userDeletedMessage: "Account deleted!",
    accountNotFoundMessage: "Account not found with this email, try another email!",
    badRequestMessage: (method: string) => `Bad request, email or password parameter is missing in ${method} request.`,
    badRequestParameterMessage: (method: string, parameter: string) => `Bad request, ${parameter} parameter is missing in ${method} request.`,
    notSupportedReqMethodMessage: "This request method is not supported.",
    emailAlreadyExistsMessage: "Email already exists!",
    methodNotAllowedMessage: (method: string) => `Method \"${method}\" not allowed.`,
}

export const Titles = {Mr: "Mr", Mrs: "Mrs", Miss: "Miss"};