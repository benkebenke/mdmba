# Story split

The skeleton on `main` already has the three tabs working end to end with mock data. Each teammate takes **one** story below, on their own branch, touching mostly their own file. Pick, then write your name next to it so nobody collides.

| # | Story | Main file(s) | Owner |
|---|-------|--------------|-------|
| 1 | As a fan, I want to check in to a live game with a QR code so that I earn points for attending — including a 2× bonus when I'm stacking sports | `components/CheckInSheet.jsx`, `data/points.js` | |
| 2 | As a fan, I want to see my tier and how far I am from the next one so that I know what attending gets me | `tabs/HomeTab.jsx`, `data/points.js` (tiers) | |
| 3 | As a fan, I want to redeem points for merchandise, dining, and experiences so that points feel worth earning | `tabs/RewardsTab.jsx`, `data/rewards.js` | |
| 4 | As a fan, I want to see upcoming games with the points I'd earn and why the game matters so that I can decide what to attend | `tabs/EventsTab.jsx`, `data/events.js` | |
| 5 | As a fan, I want a game-day notification two hours before a game so that I don't forget to go | new `components/NotificationBanner.jsx` + Home | |
| 6 | As a fan, I want a leaderboard against friends so that attending feels social | new `tabs/LeaderboardTab.jsx` + a 4th tab in `App.jsx` | |

Stories 1–4 are already partly built in the skeleton — your PR extends or hardens them (new failure cases, polish, a missing rule). Stories 5–6 are greenfield.

## Scenario ideas per story (write your own — these are prompts)

**1 — Check-in**
- Given my last check-in was softball, when I check in to lacrosse, then I earn base + bonus and the streak goes up
- Given I already checked in to this game, when I try again, then I'm told once and points don't change
- Given the game hasn't started, when I tap it, then I see when check-in opens

**2 — Tiers**
- Given I'm at 470 lifetime, when I earn 30, then I become Gold and the bar fills
- Given I redeem a reward, then my tier does **not** drop

**3 — Rewards**
- Given I have fewer points than an item costs, when I tap redeem, then I'm told how many more I need
- Given the item is sold out, then I can't redeem it

**4 — Events**
- Given a game is past, then it shows Final and can't be checked into
- Given no events match a filter, then I see an empty state, not a blank screen
