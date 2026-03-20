import { useState, useEffect } from "react";
import { loadJournal } from "../utils/storage";
import { analyseWithGemini } from "../utils/gemini";
export function InsightsPage({ allMoods, onBack }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animIn, setAnimIn] = useState(false);
  useEffect(() => { setTimeout(() => setAnimIn(true), 10); }, []);
  const allEntries = Object.fromEntries(allMoods.map((m) => [m.id, loadJournal(m.id)]));
  const totalEntries = allMoods.reduce((s, m) => s + (allEntries[m.id]?.length || 0), 0);
  const moodCounts = allMoods.map((m) => ({ ...m, count: allEntries[m.id]?.length || 0 })).sort((a,b)=>b.count-a.count);
  const maxCount = Math.max(...moodCounts.map((m) => m.count), 1);
  const analyse = async () => { setLoading(true); setError(null); try { setResult(await analyseWithGemini(allMoods, allEntries)); } catch { setError("Could not connect to AI. Try again."); } setLoading(false); };
  return (
    <div style={{ position:"fixed", inset:0, zIndex:999, background:"#0F0F13", transform:animIn?"translateX(0)":"translateX(100%)", transition:"transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)", overflowY:"auto" }}>
      <div style={{ maxWidth:640, margin:"0 auto", padding:"32px 20px 80px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:32 }}>
          <button onClick={()=>{setAnimIn(false);setTimeout(onBack,350);}} style={{ background:"#1a1a20", border:"1px solid #2a2a30", borderRadius:12, padding:"8px 18px", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"Fraunces, Georgia, serif" }}>Back</button>
          <div>
            <h1 style={{ fontFamily:"Fraunces, Georgia, serif", fontSize:28, fontWeight:700, color:"#fff", margin:0 }}>Insights</h1>
            <p style={{ fontSize:13, color:"#555", margin:"3px 0 0" }}>{totalEntries} total entries across all moods</p>
          </div>
        </div>
        {/* Bar chart */}
        <div style={{ background:"#1a1a20", borderRadius:20, padding:20, marginBottom:20, border:"1px solid #2a2a30" }}>
          <p style={{ fontFamily:"Fraunces, Georgia, serif", fontSize:16, fontWeight:700, color:"#fff", margin:"0 0 16px" }}>Entries per Mood</p>
          {moodCounts.map((m) => (
            <div key={m.id} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:13, color:"#d0d0d0", fontWeight:600 }}>{m.label}</span>
                <span style={{ fontSize:12, color:"#555" }}>{m.count}</span>
              </div>
              <div style={{ height:8, borderRadius:8, background:"#2a2a30" }}>
                <div style={{ height:8, borderRadius:8, background:m.color, width:(m.count/maxCount*100)+"%", transition:"width 1s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:"0 0 12px "+m.color+"60" }} />
              </div>
            </div>
          ))}
        </div>
        {/* Top moods */}
        <div style={{ background:"#1a1a20", borderRadius:20, padding:20, marginBottom:20, border:"1px solid #2a2a30" }}>
          <p style={{ fontFamily:"Fraunces, Georgia, serif", fontSize:16, fontWeight:700, color:"#fff", margin:"0 0 14px" }}>Most Journalled Moods</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {moodCounts.filter(m=>m.count>0).slice(0,3).map((m,i)=>(
              <div key={m.id} style={{ flex:1, minWidth:90, background:m.color+"20", border:"1px solid "+m.color+"40", borderRadius:14, padding:"12px 14px", textAlign:"center" }}>
                <p style={{ fontSize:18, margin:0, color:"#fff", fontWeight:700 }}>#{i+1}</p>
                <p style={{ fontFamily:"Fraunces, Georgia, serif", fontSize:14, fontWeight:700, color:m.color, margin:"4px 0 0" }}>{m.label}</p>
                <p style={{ fontSize:11, color:"#555", margin:"3px 0 0" }}>{m.count} entries</p>
              </div>
            ))}
            {moodCounts.filter(m=>m.count>0).length===0&&<p style={{ color:"#444", fontSize:14 }}>No entries yet!</p>}
          </div>
        </div>
        {/* AI */}
        <div style={{ background:"#1a1a20", borderRadius:20, padding:20, border:"1px solid #2a2a30" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <p style={{ fontFamily:"Fraunces, Georgia, serif", fontSize:16, fontWeight:700, color:"#fff", margin:0 }}>AI Analysis</p>
            <span style={{ fontSize:11, color:"#555", background:"#2a2a30", padding:"3px 8px", borderRadius:6 }}>Gemini</span>
          </div>
          {!result&&!loading&&<div style={{ textAlign:"center", padding:"16px 0" }}>
            <p style={{ color:"#555", fontSize:14, marginBottom:16 }}>{totalEntries===0?"Write some entries first!":"Analyse all your journal entries with AI."}</p>
            <button onClick={analyse} disabled={totalEntries===0} style={{ padding:"12px 28px", borderRadius:12, border:"none", background:totalEntries>0?"linear-gradient(135deg,#54A0FF,#5F27CD)":"#2a2a30", color:totalEntries>0?"#fff":"#555", fontFamily:"Fraunces, Georgia, serif", fontSize:14, fontWeight:700, cursor:totalEntries>0?"pointer":"not-allowed", boxShadow:totalEntries>0?"0 4px 20px #54A0FF40":"none" }}>Analyse My Moods</button>
          </div>}
          {loading&&<div style={{ textAlign:"center", padding:"24px 0" }}>
            <div style={{ width:36, height:36, border:"3px solid #2a2a30", borderTopColor:"#54A0FF", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 12px" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color:"#555", fontSize:14 }}>Analysing...</p>
          </div>}
          {error&&<p style={{ color:"#EF4444", fontSize:13, textAlign:"center" }}>{error}</p>}
          {result&&<div>
            <div style={{ background:"#0F0F13", borderRadius:14, padding:16, marginBottom:12, border:"1px solid #2a2a30" }}>
              <p style={{ fontSize:11, color:"#54A0FF", fontWeight:700, letterSpacing:1, textTransform:"uppercase", margin:"0 0 8px" }}>Analysis</p>
              <p style={{ fontFamily:"Lora, Georgia, serif", fontSize:14, lineHeight:1.75, color:"#d0d0d0", margin:0 }}>{result.analysis}</p>
            </div>
            {result.thought&&<div style={{ background:"#0F0F13", borderRadius:14, padding:16, marginBottom:12, border:"1px solid #2a2a30" }}>
              <p style={{ fontSize:11, color:"#FF9F43", fontWeight:700, letterSpacing:1, textTransform:"uppercase", margin:"0 0 8px" }}>Thought</p>
              <p style={{ fontFamily:"Lora, Georgia, serif", fontSize:14, lineHeight:1.75, color:"#d0d0d0", margin:0, fontStyle:"italic" }}>{result.thought}</p>
            </div>}
            {result.suggestions?.length>0&&<div style={{ background:"#0F0F13", borderRadius:14, padding:16, border:"1px solid #2a2a30" }}>
              <p style={{ fontSize:11, color:"#52B788", fontWeight:700, letterSpacing:1, textTransform:"uppercase", margin:"0 0 12px" }}>Suggestions</p>
              {result.suggestions.map((s,i)=>(
                <div key={i} style={{ display:"flex", gap:12, marginBottom:10 }}>
                  <div style={{ width:24, height:24, borderRadius:"50%", background:"#52B78830", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#52B788", fontWeight:700, flexShrink:0 }}>{i+1}</div>
                  <p style={{ fontFamily:"Lora, Georgia, serif", fontSize:14, lineHeight:1.65, color:"#d0d0d0", margin:0 }}>{s}</p>
                </div>
              ))}
            </div>}
            <button onClick={analyse} style={{ marginTop:14, width:"100%", padding:"10px 0", borderRadius:10, border:"1px solid #2a2a30", background:"transparent", color:"#555", fontSize:12, cursor:"pointer" }}>Refresh</button>
          </div>}
        </div>
      </div>
    </div>
  );
}
