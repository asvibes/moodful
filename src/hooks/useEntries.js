import { useState } from "react";
import { loadEntries, upsertEntry, deleteEntry } from "../utils/storage";
export function useEntries() {
  const [entries, setEntries] = useState(loadEntries);
  const addOrUpdate = (dateKey, mood, note) => {
    setEntries((prev) => upsertEntry(prev, dateKey, mood, note));
  };
  const remove = (dateKey) => {
    setEntries((prev) => deleteEntry(prev, dateKey));
  };
  return { entries, addOrUpdate, remove };
}
