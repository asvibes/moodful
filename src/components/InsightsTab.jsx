import { getLast7Keys, getLast30Keys } from "../utils/dateHelpers";
import { avgMood, moodLabel, moodDistribution } from "../utils/analytics";
import { MoodBarChart } from "./MoodBarChart";
import { StatCard } from "./StatCard";
const card = { background: "#fff", borderRadius: 18, padding: "18px 16px", border: "2px solid #EDEDF5", marginBottom: 16 };
const cardTitle = { fontFamily: "Fraunces, Georgia, serif", fontSize: 16, fontWeight: 700, color: "#2D2D3A", marginTop: 0, marginBottom: 14 };
export function InsightsTab({ entries }) {
  const last7 = getLast7Keys();
  const last30 = getLast30Keys();
  const avg7 = avgMood(entries, last7);
  const avg30 = avgMood(entries, last30);
  const dist = moodDistribution(entries, last30);
  const bestMood = dist[0];
  return (
    <div>
      <div style={card}>
        <h3 style={cardTitle}>Past 7 Days</h3>
        <MoodBarChart entries={entries} keys={last7} />
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <StatCard label="Avg Mood" value={avg7 ? `${avg7} - ${moodLabel(avg7)}` : "No data"} />
          <StatCard label="Logged" value={`${last7.filter(k => entries[k]).length}/7 days`} />
        </div>
      </div>
      <div style={card}>
        <h3 style={cardTitle}>Past 30 Days</h3>
        <MoodBarChart entries={entries} keys={last30} />
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <StatCard label="Avg Mood" value={avg30 ? `${avg30} - ${moodLabel(avg30)}` : "No data"} />
          <StatCard label="Logged" value={`${last30.filter(k => entries[k]).length}/30 days`} />
        </div>
      </div>
      {dist.length > 0 && (
        <div style={card}>
          <h3 style={cardTitle}>Mood Distribution (30 days)</h3>
          {dist.map((m) => (
            <div key={m.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: m.color }}>{m.label}</span>
                <span style={{ fontSize: 13, color: "#9CA3AF" }}>{m.count} days</span>
              </div>
              <div style={{ height: 6, borderRadius: 6, background: "#F0F0F5" }}>
                <div style={{ height: 6, borderRadius: 6, background: m.color, width: `${(m.count/30)*100}%` }} />
              </div>
            </div>
          ))}
          {bestMood && <p style={{ marginTop: 14, fontSize: 13, color: "#6B7280", fontStyle: "italic" }}>
            Most frequent: {bestMood.label} ({bestMood.count} days)
          </p>}
        </div>
      )}
    </div>
  );
}
