import { GEMINI_KEY } from "../constants/moods";
export async function analyseWithGemini(allMoods, allEntries) {
  const summary = allMoods.map((mood) => {
    const entries = allEntries[mood.id] || [];
    const texts = entries.map((e) => e.text).join(" | ");
    return mood.label + ": " + entries.length + " entries. " + (texts || "No entries.");
  }).join("\n");
  const prompt = "You are a compassionate mood analyst. Journal summary:\n\n" + summary + "\n\nProvide a JSON response with keys: analysis (2-3 sentences about emotional patterns), suggestions (array of 3 short actionable strings), thought (one gentle observation). Return only valid JSON, no markdown.";
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_KEY, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  try { return JSON.parse(raw.replace(/```json|```/g,"").trim()); }
  catch { return { analysis: raw, suggestions: [], thought: "" }; }
}
