import { useState } from "react";
import { DEFAULT_MOODS } from "../constants/moods";
import { loadCustomMoods, saveCustomMoods, removeImage } from "../utils/storage";
export function useMoods() {
  const [customMoods, setCustomMoods] = useState(loadCustomMoods);
  const allMoods = [...DEFAULT_MOODS, ...customMoods];
  const addMood = (label, color, id) => {
    const moodId = id || ("custom_" + Date.now());
    const newMood = { id: moodId, label, color, aurora: [color, color+"99", color+"cc", color], isCustom: true };
    const updated = [...customMoods, newMood];
    setCustomMoods(updated); saveCustomMoods(updated);
  };
  const deleteMood = (id) => { removeImage(id); const u = customMoods.filter((m) => m.id !== id); setCustomMoods(u); saveCustomMoods(u); };
  return { allMoods, addMood, deleteMood };
}
