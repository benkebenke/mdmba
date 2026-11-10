// SYSTEM TEST — a real browser opens the running app and acts like a fan,
// one test per Given-When-Then scenario from PR #4. Most realistic, least
// specific: a failure says the scenario broke, not which line caused it.
import { expect, test } from "@playwright/test";

const KEY = "cavconnect.fan.v1";

// Start every scenario from Reset demo data: 320 pts, nothing redeemed.
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Reset demo data/ }).click();
});

const tee = (page) => page.locator(".reward", { hasText: "Cav Connect Launch Tee" });
const balance = (page) => page.locator(".topbar .pts");

async function redeemTee(page) {
  await tee(page).getByRole("button").click();
  await page.getByRole("button", { name: "Confirm redemption" }).click();
}

test("Scenario 1 — Given 320 pts and 3 tees, when I redeem a tee, then I have 70 pts and 2 tees left", async ({ page }) => {
  await page.getByRole("button", { name: /Rewards/ }).click();
  await expect(tee(page)).toContainText("3 left");

  await redeemTee(page);

  await expect(balance(page)).toHaveText("70 pts");
  await expect(tee(page)).toContainText("2 left");
});

test("Scenario 2 — Given I redeemed a tee, when I refresh and switch tabs, then it still shows 2 left until I reset", async ({ page }) => {
  await page.getByRole("button", { name: /Rewards/ }).click();
  await redeemTee(page);

  await page.reload();
  await page.getByRole("button", { name: /Events/ }).click();
  await page.getByRole("button", { name: /Rewards/ }).click();
  await expect(tee(page)).toContainText("2 left");

  await page.getByRole("button", { name: /Home/ }).click();
  await page.getByRole("button", { name: /Reset demo data/ }).click();
  await page.getByRole("button", { name: /Rewards/ }).click();
  await expect(tee(page)).toContainText("3 left");
});

test("Scenario 3 (failure) — Given the tee is sold out, when I try to redeem it, then I'm told it's sold out and keep my points", async ({ page }) => {
  // Test setup: give the fan enough points to buy all three tees.
  await page.evaluate((key) => {
    const fan = JSON.parse(localStorage.getItem(key));
    localStorage.setItem(key, JSON.stringify({ ...fan, balance: 1000 }));
  }, KEY);
  await page.reload();
  await page.getByRole("button", { name: /Rewards/ }).click();

  for (let i = 0; i < 3; i++) await redeemTee(page);
  await expect(tee(page)).toContainText("Sold out");
  await expect(balance(page)).toHaveText("250 pts");

  await tee(page).getByRole("button", { name: "Unavailable" }).click();

  await expect(page.locator(".notice")).toHaveText("Sold out — check back when it restocks.");
  await expect(page.getByRole("button", { name: "Confirm redemption" })).toHaveCount(0);
  await expect(balance(page)).toHaveText("250 pts");
});
