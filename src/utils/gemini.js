import { GEMINI_KEY } from "../constants/moods";
export async function analyseWithGemini(allMoods, allEntries) {
  const summary = allMoods.map((mood) => {
    const entries = allEntries[mood.id] || [];
    const texts = entries.map((e) => e.text).join(" | ");
    return mood.label + ": " + entries.length + " entries. " + (texts || "No entries yet.");
  }).join("\n");
  const prompt = `You are a compassionate mood journal analyst. Here is a summary of the users mood journal entries:\n\n${summary}\n\nPlease provide:\n1. A warm, empathetic ANALYSIS of their overall emotional patterns (2-3 sentences)\n2. Three specific SUGGESTIONS to improve their wellbeing based on these entries\n3. A THOUGHT or gentle observation about their emotional journey\n\nFormat your response as JSON with keys: analysis, suggestions (array of 3 strings), thought`;
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { analysis: raw, suggestions: [], thought: "" };
  }
}
