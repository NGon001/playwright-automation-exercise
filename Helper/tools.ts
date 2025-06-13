import { Locator,expect } from "@playwright/test";

export async function generateRandomEmail() {
  const randomNumber = Math.floor(Math.random() * 1e16).toString().padStart(16, '0');
  return `max${randomNumber}@gmail.com`;
}

export async function textPriceToFloat(textPrice: string){
  const match = textPrice.match(/[0-9]+/i);
  return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
}


export async function expectAtLeastOneVisible(...locators: Locator[]) {
  for (const locator of locators) {
    try {
      if (await locator.isVisible()) {
        expect(true).toBe(true);  // pass
        return;
      }
    } catch {
      // ignore errors if element not found
    }
  }
  throw new Error('None of the provided elements are visible.');
}
