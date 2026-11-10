# Cav Connect

Earn points for showing up to UVA spring sports. Check in at the gate, stack a multi-sport bonus, climb tiers, redeem rewards.

Prototype for the NBK Prime team project (Darden). Front-end only — all data is mock data in `src/data/`, and fan state persists in `localStorage`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Open it in a phone-width window (or DevTools device mode). **Reset demo data** on the Home tab clears your points.

## What's in the box

| Tab | What a fan can do | File |
|---|---|---|
| Home | See balance, tier progress, multi-sport streak, up-next games, recent activity | `src/tabs/HomeTab.jsx` |
| Events | Browse games with earn values and storylines; check in to a live game via QR; get blocked for upcoming/past/duplicate check-ins | `src/tabs/EventsTab.jsx`, `src/components/CheckInSheet.jsx` |
| Rewards | Browse merch/dining/experience catalog; redeem; get blocked when short on points or sold out | `src/tabs/RewardsTab.jsx` |

Rules live in one place so they're easy to reason about and test by hand:

- `src/data/points.js` — tiers, multi-sport bonus, check-in blockers, redeem blockers, streak
- `src/data/events.js` — the schedule (change `status` to `live` / `upcoming` / `past` to test scenarios)
- `src/data/rewards.js` — the catalog (`stock: 0` = sold out)
- `src/useFanState.js` — the fan's balance, lifetime points, check-ins, redemptions

### Points rules

- Base points per game are set per event (underserved sports earn more: 75–100 vs 25 for basketball).
- **Multi-sport bonus:** if your most recent check-in was a *different* sport, base points are doubled (75 base + 75 bonus = 150).
- Tiers by lifetime points: Bronze 0 · Silver 250 · Gold 500 · Platinum 1000. Redeeming spends balance but never lowers your tier.
- One check-in per game. Check-in only opens for `live` games.

## Test it

```bash
npm test            # unit + integration tests (Vitest), about 1 second
npm run test:e2e    # system tests: a real browser runs each scenario (Playwright)
npm run test:all    # everything
```

First time running the system tests on your machine? Install the browser once: `npx playwright install chromium`.

| Level | File | What it checks |
|---|---|---|
| Unit | `src/data/rewards.test.js` | `remainingStock()` and `redeemBlocker()` on their own, with test data |
| Integration | `src/tabs/RewardsTab.integration.test.jsx` | The Rewards tab, fan state and storage together in a simulated page |
| System | `e2e/rewards.spec.js` | The Given-When-Then scenarios from PR #4, in a real browser |

GitHub runs `npm test` on every push and pull request (`.github/workflows/test.yml`). See the result in the repo's **Actions** tab, or as a check or X next to each commit.

## Working on a story

1. Branch from `main`: `git checkout -b <your-name>/<story-slug>`
2. Keep your change inside the tab/file you own (see `STORIES.md`) so PRs don't collide.
3. Write your Given-When-Then scenarios *before* coding. Run them by hand. Record results in the PR.
4. Open the PR with the template in `.github/pull_request_template.md`.
