import { useState } from "react";
import { useEntries } from "./hooks/useEntries";
import { MOOD_MAP } from "./constants/moods";
import { todayKey } from "./utils/dateHelpers";
import { LogTab } from "./components/LogTab";
import { InsightsTab } from "./components/InsightsTab";
import { HistoryTab } from "./components/HistoryTab";
const TABS = [
  { id: "log", label: "Log" },
  { id: "insights", label: "Insights" },
  { id: "history", label: "History" },
];
export default function App() {
  const [tab, setTab] = useState("log");
  const { entries, addOrUpdate, remove } = useEntries();
  const todayMood = entries[todayKey()];
  return (
    <>
      <style>{`
        @import url(https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=Lora:wght@400;500&display=swap);
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F4F3EF; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F4F3EF",
        fontFamily: "Lora, Georgia, serif", display: "flex",
        justifyContent: "center", padding: "24px 16px 80px" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>
          <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 28, fontWeight: 700, color: "#2D2D3A" }}>moodful</h1>
              <p style={{ fontSize: 12, color: "#9CA3AF" }}>{Object.keys(entries).length} entries logged</p>
            </div>
            {todayMood && (() => {
              const m = MOOD_MAP[todayMood.mood];
              return (
                <div style={{ background: m.bg, border: `2px solid ${m.color}40`, borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
                  <span style={{ fontSize: 20 }}>{m.emoji}</span>
                  <p style={{ fontSize: 11, color: m.color, fontWeight: 600, marginTop: 2 }}>today</p>
                </div>
              );
            })()}
          </div>
          <div style={{ display: "flex", gap: 4, background: "#E8E7E2", borderRadius: 14, padding: 4, marginBottom: 24 }}>
            {TABS.map(({ id, label }) => {
              const active = tab === id;
              return (
                <button key={id} onClick={() => setTab(id)} style={{
                  flex: 1, padding: "9px 0", borderRadius: 10, border: "none",
                  background: active ? "#fff" : "transparent",
                  color: active ? "#2D2D3A" : "#9CA3AF",
                  fontFamily: "Fraunces, Georgia, serif", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: active ? "0 1px 6px #00000015" : "none" }}>
                  {label}
                </button>
              );
            })}
          </div>
          {tab === "log"      && <LogTab      entries={entries} addOrUpdate={addOrUpdate} />}
          {tab === "insights" && <InsightsTab entries={entries} />}
          {tab === "history"  && <HistoryTab  entries={entries} remove={remove} />}
        </div>
      </div>
    </>
  );
}
