import { expect } from "@playwright/test";
import fs from 'fs/promises';
import { isExpression } from "typescript";

export async function generateRandomEmail() {
  const randomNumber = Math.floor(Math.random() * 1e16).toString().padStart(16, '0');
  return `max${randomNumber}@gmail.com`;
}

export async function textPriceToFloat(textPrice) {
  const match = textPrice.match(/[0-9]+/i);
  return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
}

export async function expectTextNotBeNull(...values) {
  for (const value of values) {
    await expect(value).not.toBe("");
  }
}

export async function emptyDir(dir) {
  try {
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // Ignore errors
  }
}

export async function makeRequest(request,url,method, form) {
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

export async function verifyResponseCode(response, expectedCode){
  const responseBody = await response.json();
  //console.log(responseBody);
  await expect(responseBody.responseCode).toBe(expectedCode,`Expected: ${expectedCode}\nReceived: ${responseBody.responseCode}\nFull response: ${JSON.stringify(responseBody, null, 2)}`);
  await expect((await response).ok()).toBeTruthy();
}

export async function verifyResponseSchema(response, schema) {
  const responseBody = await response.json();
  expect(() => {
    schema.parse(responseBody);
  }).not.toThrow();
}
