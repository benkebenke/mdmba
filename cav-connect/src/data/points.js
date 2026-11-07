// Points and tier rules. Pure functions so they are easy to test by hand
// against Given-When-Then scenarios.

export const TIERS = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 250 },
  { name: "Gold", min: 500 },
  { name: "Platinum", min: 1000 },
];

export function tierFor(lifetimePoints) {
  let current = TIERS[0];
  for (const t of TIERS) if (lifetimePoints >= t.min) current = t;
  const idx = TIERS.indexOf(current);
  const next = TIERS[idx + 1] ?? null;
  return { current, next, toNext: next ? next.min - lifetimePoints : 0 };
}

// Multi-sport stacking: if the fan's most recent check-in was a *different*
// sport, the bonus doubles the base points (slide 10: 75 base + 75 bonus).
export function pointsForCheckIn(event, checkIns) {
  const last = checkIns[checkIns.length - 1];
  const multiSport = Boolean(last && last.sport !== event.sport);
  const bonus = multiSport ? event.basePoints : 0;
  return { base: event.basePoints, bonus, total: event.basePoints + bonus, multiSport };
}

// Returns null if the fan may check in, otherwise a user-facing reason.
export function checkInBlocker(event, checkIns) {
  if (!event) return "We couldn't find that event.";
  if (checkIns.some((c) => c.eventId === event.id))
    return "You've already checked in to this game — points were awarded once.";
  if (event.status === "upcoming")
    return `Check-in opens when the gates do (${event.date}, ${event.time}).`;
  if (event.status === "past") return "This game has ended. Check-in is closed.";
  return null;
}

// Returns null if the fan may redeem, otherwise a user-facing reason.
export function redeemBlocker(reward, balance) {
  if (!reward) return "That reward is no longer available.";
  if (reward.stock <= 0) return "Sold out — check back when it restocks.";
  if (balance < reward.cost)
    return `You need ${reward.cost - balance} more points for this reward.`;
  return null;
}

// Streak = number of consecutive check-ins across different sports,
// counted back from the most recent one.
export function multiSportStreak(checkIns) {
  let streak = 0;
  const seen = new Set();
  for (let i = checkIns.length - 1; i >= 0; i--) {
    if (seen.has(checkIns[i].sport)) break;
    seen.add(checkIns[i].sport);
    streak++;
  }
  return streak;
}
