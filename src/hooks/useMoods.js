import { useState } from "react";
import { DEFAULT_MOODS } from "../constants/moods";
import { loadCustomMoods, saveCustomMoods, removeImage } from "../utils/storage";
function makeAurora(color) {
  const hex = color.replace("#","");
  const r = parseInt(hex.slice(0,2),16);
  const g = parseInt(hex.slice(2,4),16);
  const b = parseInt(hex.slice(4,6),16);
  const c2 = "#"+Math.max(0,r-60).toString(16).padStart(2,"0")+Math.max(0,g-40).toString(16).padStart(2,"0")+Math.min(255,b+40).toString(16).padStart(2,"0");
  const c3 = "#"+Math.min(255,r+40).toString(16).padStart(2,"0")+Math.max(0,g-20).toString(16).padStart(2,"0")+Math.max(0,b-60).toString(16).padStart(2,"0");
  const c4 = "#"+Math.max(0,r-30).toString(16).padStart(2,"0")+Math.min(255,g+50).toString(16).padStart(2,"0")+Math.max(0,b-30).toString(16).padStart(2,"0");
  return [color, c2, c3, c4];
}
export function useMoods() {
  const [customMoods, setCustomMoods] = useState(() =>
    loadCustomMoods().map(m => ({ ...m, aurora: m.aurora?.length === 4 && m.aurora[1] !== m.aurora[0]+"99" ? m.aurora : makeAurora(m.color) }))
  );
  const allMoods = [...DEFAULT_MOODS, ...customMoods];
  const addMood = (label, color, id) => {
    const moodId = id || ("custom_" + Date.now());
    const newMood = { id: moodId, label, color, aurora: makeAurora(color), isCustom: true };
    const updated = [...customMoods, newMood];
    setCustomMoods(updated); saveCustomMoods(updated);
  };
  const deleteMood = (id) => {
    removeImage(id);
    const u = customMoods.filter((m) => m.id !== id);
    setCustomMoods(u); saveCustomMoods(u);
  };
  return { allMoods, addMood, deleteMood };
}
