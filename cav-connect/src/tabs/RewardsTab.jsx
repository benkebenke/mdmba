import { useState } from "react";
import { REWARDS, remainingStock } from "../data/rewards";
import { redeemBlocker } from "../data/points";

const CATS = ["All", "Merchandise", "Dining", "Experiences"];

export default function RewardsTab({ fan, onRedeem }) {
  const [cat, setCat] = useState("All");
  const [confirming, setConfirming] = useState(null); // reward awaiting confirmation
  const [notice, setNotice] = useState(null);

  // Catalog with live stock: starting stock minus what's been redeemed.
  const catalog = REWARDS.map((r) => ({ ...r, stock: remainingStock(r, fan.redemptions) }));
  const visible = catalog.filter((r) => cat === "All" || r.category === cat);

  const tryRedeem = (reward) => {
    const blocker = redeemBlocker(reward, fan.balance);
    if (blocker) {
      setNotice({ kind: "err", text: blocker });
      return;
    }
    setNotice(null);
    setConfirming(reward);
  };

  const confirm = () => {
    // Re-check at confirm time against current balance and current stock —
    // both may have changed since the sheet opened.
    const live = catalog.find((r) => r.id === confirming.id);
    const blocker = redeemBlocker(live, fan.balance);
    if (blocker) {
      setNotice({ kind: "err", text: blocker });
      setConfirming(null);
      return;
    }
    onRedeem(live);
    const left = live.stock - 1;
    const stockNote = left === 0 ? " That was the last one." : left < 10 ? ` Only ${left} left.` : "";
    setNotice({ kind: "ok", text: `Redeemed ${live.name}. ${fan.balance - live.cost} pts left.${stockNote}` });
    setConfirming(null);
  };

  return (
    <>
      <h1>Rewards</h1>
      <div className="card row" style={{ background: "var(--navy)", color: "white" }}>
        <span>Available to spend</span>
        <strong style={{ fontSize: 20 }}>{fan.balance.toLocaleString()} pts</strong>
      </div>

      <div className="filters">
        {CATS.map((c) => (
          <button key={c} className={cat === c ? "active" : ""} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {notice && <div className={`notice ${notice.kind}`} style={{ marginBottom: 10 }}>{notice.text}</div>}

      <div className="grid2">
        {visible.map((r) => {
          const soldOut = r.stock <= 0;
          const short = fan.balance < r.cost;
          return (
            <div key={r.id} className={`card reward ${soldOut ? "soldout" : ""}`}>
              <span className="emoji">{r.emoji}</span>
              <strong style={{ fontSize: 14, lineHeight: 1.2 }}>{r.name}</strong>
              <span className="muted small">{r.partner}</span>
              <span className="muted small" style={{ minHeight: 30 }}>{r.description}</span>
              <div className="row" style={{ marginTop: "auto" }}>
                <span className="cost">{r.cost} pts</span>
                {soldOut ? (
                  <span className="pill gray">Sold out</span>
                ) : r.stock < 10 ? (
                  <span className="pill orange">{r.stock} left</span>
                ) : null}
              </div>
              <button className={`btn sm ${short ? "secondary" : ""}`} style={{ width: "100%" }} onClick={() => tryRedeem(r)}>
                {soldOut ? "Unavailable" : short ? `Need ${r.cost - fan.balance} more` : "Redeem"}
              </button>
            </div>
          );
        })}
      </div>

      {fan.redemptions.length > 0 && (
        <>
          <h2>Your redemptions</h2>
          <div className="card list">
            {[...fan.redemptions].reverse().map((x, i) => (
              <div key={i} className="row">
                <span>{x.name}</span>
                <span className="muted small">{x.at}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {confirming && (
        <div className="overlay" onClick={() => setConfirming(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <strong>Redeem {confirming.name}?</strong>
            <p className="muted small" style={{ margin: "6px 0 14px" }}>
              {confirming.cost} pts will be deducted. You'll have {fan.balance - confirming.cost} pts left.
            </p>
            <button className="btn" onClick={confirm}>Confirm redemption</button>
            <button className="btn ghost" onClick={() => setConfirming(null)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
