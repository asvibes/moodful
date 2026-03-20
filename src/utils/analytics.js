import { MOODS } from "../constants/moods";
export const avgMood = (entries, keys) => {
  const vals = keys.map((k) => entries[k]?.mood).filter(Boolean);
  return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
};
export const moodLabel = (avg) => {
  if (!avg) return "—";
  const n = parseFloat(avg);
  if (n >= 4.5) return "Radiant";
  if (n >= 3.5) return "Good";
  if (n >= 2.5) return "Okay";
  if (n >= 1.5) return "Low";
  return "Rough";
};
export const calcStreak = (entries) => {
  let streak = 0;
  const d = new Date();
  while (true) {
    const k = d.toISOString().slice(0, 10);
    if (!entries[k]) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
};
export const moodDistribution = (entries, keys) =>
  MOODS.map((m) => ({ ...m, count: keys.filter((k) => entries[k]?.mood === m.id).length }))
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count);
