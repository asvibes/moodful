import { MOOD_MAP } from "../constants/moods";
import { todayKey } from "../utils/dateHelpers";
export function MoodBarChart({ entries, keys }) {
  const W = 480, H = 120;
  const pad = { l: 8, r: 8, t: 10, b: 28 };
  const barW = Math.max(4, (W - pad.l - pad.r) / keys.length - 3);
  const gap  = (W - pad.l - pad.r - barW * keys.length) / Math.max(keys.length - 1, 1);
  const today = todayKey();
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 280 }}>
        {keys.map((key, i) => {
          const entry  = entries[key];
          const mood   = MOOD_MAP[entry?.mood];
          const barH   = entry?.mood ? (entry.mood / 5) * (H - pad.t - pad.b) : 2;
          const x      = pad.l + i * (barW + gap);
          const y      = H - pad.b - barH;
          const isToday = key === today;
          return (
            <g key={key}>
              <rect x={x} y={y} width={barW} height={barH} rx={barW / 2}
                fill={mood ? mood.color : "#e5e7eb"} opacity={isToday ? 1 : 0.75} />
              {isToday && <rect x={x} y={H - pad.b + 6} width={barW} height={3} rx={1.5} fill={mood?.color ?? "#e5e7eb"} />}
              {keys.length <= 10 && (
                <text x={x + barW / 2} y={H - 4} textAnchor="middle" fontSize={9} fill="#9CA3AF">
                  {key.slice(8)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}