// @vitest-environment jsdom
//
// INTEGRATION TEST — the Rewards tab, the fan-state hook, the stock and redeem
// rules, and browser storage all running together in a simulated page (jsdom).
// No real browser and nobody typing. It fails if the pieces disagree — e.g. the
// tab reads stock from the wrong place, or a redemption isn't saved.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

const KEY = "cavconnect.fan.v1";

// Test data: a fan with enough points to buy every tee. Never real user data.
function seedFan(fields) {
  localStorage.setItem(KEY, JSON.stringify({ redemptions: [], ...fields }));
}

const teeCard = () =>
  screen.getByText("Cav Connect Launch Tee", { selector: ".reward strong" }).closest(".reward");

async function openRewards(user) {
  await user.click(screen.getByRole("button", { name: /Rewards/ }));
}

async function redeemTee(user) {
  await user.click(within(teeCard()).getByRole("button"));
  await user.click(screen.getByRole("button", { name: "Confirm redemption" }));
}

describe("Rewards tab — limited stock", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("counts the tee down to Sold out and blocks a fourth redemption", async () => {
    seedFan({ balance: 1000, lifetime: 1000 });
    const user = userEvent.setup();
    render(<App />);
    await openRewards(user);

    expect(within(teeCard()).getByText("3 left")).toBeTruthy();

    await redeemTee(user);
    expect(within(teeCard()).getByText("2 left")).toBeTruthy();
    expect(screen.getByText(/750 pts left\. Only 2 left\./)).toBeTruthy();

    await redeemTee(user);
    await redeemTee(user);
    expect(within(teeCard()).getByText("Sold out")).toBeTruthy();
    expect(screen.getByText(/That was the last one\./)).toBeTruthy();

    // Fourth try: blocked, no confirm sheet, balance unchanged.
    await user.click(within(teeCard()).getByRole("button", { name: "Unavailable" }));
    expect(screen.getByText(/Sold out — check back when it restocks/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Confirm redemption" })).toBeNull();
    expect(screen.getByText("250 pts", { selector: "strong" })).toBeTruthy();
  });

  it("keeps the lower stock after the app is closed and reopened", async () => {
    seedFan({ balance: 1000, lifetime: 1000 });
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await openRewards(user);
    await redeemTee(user);
    unmount(); // like closing the tab

    render(<App />);
    await openRewards(user);
    expect(within(teeCard()).getByText("2 left")).toBeTruthy();
  });
});
