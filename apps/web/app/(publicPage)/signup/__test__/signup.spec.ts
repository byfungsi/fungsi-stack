"use client";
import {
  Browser,
  BrowserContext,
  chromium,
  expect,
  Page,
} from "@playwright/test";
import { describe, test, beforeAll, afterAll } from "vitest";
import { TITLES } from "../../../_constants/titles";

describe("Sign Up", () => {
  let page: Page;
  let browser: Browser;
  let context: BrowserContext;

  beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
  });
  afterAll(async () => {
    await browser.close();
  });

  test("opening sign up page", async () => {
    await page.goto("http://localhost:3000/signup");
    await expect(page).toHaveURL(/signup/gim);
    await expect(page).toHaveTitle(TITLES.SIGNUP);
  });
});
