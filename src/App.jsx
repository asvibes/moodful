import { useState } from "react";
import { useMoods } from "./hooks/useMoods";
import { MoodCard } from "./components/MoodCard";
import { AddMoodCard } from "./components/AddMoodCard";
import { JournalPage } from "./components/JournalPage";
import { InsightsPage } from "./components/InsightsPage";
import { AuroraBackground } from "./components/AuroraBackground";
import { SettingsPanel } from "./components/SettingsPanel";
const loadHomeBg = () => localStorage.getItem("homeBg") || null;
const loadHomeBgColor = () => localStorage.getItem("homeBgColor") || null;
const loadHomeBrightness = () => parseFloat(localStorage.getItem("homeBrightness") || "0.55");
const loadHomeImgPos = () => { try { return JSON.parse(localStorage.getItem("homeImgPos") || "{}"); } catch { return {}; } };
export default function App() {
  const { allMoods, addMood, deleteMood } = useMoods();
  const [activeMood, setActiveMood] = useState(null);
  const [showInsights, setShowInsights] = useState(false);
  const [homeBg, setHomeBg] = useState(loadHomeBg);
  const [homeBgColor, setHomeBgColor] = useState(loadHomeBgColor);
  const [brightness, setBrightness] = useState(loadHomeBrightness);
  const [imgPos, setImgPos] = useState(loadHomeImgPos);
  const handleBgPhoto = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => { setHomeBg(ev.target.result); setHomeBgColor(null); localStorage.setItem("homeBg", ev.target.result); localStorage.removeItem("homeBgColor"); };
    r.readAsDataURL(f);
  };
  const handleBgColor = (color) => { setHomeBgColor(color); setHomeBg(null); localStorage.setItem("homeBgColor", color); localStorage.removeItem("homeBg"); };
  const handleReset = () => { setHomeBg(null); setHomeBgColor(null); localStorage.removeItem("homeBg"); localStorage.removeItem("homeBgColor"); };
  const handleBrightness = (v) => { setBrightness(v); localStorage.setItem("homeBrightness", v); };
  // Listen for imgPos changes from SettingsPanel via localStorage
  const handleImgPosChange = () => { setImgPos(loadHomeImgPos()); };
  const imgStyle = { width:"100%", height:"100%", objectFit:imgPos.fit||"cover",objectPosition:(imgPos.x||50)+"% "+(imgPos.y||50)+"%", transition:"object-position 0.2s" };
  return (
    <>
      <style>{`
        @import url(https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=Lora:wght@400;500&display=swap);
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:#2a2a30;border-radius:4px;}
      `}</style>
      {activeMood && <JournalPage mood={activeMood} onBack={()=>setActiveMood(null)} />}
      {showInsights && <InsightsPage allMoods={allMoods} onBack={()=>setShowInsights(false)} />}
      <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",visibility:activeMood||showInsights?"hidden":"visible",visibility:activeMood||showInsights?"hidden":"visible"}}>
        {homeBg
          ? <img src={homeBg} alt="" style={imgStyle} />
          : homeBgColor
            ? <div style={{position:"absolute",inset:0,background:homeBgColor}} />
            : <AuroraBackground colors={["#3a1060","#0a2050","#103040","#3a1060"]} style={{borderRadius:0}} />}
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,"+brightness+")",transition:"background 0.3s"}} />
      </div>
      <div style={{position:"relative",zIndex:1,minHeight:"100vh",visibility:activeMood||showInsights?"hidden":"visible",fontFamily:"Lora,Georgia,serif",padding:"36px 20px 60px"}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <div style={{marginBottom:36,display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div>
              <h1 style={{fontFamily:"Fraunces,Georgia,serif",fontSize:38,fontWeight:700,color:"#fff",letterSpacing:-1,marginBottom:6}}>moodful</h1>
              <p style={{fontSize:14,color:"rgba(255,255,255,0.4)"}}>tap a mood to open your journal</p>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <SettingsPanel homeBg={homeBg} homeBgColor={homeBgColor} brightness={brightness} onBgPhoto={handleBgPhoto} onBgColor={handleBgColor} onReset={handleReset} onBrightness={handleBrightness} onImgPosChange={handleImgPosChange} />
              <button onClick={()=>setShowInsights(true)} style={{background:"linear-gradient(135deg,#54A0FF,#5F27CD)",border:"none",borderRadius:14,padding:"10px 20px",color:"#fff",fontFamily:"Fraunces,Georgia,serif",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px #54A0FF40"}}>AI Insights</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(155px, 1fr))",gap:16}}>
            {allMoods.map((mood)=><MoodCard key={mood.id} mood={mood} onClick={setActiveMood} onDelete={deleteMood} />)}
            <AddMoodCard onAdd={addMood} />
          </div>
          <p style={{textAlign:"center",marginTop:44,fontSize:12,color:"rgba(255,255,255,0.15)",letterSpacing:0.5}}>hover to customise · click to journal · delete any mood</p>
        </div>
      </div>
    </>
  );
}
