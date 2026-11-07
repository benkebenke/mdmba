import { useMemo, useState } from "react";
import { pointsForCheckIn, multiSportStreak } from "../data/points";

// Two-step bottom sheet: show a gate-scannable QR, then confirm points.
// In the real product the gate scanner would call back; here the fan taps
// "Simulate gate scan" to stand in for it.

function FakeQR({ seed }) {
  // Deterministic pseudo-random pattern per event id so each QR looks different.
  const cells = useMemo(() => {
    let h = 0;
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const out = [];
    for (let i = 0; i < 21 * 21; i++) {
      h = (h * 1103515245 + 12345) >>> 0;
      const r = Math.floor(i / 21), c = i % 21;
      const finder = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);
      const ring = finder && ((r % 7 === 0 || r % 7 === 6) || (c % 7 === 0 || c % 7 === 6) || (r % 7 >= 2 && r % 7 <= 4 && c % 7 >= 2 && c % 7 <= 4));
      out.push(finder ? ring : (h >>> 16) % 3 === 0);
    }
    return out;
  }, [seed]);
  return (
    <div className="qr" aria-label="Check-in QR code">
      {cells.map((on, i) => <i key={i} className={on ? "on" : ""} />)}
    </div>
  );
}

export default function CheckInSheet({ event, checkIns, onConfirm, onClose }) {
  const [step, setStep] = useState("qr"); // qr | done

  // Freeze the calculation at the moment the sheet opens. After the scan the
  // parent's `checkIns` already includes this game, so recomputing from the
  // live prop would compare the game against itself and drop the bonus.
  const [calc] = useState(() => ({
    ...pointsForCheckIn(event, checkIns),
    streakAfter: multiSportStreak([...checkIns, { sport: event.sport }]),
  }));
  const { base, bonus, total, multiSport, streakAfter } = calc;

  const scan = () => {
    onConfirm();
    setStep("done");
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        {step === "qr" && (
          <>
            <div className="row">
              <strong>Scan at the gate</strong>
              <button className="btn ghost sm" onClick={onClose}>✕</button>
            </div>
            <p className="muted small">{event.sport} vs {event.opponent} · {event.venue}</p>
            <FakeQR seed={event.id} />
            <div className="breakdown">
              <span>+{base} base</span>
              {multiSport ? <span style={{ color: "var(--orange)", fontWeight: 700 }}>+{bonus} multi-sport</span> : <span>no bonus yet</span>}
            </div>
            <p className="muted small" style={{ textAlign: "center", margin: "8px 0 14px" }}>
              Streak after this game: 🔥 {streakAfter}
            </p>
            <button className="btn" onClick={scan}>Simulate gate scan</button>
          </>
        )}

        {step === "done" && (
          <>
            <p className="pill ok" style={{ margin: "0 auto", display: "block", width: "fit-content" }}>Checked in ✓</p>
            <div className="points-pop">+{total}</div>
            <div className="breakdown">
              <span>{base} base</span>
              <span>{bonus} bonus</span>
            </div>
            <p style={{ textAlign: "center", margin: "14px 0" }}>
              Enjoy the game — {event.sport} vs {event.opponent}.
            </p>
            <button className="btn" onClick={onClose}>Back to events</button>
          </>
        )}
      </div>
    </div>
  );
}
