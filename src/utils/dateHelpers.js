import { MONTHS } from "../constants/moods";
export const fmtDate = (ts) => { const d = new Date(ts); return MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear(); };
export const fmtTime = (ts) => new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
