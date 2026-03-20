import { useState, useEffect, useRef } from "react";
import { loadJournal, addJournalEntry, deleteJournalEntry, updateEntryPos, loadImage, saveImage, loadBgColor, saveBgColor, loadStickers, saveStickers } from "../utils/storage";
import { AuroraBackground } from "./AuroraBackground";
import { GlitterCursor } from "./GlitterCursor";
import { DraggableItem } from "./DraggableItem";
import { MONTHS } from "../constants/moods";
const fmtDate = (ts) => { const d = new Date(ts); return MONTHS[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear(); };
const fmtTime = (ts) => new Date(ts).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
export function JournalPage({ mood, onBack }) {
  const [entries, setEntries] = useState(() => loadJournal(mood.id));
  const [text, setText] = useState("");
  const [image, setImage] = useState(() => loadImage(mood.id));
  const [bgColor, setBgColor] = useState(() => loadBgColor(mood.id));
  const [stickers, setStickers] = useState(() => loadStickers(mood.id));
  const [animIn, setAnimIn] = useState(false);
  const [writePos] = useState({ x: 40, y: 320 });
  const [resizeW, setResizeW] = useState(460);
  const resizing = useRef(false);
  const resizeStart = useRef(0);
  const resizeStartW = useRef(0);
  useEffect(() => { setTimeout(() => setAnimIn(true), 10); }, []);
  const save = () => { if (!text.trim()) return; setEntries(addJournalEntry(mood.id, text.trim(), 40, entries.length * 180 + 520)); setText(""); };
  const remove = (id) => setEntries(deleteJournalEntry(mood.id, id));
  const moveEntry = (id, x, y) => setEntries(updateEntryPos(mood.id, id, x, y));
  const goBack = () => { setAnimIn(false); setTimeout(onBack, 350); };
  const handleBgImage = (e) => { const file = e.target.files[0]; if (!file) return; const r = new FileReader(); r.onload = (ev) => { saveImage(mood.id, ev.target.result); setImage(ev.target.result); }; r.readAsDataURL(file); };
  const handleStickerUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      const s = { id: Date.now(), src: ev.target.result, x: 200, y: 400, w: 120 };
      const u = [...stickers, s]; setStickers(u); saveStickers(mood.id, u);
    };
    r.readAsDataURL(file);
  };
  const removeSticker = (id) => { const u = stickers.filter(s=>s.id!==id); setStickers(u); saveStickers(mood.id,u); };
  const moveSticker = (id, x, y) => { const u = stickers.map(s=>s.id===id?{...s,x,y}:s); setStickers(u); saveStickers(mood.id,u); };
  const startResize = (e) => { e.preventDefault(); resizing.current=true; resizeStart.current=e.clientX; resizeStartW.current=resizeW;
    const onM = (e2) => { if (!resizing.current) return; setResizeW(Math.max(280, resizeStartW.current+(e2.clientX-resizeStart.current))); };
    const onU = () => { resizing.current=false; window.removeEventListener("mousemove",onM); window.removeEventListener("mouseup",onU); };
    window.addEventListener("mousemove",onM); window.addEventListener("mouseup",onU);
  };
  const pageH = Math.max(window.innerHeight, entries.length*200+800);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, transform:animIn?"translateX(0)":"translateX(100%)", transition:"transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)", overflowY:"auto", overflowX:"hidden" }}>
      <GlitterCursor color={mood.color} />
      {/* Full page background */}
      <div style={{ position:"fixed", inset:0, zIndex:0 }}>
        {image ? <img src={image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          : bgColor ? <div style={{ position:"absolute", inset:0, background:bgColor }} />
          : <AuroraBackground colors={mood.aurora} style={{ borderRadius:0 }} />}
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)" }} />
      </div>
      {/* Scrollable canvas */}
      <div style={{ position:"relative", zIndex:1, minHeight:pageH+"px", width:"100%" }}>
        {/* Top bar */}
        <div style={{ position:"sticky", top:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px", background:"rgba(0,0,0,0.3)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={goBack} style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:12, padding:"8px 18px", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"Fraunces, Georgia, serif" }}>Back</button>
          <h1 style={{ fontFamily:"Fraunces, Georgia, serif", fontSize:26, fontWeight:700, color:"#fff", margin:0, textShadow:"0 2px 12px rgba(0,0,0,0.5)" }}>{mood.label}</h1>
          <div style={{ display:"flex", gap:8 }}>
            {/* Change bg image */}
            <label style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:10, padding:"7px 12px", fontSize:11, color:"#fff", cursor:"pointer", fontWeight:600, whiteSpace:"nowrap" }}>
              {image ? "Change BG" : "Set BG Photo"}
              <input type="file" accept="image/*" onChange={handleBgImage} style={{ display:"none" }} />
            </label>
            {/* Set bg color */}
            <label style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:10, padding:"7px 12px", fontSize:11, color:"#fff", cursor:"pointer", fontWeight:600 }}>
              BG Color
              <input type="color" defaultValue={bgColor||"#0F0F13"} onChange={(e)=>{saveBgColor(mood.id,e.target.value);setBgColor(e.target.value);setImage(null);}} style={{ opacity:0, position:"absolute", width:0, height:0 }} />
            </label>
            {image && <button onClick={()=>{setImage(null);}} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"7px 12px", fontSize:11, color:"#fff", cursor:"pointer" }}>Reset BG</button>}
            {/* Add sticker */}
            <label style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:10, padding:"7px 12px", fontSize:11, color:"#fff", cursor:"pointer", fontWeight:600 }}>
              + Sticker
              <input type="file" accept="image/*" onChange={handleStickerUpload} style={{ display:"none" }} />
            </label>
          </div>
        </div>
        {/* Draggable write box */}
        <DraggableItem initialX={writePos.x} initialY={writePos.y}>
          <div style={{ background:"rgba(15,15,20,0.85)", backdropFilter:"blur(16px)", borderRadius:20, padding:20, border:"1px solid rgba(255,255,255,0.12)", boxShadow:"0 8px 40px rgba(0,0,0,0.4)", width:resizeW+"px", position:"relative" }}>
            {/* Drag handle */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:"#EF4444" }} />
                <div style={{ width:10, height:10, borderRadius:"50%", background:"#FBBF24" }} />
                <div style={{ width:10, height:10, borderRadius:"50%", background:"#34D399" }} />
              </div>
              <p style={{ fontSize:11, fontWeight:700, color:mood.color, letterSpacing:1, textTransform:"uppercase", margin:0 }}>New Entry — drag me!</p>
              <div style={{ fontSize:10, color:"#444" }}>{entries.length} entries</div>
            </div>
            <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Write freely..." rows={4}
              style={{ width:"100%", boxSizing:"border-box", padding:"12px 14px", borderRadius:14, border:"2px solid rgba(255,255,255,0.1)", fontFamily:"Lora, Georgia, serif", fontSize:15, lineHeight:1.75, color:"#e0e0e0", background:"rgba(0,0,0,0.4)", resize:"none", outline:"none" }}
              onFocus={(e)=>(e.target.style.borderColor=mood.color)}
              onBlur={(e)=>(e.target.style.borderColor="rgba(255,255,255,0.1)")} />
            <button onClick={save} disabled={!text.trim()}
              style={{ marginTop:10, width:"100%", padding:"11px 0", borderRadius:12, border:"none", background:text.trim()?mood.color:"rgba(255,255,255,0.08)", color:text.trim()?"#fff":"#444", fontFamily:"Fraunces, Georgia, serif", fontSize:14, fontWeight:700, cursor:text.trim()?"pointer":"not-allowed", transition:"all 0.2s", boxShadow:text.trim()?"0 4px 16px "+mood.color+"50":"none" }}>
              Pin Entry
            </button>
            {/* Resize handle */}
            <div onMouseDown={startResize} style={{ position:"absolute", right:0, top:0, bottom:0, width:8, cursor:"ew-resize", borderRadius:"0 20px 20px 0", background:"rgba(255,255,255,0.05)" }}>
              <div style={{ position:"absolute", right:2, top:"50%", transform:"translateY(-50%)", width:3, height:30, borderRadius:2, background:"rgba(255,255,255,0.2)" }} />
            </div>
          </div>
        </DraggableItem>
        {/* Draggable sticky note entries */}
        {entries.map((entry, i) => (
          <DraggableItem key={entry.id} initialX={entry.x||60} initialY={entry.y||(520+i*40)} onMove={(x,y)=>moveEntry(entry.id,x,y)}>
            <div style={{ background:"rgba("+hexToRgb(mood.color)+",0.15)", backdropFilter:"blur(12px)", borderRadius:16, padding:"14px 16px", border:"1px solid rgba("+hexToRgb(mood.color)+",0.3)", boxShadow:"0 4px 20px rgba(0,0,0,0.3)", maxWidth:320, minWidth:200 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:mood.color, marginTop:3 }} />
                <button onClick={()=>remove(entry.id)} style={{ background:"rgba(220,38,38,0.3)", border:"none", borderRadius:6, padding:"2px 7px", fontSize:10, color:"#ff8888", cursor:"pointer" }}>x</button>
              </div>
              <p style={{ fontFamily:"Lora, Georgia, serif", fontSize:14, lineHeight:1.7, color:"#e0e0e0", margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{entry.text}</p>
              <p style={{ fontSize:10, color:"rgba(255,255,255,0.3)", margin:"8px 0 0" }}>{fmtDate(entry.ts)} · {fmtTime(entry.ts)}</p>
            </div>
          </DraggableItem>
        ))}
        {/* Draggable stickers */}
        {stickers.map((s) => (
          <DraggableItem key={s.id} initialX={s.x} initialY={s.y} onMove={(x,y)=>moveSticker(s.id,x,y)}>
            <div style={{ position:"relative" }}>
              <img src={s.src} style={{ width:s.w+"px", height:"auto", borderRadius:12, display:"block", boxShadow:"0 4px 20px rgba(0,0,0,0.4)" }} />
              <button onClick={()=>removeSticker(s.id)} style={{ position:"absolute", top:-8, right:-8, background:"#EF4444", border:"none", borderRadius:"50%", width:20, height:20, fontSize:11, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>x</button>
            </div>
          </DraggableItem>
        ))}
      </div>
    </div>
  );
}
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return r+","+g+","+b;
}
