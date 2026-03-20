import { MOOD_MAP } from "../constants/moods";
const SIZES = {
  sm: { padding: "5px 12px",  emoji: 16, font: 11 },
  md: { padding: "8px 18px",  emoji: 20, font: 13 },
  lg: { padding: "12px 22px", emoji: 28, font: 15 },
};
export function MoodPill({ mood, size = "md", selected = false, onClick }) {
  const m  = MOOD_MAP[mood];
  const sz = SIZES[size] ?? SIZES.md;
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      padding: sz.padding, borderRadius: 40,
      background: selected ? m.color : m.bg,
      color: selected ? "#fff" : m.color,
      border: `2px solid ${selected ? m.color : "transparent"}`,
      fontFamily: "Fraunces, Georgia, serif",
      fontSize: sz.font, fontWeight: 600,
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.2s", outline: "none",
      boxShadow: selected ? `0 0 0 4px ${m.color}30` : "none",
    }}>
      <span style={{ fontSize: sz.emoji, lineHeight: 1 }}>{m.emoji}</span>
      {m.label}
    </button>
  );
}