import { expect, type APIResponse, type BrowserContext } from "@playwright/test";
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

export async function getEnv(name: string): Promise<string> {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined in env variables`);
  }
  return value;
}

export async function blockAds(context: BrowserContext) {
  await context.route("**/*", route => {
    route.request().url().startsWith("https://googleads.") ?
    route.abort() : route.continue();
    return;
  });
}

export async function saveAdditionsAttachments(context: BrowserContext, page: any, testInfo: any) {
  // Save trace
  const testTitle = testInfo.title.replace(/[^a-zA-Z0-9-_]/g, '_');
  const tracePath = `test-resultsSave/traces/trace-${testTitle}.zip`;
  await context.tracing.stop({ path: tracePath });
  testInfo.annotations.push({ type: 'testrail_attachment', description: tracePath });
  
  // Save screenshot and video
  let screenshotPath = `test-resultsSave/screenshots/screenshot-${testTitle}.png`;
  const videoPath = `test-resultsSave/videos/video-${testTitle}.webm`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await page.close();
  testInfo.annotations.push({ type: 'testrail_attachment', description: screenshotPath });
  if (page.video()) {
      await page.video()?.saveAs(videoPath);
      testInfo.annotations.push({ type: 'testrail_attachment', description: videoPath });
  }
};