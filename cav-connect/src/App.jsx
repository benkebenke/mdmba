import { useState } from "react";
import { useFanState } from "./useFanState";
import HomeTab from "./tabs/HomeTab";
import EventsTab from "./tabs/EventsTab";
import RewardsTab from "./tabs/RewardsTab";

const TABS = [
  { id: "home", label: "Home", ico: "🏠" },
  { id: "events", label: "Events", ico: "📅" },
  { id: "rewards", label: "Rewards", ico: "🎁" },
];

export default function App() {
  const [tab, setTab] = useState("home");
  const { fan, addCheckIn, redeem, reset } = useFanState();

  return (
    <div className="phone">
      <header className="topbar">
        <div className="brand">
          <span className="v">V</span> Cav Connect
        </div>
        <div className="pts">{fan.balance.toLocaleString()} pts</div>
      </header>

      <main className="screen">
        {tab === "home" && <HomeTab fan={fan} goTo={setTab} reset={reset} />}
        {tab === "events" && <EventsTab fan={fan} onCheckIn={addCheckIn} />}
        {tab === "rewards" && <RewardsTab fan={fan} onRedeem={redeem} />}
      </main>

      <nav className="tabbar">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>
            <span className="ico">{t.ico}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
