import { expect } from "@playwright/test";
import fs from 'fs/promises';

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
