import { useState } from "react";
import { useEntries } from "./hooks/useEntries";
import { MOOD_MAP } from "./constants/moods";
import { todayKey } from "./utils/dateHelpers";
import { LogTab } from "./components/LogTab";
import { InsightsTab } from "./components/InsightsTab";
import { HistoryTab } from "./components/HistoryTab";

const SunIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const BarChartIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
const BookIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;

const TABS = [
  { id: "log",      label: "Log",      Icon: SunIcon      },
  { id: "insights", label: "Insights", Icon: BarChartIcon },
  { id: "history",  label: "History",  Icon: BookIcon     },
];

export default function App() {
  const [tab, setTab] = useState("log");
  const { entries, addOrUpdate, remove } = useEntries();
  const todayMood = entries[todayKey()];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F4F3EF; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F4F3EF",
        fontFamily: "Lora, Georgia, serif", display: "flex",
        justifyContent: "center", padding: "24px 16px 80px" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 28,
                fontWeight: 700, color: "#2D2D3A", letterSpacing: -0.5 }}>
                moodful
              </h1>
              <p style={{ fontSize: 12, color: "#9CA3AF", letterSpacing: 0.5 }}>
                {Object.keys(entries).length} entries logged
              </p>
            </div>
            {todayMood && (() => {
              const m = MOOD_MAP[todayMood.mood];
              return (
                <div style={{ background: m.bg, border: `2px solid ${m.color}40`,
                  borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
                  <span style={{ fontSize: 20 }}>{m.emoji}</span>
                  <p style={{ fontSize: 11, color: m.color, fontWeight: 600, marginTop: 2 }}>today</p>
                </div>
              );
            })()}
          </div>

          <div style={{ display: "flex", gap: 4, background: "#E8E7E2",
            borderRadius: 14, padding: 4, marginBottom: 24 }}>
            {TABS.map(({ id, label, Icon }) => {
              const active = tab === id;
              return (
                <button key={id} onClick={() => setTab(id)} style={{
                  flex: 1, display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 6,
                  padding: "9px 0", borderRadius: 10, border: "none",
                  background: active ? "#fff" : "transparent",
                  color: active ? "#2D2D3A" : "#9CA3AF",
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: active ? "0 1px 6px #00000015" : "none" }}>
                  <Icon /> {label}
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