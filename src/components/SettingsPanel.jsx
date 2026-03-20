import { useState } from "react";
export function SettingsPanel({ homeBg, homeBgColor, onBgPhoto, onBgColor, onReset }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Settings button */}
      <button onClick={() => setOpen(!open)}
        style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"10px 16px", color:"#fff", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"Fraunces, Georgia, serif", fontWeight:600 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
        Settings
      </button>
      {/* Panel */}
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position:"fixed", inset:0, zIndex:200 }} />
          <div style={{ position:"fixed", top:80, right:20, zIndex:201, background:"rgba(15,15,20,0.95)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:20, width:260, boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <p style={{ fontFamily:"Fraunces, Georgia, serif", fontSize:16, fontWeight:700, color:"#fff", margin:0 }}>Background</p>
              <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:18, lineHeight:1 }}>x</button>
            </div>
            {/* Current bg indicator */}
            <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:12, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#888" }}>
              Current: {homeBg ? "Custom Photo" : homeBgColor ? "Solid Color" : "Aurora (default)"}
            </div>
            {/* Options */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <label style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"12px 14px", cursor:"pointer", color:"#fff", fontSize:13, display:"flex", alignItems:"center", gap:10, transition:"background 0.2s" }}
                onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.12)"}
                onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}>
                <span style={{ fontSize:18 }}>🖼️</span>
                <div>
                  <p style={{ margin:0, fontWeight:600, fontSize:13 }}>Upload Photo</p>
                  <p style={{ margin:0, fontSize:11, color:"#555" }}>Set a custom background image</p>
                </div>
                <input type="file" accept="image/*" onChange={(e)=>{ onBgPhoto(e); setOpen(false); }} style={{ display:"none" }} />
              </label>
              <label style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"12px 14px", cursor:"pointer", color:"#fff", fontSize:13, display:"flex", alignItems:"center", gap:10, position:"relative", transition:"background 0.2s" }}
                onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.12)"}
                onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}>
                <span style={{ fontSize:18 }}>🎨</span>
                <div>
                  <p style={{ margin:0, fontWeight:600, fontSize:13 }}>Solid Color</p>
                  <p style={{ margin:0, fontSize:11, color:"#555" }}>Pick a background color</p>
                </div>
                <input type="color" onChange={(e)=>{ onBgColor(e.target.value); setOpen(false); }} style={{ position:"absolute", opacity:0, inset:0, width:"100%", height:"100%", cursor:"pointer" }} />
              </label>
              <button onClick={()=>{ onReset(); setOpen(false); }}
                style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"12px 14px", cursor:"pointer", color:"#fff", fontSize:13, display:"flex", alignItems:"center", gap:10, width:"100%", transition:"background 0.2s" }}
                onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.12)"}
                onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}>
                <span style={{ fontSize:18 }}>🌌</span>
                <div style={{ textAlign:"left" }}>
                  <p style={{ margin:0, fontWeight:600, fontSize:13 }}>Aurora (Default)</p>
                  <p style={{ margin:0, fontSize:11, color:"#555" }}>Animated gradient background</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
