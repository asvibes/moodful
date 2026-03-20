import { useState } from "react";
import { DEFAULT_MOODS } from "../constants/moods";
import { loadCustomMoods, saveCustomMoods } from "../utils/storage";
export function useMoods() {
  const [customMoods, setCustomMoods] = useState(loadCustomMoods);
  const allMoods = [...DEFAULT_MOODS, ...customMoods];
  const addMood = (label, color, id) => {
    const moodId = id || ("custom_" + Date.now());
    const newMood = { id: moodId, label, color, bg: "linear-gradient(135deg," + color + "," + color + "cc)", isCustom: true };
    const updated = [...customMoods, newMood];
    setCustomMoods(updated); saveCustomMoods(updated);
  };
  const deleteMood = (id) => { const u = customMoods.filter((m) => m.id !== id); setCustomMoods(u); saveCustomMoods(u); };
  return { allMoods, addMood, deleteMood };
}
