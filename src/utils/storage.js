const KEY = "moodEntries";
export const loadEntries = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
  catch { return {}; }
};
export const saveEntries = (entries) =>
  localStorage.setItem(KEY, JSON.stringify(entries));
export const upsertEntry = (entries, dateKey, mood, note) => {
  const updated = { ...entries, [dateKey]: { mood, note, ts: new Date().toISOString() } };
  saveEntries(updated);
  return updated;
};
export const deleteEntry = (entries, dateKey) => {
  const updated = { ...entries };
  delete updated[dateKey];
  saveEntries(updated);
  return updated;
};