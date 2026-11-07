import { useEffect, useState } from "react";

// All fan state lives here and persists to localStorage so a refresh
// doesn't wipe points. "Reset demo" on the Home tab clears it.

const KEY = "cavconnect.fan.v1";

const INITIAL = {
  name: "Wahoo Fan",
  balance: 320, // spendable points
  lifetime: 320, // never decreases; drives tier
  checkIns: [
    // { eventId, sport, points, at }
    { eventId: "sb-lib", sport: "Softball", points: 75, at: "Wed, Nov 4" },
  ],
  redemptions: [], // { rewardId, name, cost, at }
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...INITIAL, ...JSON.parse(raw) } : INITIAL;
  } catch {
    return INITIAL;
  }
}

export function useFanState() {
  const [fan, setFan] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(fan));
    } catch {
      /* storage unavailable — keep in memory only */
    }
  }, [fan]);

  const addCheckIn = (event, points) =>
    setFan((f) => ({
      ...f,
      balance: f.balance + points,
      lifetime: f.lifetime + points,
      checkIns: [
        ...f.checkIns,
        { eventId: event.id, sport: event.sport, points, at: `${event.date} ${event.time}` },
      ],
    }));

  const redeem = (reward) =>
    setFan((f) => ({
      ...f,
      balance: f.balance - reward.cost,
      redemptions: [
        ...f.redemptions,
        { rewardId: reward.id, name: reward.name, cost: reward.cost, at: new Date().toLocaleString() },
      ],
    }));

  const reset = () => setFan(INITIAL);

  return { fan, addCheckIn, redeem, reset };
}
