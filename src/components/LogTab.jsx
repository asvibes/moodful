import { useState, useEffect, useMemo } from "react";
import { MOODS, MOOD_MAP } from "../constants/moods";
import { todayKey } from "../utils/dateHelpers";
import { calcStreak } from "../utils/analytics";
import { MoodPill } from "./MoodPill";
export function LogTab({ entries, addOrUpdate }) {
  const key = todayKey();
  const existing = entries[key];
  const [mood, setMood] = useState(existing?.mood ?? null);
  const [note, setNote] = useState(existing?.note ?? "");
  useEffect(() => {
    setMood(existing?.mood ?? null);
    setNote(existing?.note ?? "");
  }, [existing?.mood]);
  const streak = useMemo(() => calcStreak(entries), [entries]);
  const save = () => { if (!mood) return; addOrUpdate(key, mood, note); };
  const activeMood = mood ? MOOD_MAP[mood] : null;
  return (
    <div style={{ padding: "0 4px" }}>
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long" })}
        </p>
        <h2 style={{ fontSize: 26, fontFamily: "Fraunces, Georgia, serif", fontWeight: 700, color: "#2D2D3A", margin: 0 }}>
          {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}
        </h2>
        {streak > 1 && (
          <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5,
            background: "#FFF3E8", color: "#F4A261", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
            🔥 {streak}-day streak
          </div>
        )}
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 14, letterSpacing: 0.5 }}>HOW ARE YOU FEELING?</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
        {MOODS.map((m) => <MoodPill key={m.id} mood={m.id} size="lg" selected={mood === m.id} onClick={() => setMood(m.id)} />)}
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 10, letterSpacing: 0.5 }}>
        JOURNAL ENTRY <span style={{ fontWeight: 400, fontSize: 11 }}>(optional)</span>
      </p>
      <textarea value={note} onChange={(e) => setNote(e.target.value)}
        placeholder="What's on your mind today? Write freely…" rows={5}
        style={{ width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 16,
          border: "2px solid #E8E8F0", fontFamily: "Lora, Georgia, serif", fontSize: 15,
          lineHeight: 1.7, color: "#3D3D50", background: "#FAFAFA", resize: "vertical", outline: "none" }}
        onFocus={(e) => (e.target.style.borderColor = "#A8C5DA")}
        onBlur={(e)  => (e.target.style.borderColor = "#E8E8F0")} />
      <button onClick={save} disabled={!mood} style={{
        marginTop: 18, width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
        background: activeMood ? activeMood.color : "#E5E7EB",
        color: activeMood ? "#fff" : "#9CA3AF",
        fontFamily: "Fraunces, Georgia, serif", fontSize: 16, fontWeight: 700,
        cursor: mood ? "pointer" : "not-allowed", transition: "all 0.25s",
        boxShadow: activeMood ? `0 4px 20px ${activeMood.color}50` : "none" }}>
        {existing ? "✓ Update Today's Entry" : "Save Today's Mood"}
      </button>
      {existing && <p style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "#9CA3AF" }}>
        Last saved {new Date(existing.ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
      </p>}
    </div>
  );
}