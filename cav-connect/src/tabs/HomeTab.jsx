import { EVENTS, SPORT_EMOJI } from "../data/events";
import { tierFor, multiSportStreak } from "../data/points";

export default function HomeTab({ fan, goTo, reset }) {
  const { current, next, toNext } = tierFor(fan.lifetime);
  const pct = next ? Math.round(((fan.lifetime - current.min) / (next.min - current.min)) * 100) : 100;
  const streak = multiSportStreak(fan.checkIns);
  const upcoming = EVENTS.filter((e) => e.status !== "past" && !fan.checkIns.some((c) => c.eventId === e.id)).slice(0, 3);

  return (
    <>
      <h1>Hey, {fan.name.split(" ")[0]} 👋</h1>

      <div className="card hero">
        <div className="row">
          <div className="stack">
            <span className="muted small">Points balance</span>
            <span className="big">{fan.balance.toLocaleString()}</span>
          </div>
          <span className="pill orange">{current.name} tier</span>
        </div>
        <div className="progress"><div style={{ width: `${pct}%` }} /></div>
        <p className="muted small">
          {next ? `${toNext} pts to ${next.name}` : "Top tier reached"} · {fan.lifetime.toLocaleString()} lifetime
        </p>
      </div>

      <div className="card row">
        <div className="stack">
          <strong>Multi-sport streak</strong>
          <span className="muted small">Attend a different sport next to earn 2× points</span>
        </div>
        <span className="pill navy">🔥 {streak}</span>
      </div>

      <h2>Up next</h2>
      {upcoming.map((e) => (
        <div key={e.id} className="card row" onClick={() => goTo("events")} style={{ cursor: "pointer" }}>
          <div className="row" style={{ justifyContent: "flex-start" }}>
            <div className="event-emoji">{SPORT_EMOJI[e.sport] ?? "🏟️"}</div>
            <div className="stack">
              <span className="event-title">{e.sport} vs {e.opponent}</span>
              <span className="muted small">{e.date} · {e.time}</span>
            </div>
          </div>
          <div className="stack" style={{ alignItems: "flex-end" }}>
            <span className="pill gray">+{e.basePoints}</span>
            {e.status === "live" && <span className="pill live">LIVE</span>}
          </div>
        </div>
      ))}

      <h2>Recent activity</h2>
      <div className="card list">
        {[...fan.checkIns].reverse().slice(0, 4).map((c, i) => (
          <div key={i} className="row">
            <span>Checked in · {c.sport}</span>
            <strong style={{ color: "var(--ok)" }}>+{c.points}</strong>
          </div>
        ))}
        {[...fan.redemptions].reverse().slice(0, 2).map((r, i) => (
          <div key={`r${i}`} className="row">
            <span>Redeemed · {r.name}</span>
            <strong style={{ color: "var(--err)" }}>−{r.cost}</strong>
          </div>
        ))}
        {fan.checkIns.length === 0 && fan.redemptions.length === 0 && (
          <p className="muted small">No activity yet — check in to a game to start earning.</p>
        )}
      </div>

      <button className="btn ghost" onClick={reset}>Reset demo data</button>
    </>
  );
}
