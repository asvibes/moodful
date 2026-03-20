import { useState, useMemo } from "react";
import { MOOD_MAP } from "../constants/moods";
import { fmtDate } from "../utils/dateHelpers";
export function HistoryTab({ entries, remove }) {
  const [search, setSearch]     = useState("");
  const [expanded, setExpanded] = useState(null);
  const sorted = useMemo(() => {
    const q = search.toLowerCase();
    return Object.entries(entries)
      .filter(([key, e]) => !q || key.includes(q) || (e.note ?? "").toLowerCase().includes(q) || (MOOD_MAP[e.mood]?.label ?? "").toLowerCase().includes(q))
      .sort(([a], [b]) => b.localeCompare(a));
  }, [entries, search]);
  return (
    <div>
      <div style={{ position: "relative", marginBottom: 20 }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search entries, moods, notes…"
          style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px",
            borderRadius: 12, border: "2px solid #E8E8F0", fontSize: 14,
            fontFamily: "Lora, Georgia, serif", color: "#3D3D50", background: "#FAFAFA", outline: "none" }}
          onFocus={(e) => (e.target.style.borderColor = "#A8C5DA")}
          onBlur={(e)  => (e.target.style.borderColor = "#E8E8F0")} />
      </div>
      {sorted.length === 0 ? (
        <p style={{ textAlign: "center", color: "#C0C0D0", padding: "40px 0",
          fontFamily: "Fraunces, Georgia, serif", fontSize: 16 }}>
          {search ? "No entries match your search." : "No entries yet. Start logging!"}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.map(([key, entry]) => {
            const m = MOOD_MAP[entry.mood];
            const isOpen = expanded === key;
            return (
              <div key={key} style={{ borderRadius: 14, border: `2px solid ${isOpen ? m.color+"60" : "#E8E8F0"}`,
                background: isOpen ? m.bg : "#fff", overflow: "hidden" }}>
                <div onClick={() => setExpanded(isOpen ? null : key)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", cursor: "pointer" }}>
                  <span style={{ fontSize: 22 }}>{m.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#3D3D50" }}>{fmtDate(key)}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: m.color, fontWeight: 600 }}>{m.label}</p>
                  </div>
                </div>
                {isOpen && (
                  <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${m.color}30` }}>
                    {entry.note
                      ? <p style={{ fontFamily: "Lora, Georgia, serif", fontSize: 14, lineHeight: 1.7, color: "#4D4D60", margin: "12px 0 0", whiteSpace: "pre-wrap" }}>{entry.note}</p>
                      : <p style={{ fontSize: 13, color: "#C0C0D0", fontStyle: "italic", marginTop: 10 }}>No journal note.</p>}
                    <button onClick={() => { remove(key); setExpanded(null); }}
                      style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 5,
                        fontSize: 12, color: "#EF4444", background: "#FEF2F2", border: "none",
                        padding: "5px 12px", borderRadius: 8, cursor: "pointer" }}>
                      🗑 Delete entry
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}