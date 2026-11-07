import { useState } from "react";
import { EVENTS, SPORT_EMOJI } from "../data/events";
import { checkInBlocker, pointsForCheckIn } from "../data/points";
import CheckInSheet from "../components/CheckInSheet";

const FILTERS = ["All", "Live", "Upcoming", "Past"];

export default function EventsTab({ fan, onCheckIn }) {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null); // event being checked into
  const [notice, setNotice] = useState(null); // { kind, text }

  const visible = EVENTS.filter((e) => filter === "All" || e.status === filter.toLowerCase());

  const tryCheckIn = (event) => {
    const blocker = checkInBlocker(event, fan.checkIns);
    if (blocker) {
      setNotice({ kind: event.status === "upcoming" ? "warn" : "err", text: blocker });
      return;
    }
    setNotice(null);
    setSelected(event);
  };

  const confirm = () => {
    const { total } = pointsForCheckIn(selected, fan.checkIns);
    onCheckIn(selected, total);
  };

  return (
    <>
      <h1>Events</h1>
      <div className="filters">
        {FILTERS.map((f) => (
          <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {notice && <div className={`notice ${notice.kind}`} style={{ marginBottom: 10 }}>{notice.text}</div>}

      {visible.length === 0 && <p className="muted">No events here yet.</p>}

      {visible.map((e) => {
        const done = fan.checkIns.some((c) => c.eventId === e.id);
        const preview = pointsForCheckIn(e, fan.checkIns);
        return (
          <div key={e.id} className="card">
            <div className="row" style={{ alignItems: "flex-start" }}>
              <div className="row" style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                <div className="event-emoji">{SPORT_EMOJI[e.sport] ?? "🏟️"}</div>
                <div className="stack">
                  <span className="event-title">{e.sport} vs {e.opponent}</span>
                  <span className="muted small">{e.date} · {e.time} · {e.venue}</span>
                  {e.storyline && <span className="small" style={{ color: "var(--orange-600)", fontWeight: 600 }}>{e.storyline}</span>}
                </div>
              </div>
              <div className="stack" style={{ alignItems: "flex-end", flexShrink: 0 }}>
                {e.status === "live" && <span className="pill live">LIVE</span>}
                {e.status === "past" && <span className="pill gray">Final</span>}
                {done && <span className="pill ok">✓ Checked in</span>}
              </div>
            </div>

            <div className="row" style={{ marginTop: 12 }}>
              <span className="small muted">
                Earn <strong style={{ color: "var(--navy)" }}>+{e.basePoints}</strong>
                {preview.multiSport && !done && e.status !== "past" && (
                  <> · <strong style={{ color: "var(--orange)" }}>2× multi-sport bonus</strong></>
                )}
              </span>
              <button
                className="btn sm"
                disabled={done}
                onClick={() => tryCheckIn(e)}
              >
                {done ? "Done" : e.status === "live" ? "Check in" : "Details"}
              </button>
            </div>
          </div>
        );
      })}

      {selected && (
        <CheckInSheet
          event={selected}
          checkIns={fan.checkIns}
          onConfirm={confirm}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
