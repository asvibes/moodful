import { MONTHS } from "../constants/moods";
export const todayKey = () => new Date().toISOString().slice(0, 10);
export const fmtDate = (key) => {
  const [y, m, d] = key.split("-");
  return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
};
export const getLastNKeys = (n) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
export const getLast7Keys  = () => getLastNKeys(7);
export const getLast30Keys = () => getLastNKeys(30);
