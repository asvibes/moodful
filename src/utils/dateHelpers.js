import { MONTHS } from "../constants/moods";
export const fmtDate = (ts) => { const d = new Date(ts); return MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear(); };
