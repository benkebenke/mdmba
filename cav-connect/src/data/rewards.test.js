// UNIT TESTS — the smallest pieces of the Rewards story, tested on their own.
// No page, no React, no browser storage. Each test feeds fixed inputs to one
// function and checks the answer, so a failure points straight at that function.
import { describe, expect, it } from "vitest";
import { remainingStock } from "./rewards";
import { redeemBlocker } from "./points";

// Test data, not the real catalog: if someone edits rewards.js, these still hold.
const tee = { id: "tee", name: "Test Tee", cost: 250, stock: 3 };
const redeemed = (id, times) => Array.from({ length: times }, () => ({ rewardId: id }));

describe("remainingStock()", () => {
  it("starts at the full stock when nothing has been redeemed", () => {
    expect(remainingStock(tee, [])).toBe(3);
  });

  it("goes down by one for each redemption of that reward", () => {
    expect(remainingStock(tee, redeemed("tee", 1))).toBe(2);
    expect(remainingStock(tee, redeemed("tee", 3))).toBe(0);
  });

  it("ignores redemptions of other rewards", () => {
    expect(remainingStock(tee, redeemed("hoodie", 2))).toBe(3);
  });

  it("never goes below zero", () => {
    expect(remainingStock(tee, redeemed("tee", 5))).toBe(0);
  });
});

describe("redeemBlocker()", () => {
  it("allows a redemption when in stock and the fan can afford it", () => {
    expect(redeemBlocker(tee, 320)).toBeNull();
  });

  it("blocks a sold-out reward even when the fan has plenty of points", () => {
    expect(redeemBlocker({ ...tee, stock: 0 }, 1000)).toMatch(/sold out/i);
  });

  it("tells the fan exactly how many more points they need", () => {
    expect(redeemBlocker(tee, 70)).toBe("You need 180 more points for this reward.");
  });

  it("allows a redemption that uses every last point", () => {
    expect(redeemBlocker(tee, 250)).toBeNull();
  });
});
