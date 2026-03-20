import { useState } from "react";
import { useMoods } from "./hooks/useMoods";
import { MoodCard } from "./components/MoodCard";
import { AddMoodCard } from "./components/AddMoodCard";
import { JournalPage } from "./components/JournalPage";
export default function App() {
  const { allMoods, addMood, deleteMood } = useMoods();
  const [activeMood, setActiveMood] = useState(null);
  return (
    <>
      <style>{`
        @import url(https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=Lora:wght@400;500&display=swap);
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0F0F13; min-height: 100vh; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a30; border-radius: 4px; }
      `}</style>
      {activeMood && <JournalPage mood={activeMood} onBack={() => setActiveMood(null)} />}
      <div style={{ minHeight: "100vh", background: "#0F0F13", fontFamily: "Lora, Georgia, serif", padding: "36px 20px 60px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 38, fontWeight: 700, color: "#fff", letterSpacing: -1, marginBottom: 6 }}>moodful</h1>
            <p style={{ fontSize: 14, color: "#555", letterSpacing: 0.3 }}>tap a mood to open your journal</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 16 }}>
            {allMoods.map((mood) => (
              <MoodCard key={mood.id} mood={mood} onClick={setActiveMood} onDelete={mood.isCustom ? deleteMood : null} />
            ))}
            <AddMoodCard onAdd={addMood} />
          </div>
          <p style={{ textAlign: "center", marginTop: 44, fontSize: 12, color: "#333", letterSpacing: 0.5 }}>
            hover a card to upload photo · click to open journal
          </p>
        </div>
      </div>
    </>
  );
}
