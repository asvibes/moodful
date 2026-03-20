import { useState, useEffect } from "react";
import { loadJournal, addJournalEntry, deleteJournalEntry, loadImage, loadBgColor } from "../utils/storage";
import { AuroraBackground } from "./AuroraBackground";
import { MONTHS } from "../constants/moods";
const fmtDate = (ts) => { const d = new Date(ts); return MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear(); };
const fmtTime = (ts) => new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
export function JournalPage({ mood, onBack }) {
  const [entries, setEntries] = useState(() => loadJournal(mood.id));
  const [text, setText] = useState("");
  const [image] = useState(() => loadImage(mood.id));
  const [bgColor] = useState(() => loadBgColor(mood.id));
  const [animIn, setAnimIn] = useState(false);
  useEffect(() => { setTimeout(() => setAnimIn(true), 10); }, []);
  const save = () => { if (!text.trim()) return; setEntries(addJournalEntry(mood.id, text.trim())); setText(""); };
  const remove = (id) => setEntries(deleteJournalEntry(mood.id, id));
  const goBack = () => { setAnimIn(false); setTimeout(onBack, 350); };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#0F0F13", transform: animIn ? "translateX(0)" : "translateX(100%)", transition: "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)", overflowY: "auto" }}>
      <div style={{ position: "relative", height: 260, overflow: "hidden" }}>
        {image ? <img src={image} alt={mood.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : bgColor ? <div style={{ position: "absolute", inset: 0, background: bgColor }} />
          : <AuroraBackground colors={mood.aurora} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 100%)" }} />
        <button onClick={goBack} style={{ position: "absolute", top: 20, left: 20, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "8px 18px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Fraunces, Georgia, serif" }}>Back</button>
        <div style={{ position: "absolute", bottom: 22, left: 24 }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, margin: 0, letterSpacing: 1, textTransform: "uppercase" }}>Journal</p>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 34, fontWeight: 700, color: "#fff", margin: "4px 0 0", textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>{mood.label}</h1>
        </div>
        <div style={{ position: "absolute", bottom: 26, right: 22, background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "5px 12px", color: "#fff", fontSize: 12, fontWeight: 600 }}>
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </div>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px 80px" }}>
        <div style={{ background: "#1a1a20", borderRadius: 20, padding: 20, marginBottom: 24, border: "1px solid " + mood.color + "40" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: mood.color, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 12px" }}>New Entry</p>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write freely..." rows={4}
            style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 14, border: "2px solid #2a2a30", fontFamily: "Lora, Georgia, serif", fontSize: 15, lineHeight: 1.75, color: "#e0e0e0", background: "#0F0F13", resize: "vertical", outline: "none" }}
            onFocus={(e) => (e.target.style.borderColor = mood.color)}
            onBlur={(e) => (e.target.style.borderColor = "#2a2a30")} />
          <button onClick={save} disabled={!text.trim()}
            style={{ marginTop: 12, width: "100%", padding: "12px 0", borderRadius: 12, border: "none", background: text.trim() ? mood.color : "#2a2a30", color: text.trim() ? "#fff" : "#555", fontFamily: "Fraunces, Georgia, serif", fontSize: 15, fontWeight: 700, cursor: text.trim() ? "pointer" : "not-allowed", transition: "all 0.2s", boxShadow: text.trim() ? "0 4px 16px " + mood.color + "40" : "none" }}>
            Save Entry
          </button>
        </div>
        {entries.length === 0 ? (
          <p style={{ textAlign: "center", color: "#444", padding: "40px 0", fontFamily: "Fraunces, Georgia, serif", fontSize: 16 }}>No entries yet. Write your first one!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {entries.map((entry) => (
              <div key={entry.id} style={{ background: "#1a1a20", borderRadius: 18, padding: "16px 18px", border: "1px solid #2a2a30" }}>
                <p style={{ fontFamily: "Lora, Georgia, serif", fontSize: 15, lineHeight: 1.75, color: "#d0d0d0", margin: 0, whiteSpace: "pre-wrap" }}>{entry.text}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <p style={{ fontSize: 11, color: "#555", margin: 0 }}>{fmtDate(entry.ts)} · {fmtTime(entry.ts)}</p>
                  <button onClick={() => remove(entry.id)} style={{ fontSize: 11, color: "#EF4444", background: "#2a1a1a", border: "none", padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
