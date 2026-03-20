export const MOODS = [
  { id: 5, label: "Radiant", emoji: "star", color: "#F4A261", bg: "#FFF3E8" },
  { id: 4, label: "Good", emoji: "leaf", color: "#52B788", bg: "#E8F5EE" },
  { id: 3, label: "Okay", emoji: "cloud", color: "#90A4BE", bg: "#EBF0F6" },
  { id: 2, label: "Low", emoji: "rain", color: "#B07BAC", bg: "#F3EDF5" },
  { id: 1, label: "Rough", emoji: "moon", color: "#6B6B8A", bg: "#EDEDF3" },
];
export const MOOD_MAP = Object.fromEntries(MOODS.map((m) => [m.id, m]));
export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
