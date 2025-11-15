import { expect, APIResponse, APIRequestContext } from "@playwright/test";
import fs from 'fs/promises';
import { z } from 'zod';

export async function generateRandomEmail(): Promise<string> {
  const randomNumber = Math.floor(Math.random() * 1e16).toString().padStart(16, '0');
  return `max${randomNumber}@gmail.com`;
}

export async function textPriceToFloat(textPrice: string): Promise<number> {
  const match = textPrice.match(/[0-9]+/i);
  return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
}

export async function expectTextNotBeNull<T>(...values: T[]) {
  for (const value of values) {
    await expect(value).not.toBe("");
  }
}

export async function emptyDir(dir: string) {
  try {
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // Ignore errors
  }
}

export async function makeRequest(request: APIRequestContext, url: string, method: string, form: Record<string, string> = {}): Promise<APIResponse> {
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

export async function getEnv(name: string): Promise<string> {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined in env variables`);
  }
  return value;
}