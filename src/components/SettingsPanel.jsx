import { useState } from "react";
const BRIGHT_KEY = "homeBrightness";
export function SettingsPanel({ homeBg, homeBgColor, onBgPhoto, onBgColor, onReset }) {
  const [open, setOpen] = useState(false);
  const [brightness, setBrightness] = useState(() => parseFloat(localStorage.getItem(BRIGHT_KEY) || "0.55"));
  const setBright = (v) => { setBrightness(v); localStorage.setItem(BRIGHT_KEY, v); };
  return (
    <>
      <button onClick={() => setOpen(!open)}
        style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"10px 16px", color:"#fff", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"Fraunces, Georgia, serif", fontWeight:600 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
        Settings
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position:"fixed", inset:0, zIndex:200 }} />
          <div style={{ position:"fixed", top:70, right:20, zIndex:201, background:"rgba(10,10,16,0.95)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:20, width:280, boxShadow:"0 20px 60px rgba(0,0,0,0.6)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <p style={{ fontFamily:"Fraunces, Georgia, serif", fontSize:15, fontWeight:700, color:"#fff", margin:0 }}>Home Settings</p>
              <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:18 }}>x</button>
            </div>
            {/* Current bg */}
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"8px 12px", marginBottom:14, fontSize:12, color:"#666" }}>
              Current: {homeBg ? "Custom Photo" : homeBgColor ? "Solid Color" : "Aurora (default)"}
            </div>
            {/* Background options */}
            <p style={{ fontSize:11, color:"#888", margin:"0 0 8px", letterSpacing:1, textTransform:"uppercase" }}>Background</p>
            <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16 }}>
              <label style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 12px", cursor:"pointer", color:"#fff", fontSize:13, display:"flex", alignItems:"center", gap:8 }}
                onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.12)"}
                onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}>
                <span>🖼️</span>
                <div><p style={{ margin:0, fontWeight:600, fontSize:13 }}>Upload Photo</p><p style={{ margin:0, fontSize:11, color:"#555" }}>Set a background image</p></div>
                <input type="file" accept="image/*" onChange={(e)=>{ onBgPhoto(e); setOpen(false); }} style={{ display:"none" }} />
              </label>
              <label style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 12px", cursor:"pointer", color:"#fff", fontSize:13, display:"flex", alignItems:"center", gap:8, position:"relative" }}
                onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.12)"}
                onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}>
                <span>🎨</span>
                <div><p style={{ margin:0, fontWeight:600, fontSize:13 }}>Solid Color</p><p style={{ margin:0, fontSize:11, color:"#555" }}>Pick a background color</p></div>
                <input type="color" onChange={(e)=>{ onBgColor(e.target.value); setOpen(false); }} style={{ position:"absolute", opacity:0, inset:0, width:"100%", height:"100%", cursor:"pointer" }} />
              </label>
              <button onClick={()=>{ onReset(); setOpen(false); }}
                style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 12px", cursor:"pointer", color:"#fff", fontSize:13, display:"flex", alignItems:"center", gap:8, width:"100%" }}
                onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.12)"}
                onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}>
                <span>🌌</span>
                <div style={{ textAlign:"left" }}><p style={{ margin:0, fontWeight:600, fontSize:13 }}>Aurora (Default)</p><p style={{ margin:0, fontSize:11, color:"#555" }}>Animated gradient</p></div>
              </button>
            </div>
            {/* Brightness slider */}
            <p style={{ fontSize:11, color:"#888", margin:"0 0 8px", letterSpacing:1, textTransform:"uppercase" }}>Overlay Darkness</p>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <span style={{ fontSize:16 }}>☀️</span>
              <input type="range" min="0" max="0.85" step="0.05" value={brightness}
                onChange={(e) => setBright(parseFloat(e.target.value))}
                style={{ flex:1, accentColor:"#54A0FF", cursor:"pointer" }} />
              <span style={{ fontSize:16 }}>🌑</span>
            </div>
            <p style={{ fontSize:11, color:"#555", textAlign:"center", margin:0 }}>{Math.round((1-brightness)*100)}% brightness</p>
          </div>
        </>
      )}
    </>
  );
}
