import { useState, useEffect, useRef } from "react";
import { loadJournal, addJournalEntry, deleteJournalEntry, updateEntryPos, loadImage, saveImage, removeImage, loadBgColor, saveBgColor, loadStickers, saveStickers } from "../utils/storage";
import { AuroraBackground } from "./AuroraBackground";
import { DraggableItem } from "./DraggableItem";
import { MONTHS } from "../constants/moods";
const fmtDate = (ts) => { const d = new Date(ts); return MONTHS[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear(); };
const fmtTime = (ts) => new Date(ts).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
const BG_TITLE_KEY = (id) => "title_" + id;
const BG_BRIGHT_KEY = (id) => "bright_" + id;
export function JournalPage({ mood, onBack }) {
  const [entries, setEntries] = useState(() => loadJournal(mood.id));
  const [text, setText] = useState("");
  const [image, setImage] = useState(() => loadImage(mood.id));
  const [bgColor, setBgColor] = useState(() => loadBgColor(mood.id));
  const [stickers, setStickers] = useState(() => loadStickers(mood.id));
  const [animIn, setAnimIn] = useState(false);
  const [resizeW, setResizeW] = useState(460);
  const [brightness, setBrightness] = useState(() => parseFloat(localStorage.getItem(BG_BRIGHT_KEY(mood.id)) || "0.45"));
  const [title, setTitle] = useState(() => localStorage.getItem(BG_TITLE_KEY(mood.id)) || mood.label);
  const [editingTitle, setEditingTitle] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const resizing = useRef(false);
  const resizeStart = useRef(0);
  const resizeStartW = useRef(0);
  useEffect(() => { setTimeout(() => setAnimIn(true), 10); }, []);
  const save = () => { if (!text.trim()) return; setEntries(addJournalEntry(mood.id, text.trim(), 40, entries.length*180+520)); setText(""); };
  const remove = (id) => setEntries(deleteJournalEntry(mood.id, id));
  const moveEntry = (id, x, y) => setEntries(updateEntryPos(mood.id, id, x, y));
  const handleBgImage = (e) => { const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=(ev)=>{ saveImage(mood.id,ev.target.result); setImage(ev.target.result); }; r.readAsDataURL(f); };
  const handleStickerUpload = (e) => { const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=(ev)=>{ const s={id:Date.now(),src:ev.target.result,x:200,y:400,w:120}; const u=[...stickers,s]; setStickers(u); saveStickers(mood.id,u); }; r.readAsDataURL(f); };
  const removeSticker = (id) => { const u=stickers.filter(s=>s.id!==id); setStickers(u); saveStickers(mood.id,u); };
  const moveSticker = (id,x,y) => { const u=stickers.map(s=>s.id===id?{...s,x,y}:s); setStickers(u); saveStickers(mood.id,u); };
  const startResize = (e) => { e.preventDefault(); resizing.current=true; resizeStart.current=e.clientX; resizeStartW.current=resizeW; const onM=(e2)=>{ if(!resizing.current) return; setResizeW(Math.max(280,resizeStartW.current+(e2.clientX-resizeStart.current))); }; const onU=()=>{ resizing.current=false; window.removeEventListener("mousemove",onM); window.removeEventListener("mouseup",onU); }; window.addEventListener("mousemove",onM); window.addEventListener("mouseup",onU); };
  const goBack = () => { setAnimIn(false); setTimeout(onBack,350); };
  const setBright = (v) => { setBrightness(v); localStorage.setItem(BG_BRIGHT_KEY(mood.id), v); };
  const saveTitle = (v) => { setTitle(v); localStorage.setItem(BG_TITLE_KEY(mood.id), v); };
  const pageH = Math.max(window.innerHeight, entries.length*200+800);
  function hexToRgb(hex) { try { const r=parseInt(hex.slice(1,3),16); const g=parseInt(hex.slice(3,5),16); const b=parseInt(hex.slice(5,7),16); return r+","+g+","+b; } catch { return "100,100,200"; } }
  return (
    <div style={{position:"fixed",inset:0,zIndex:100,transform:animIn?"translateX(0)":"translateX(100%)",transition:"transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",overflowY:"auto",overflowX:"hidden"}}>
      {/* Full page bg */}
      <div style={{position:"fixed",inset:0,zIndex:0}}>
        {image ? <img src={image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
          : bgColor ? <div style={{position:"absolute",inset:0,background:bgColor}} />
          : <AuroraBackground colors={mood.aurora} style={{borderRadius:0}} />}
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,"+brightness+")"}} />
      </div>
      {/* Scrollable canvas */}
      <div style={{position:"relative",zIndex:1,minHeight:pageH+"px",width:"100%"}}>
        {/* Glass top bar */}
        <div style={{position:"sticky",top:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",background:"rgba(255,255,255,0.08)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.12)",boxShadow:"0 4px 30px rgba(0,0,0,0.2)"}}>
          <button onClick={goBack} style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:10,padding:"7px 16px",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Fraunces,Georgia,serif",flexShrink:0}}>Back</button>
          {/* Editable centered title */}
          <div style={{flex:1,display:"flex",justifyContent:"center",alignItems:"center",padding:"0 16px"}}>
            {editingTitle ? (
              <input autoFocus value={title} onChange={(e)=>setTitle(e.target.value)}
                onBlur={()=>{ saveTitle(title); setEditingTitle(false); }}
                onKeyDown={(e)=>{ if(e.key==="Enter"){ saveTitle(title); setEditingTitle(false); } }}
                style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:22,fontWeight:700,fontFamily:"Fraunces,Georgia,serif",outline:"none",textAlign:"center",width:"100%",maxWidth:300}}
              />
            ) : (
              <h1 onClick={()=>setEditingTitle(true)} title="Click to rename"
                style={{fontFamily:"Fraunces,Georgia,serif",fontSize:24,fontWeight:700,color:"#fff",margin:0,cursor:"pointer",textShadow:"0 2px 12px rgba(0,0,0,0.4)",textAlign:"center",borderBottom:"1px dashed rgba(255,255,255,0.2)",paddingBottom:2}}>
                {title}
              </h1>
            )}
          </div>
          {/* Right controls */}
          <div style={{display:"flex",gap:6,flexShrink:0}}>
            {/* Settings gear */}
            <button onClick={()=>setSettingsOpen(!settingsOpen)}
              style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:10,padding:"7px 12px",color:"#fff",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:"Fraunces,Georgia,serif",fontWeight:600}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
              Settings
            </button>
            {/* Add sticker */}
            <label style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:10,padding:"7px 12px",fontSize:13,color:"#fff",cursor:"pointer",fontWeight:600,fontFamily:"Fraunces,Georgia,serif"}}>
              + Sticker
              <input type="file" accept="image/*" onChange={handleStickerUpload} style={{display:"none"}} />
            </label>
          </div>
        </div>
        {/* Settings dropdown */}
        {settingsOpen && (
          <>
            <div onClick={()=>setSettingsOpen(false)} style={{position:"fixed",inset:0,zIndex:48}} />
            <div style={{position:"fixed",top:68,right:20,zIndex:49,background:"rgba(10,10,16,0.95)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:20,width:280,boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}>
              <p style={{fontFamily:"Fraunces,Georgia,serif",fontSize:15,fontWeight:700,color:"#fff",margin:"0 0 14px"}}>Journal Settings</p>
              {/* Rename */}
              <div style={{marginBottom:14}}>
                <p style={{fontSize:11,color:"#888",margin:"0 0 6px",letterSpacing:1,textTransform:"uppercase"}}>Rename Journal</p>
                <div style={{display:"flex",gap:6}}>
                  <input value={title} onChange={(e)=>setTitle(e.target.value)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"7px 10px",color:"#fff",fontSize:13,outline:"none",fontFamily:"Lora,Georgia,serif"}} />
                  <button onClick={()=>{ saveTitle(title); setSettingsOpen(false); }} style={{background:mood.color,border:"none",borderRadius:8,padding:"7px 12px",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:700}}>Save</button>
                </div>
              </div>
              {/* Background */}
              <p style={{fontSize:11,color:"#888",margin:"0 0 8px",letterSpacing:1,textTransform:"uppercase"}}>Background</p>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
                <label style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px",cursor:"pointer",color:"#fff",fontSize:13,display:"flex",alignItems:"center",gap:8}}>
                  <span>🖼️</span> Change Photo
                  <input type="file" accept="image/*" onChange={(e)=>{ handleBgImage(e); setSettingsOpen(false); }} style={{display:"none"}} />
                </label>
                <label style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px",cursor:"pointer",color:"#fff",fontSize:13,display:"flex",alignItems:"center",gap:8,position:"relative"}}>
                  <span>🎨</span> Set Color
                  <input type="color" defaultValue={bgColor||mood.color} onChange={(e)=>{ saveBgColor(mood.id,e.target.value); setBgColor(e.target.value); setImage(null); }} style={{position:"absolute",opacity:0,inset:0,width:"100%",height:"100%",cursor:"pointer"}} />
                </label>
                {(image||bgColor) && <button onClick={()=>{ removeImage(mood.id); setImage(null); saveBgColor(mood.id,""); setBgColor(null); setSettingsOpen(false); }} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px",color:"#aaa",fontSize:13,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:8}}><span>🌌</span> Reset to Aurora</button>}
              </div>
              {/* Brightness */}
              <p style={{fontSize:11,color:"#888",margin:"0 0 8px",letterSpacing:1,textTransform:"uppercase"}}>Overlay Darkness</p>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:16}}>☀️</span>
                <input type="range" min="0" max="0.85" step="0.05" value={brightness} onChange={(e)=>setBright(parseFloat(e.target.value))}
                  style={{flex:1,accentColor:mood.color,cursor:"pointer"}} />
                <span style={{fontSize:16}}>🌑</span>
              </div>
              <p style={{fontSize:11,color:"#555",margin:"4px 0 0",textAlign:"center"}}>{Math.round((1-brightness)*100)}% brightness</p>
            </div>
          </>
        )}
        {/* Draggable write box */}
        <DraggableItem initialX={40} initialY={100}>
          <div style={{background:"rgba(10,10,16,0.82)",backdropFilter:"blur(16px)",borderRadius:20,padding:20,border:"1px solid rgba(255,255,255,0.1)",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",width:resizeW+"px",position:"relative"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,cursor:"grab"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:"#EF4444"}} />
                <div style={{width:10,height:10,borderRadius:"50%",background:"#FBBF24"}} />
                <div style={{width:10,height:10,borderRadius:"50%",background:"#34D399"}} />
              </div>
              <p style={{fontSize:11,fontWeight:700,color:mood.color,letterSpacing:1,textTransform:"uppercase",margin:0}}>New Entry — drag me!</p>
              <div style={{fontSize:10,color:"#444"}}>{entries.length} entries</div>
            </div>
            <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Write freely..." rows={4}
              style={{width:"100%",boxSizing:"border-box",padding:"12px 14px",borderRadius:14,border:"2px solid rgba(255,255,255,0.08)",fontFamily:"Lora,Georgia,serif",fontSize:15,lineHeight:1.75,color:"#e0e0e0",background:"rgba(0,0,0,0.35)",resize:"none",outline:"none"}}
              onFocus={(e)=>(e.target.style.borderColor=mood.color)}
              onBlur={(e)=>(e.target.style.borderColor="rgba(255,255,255,0.08)")} />
            <button onClick={save} disabled={!text.trim()}
              style={{marginTop:10,width:"100%",padding:"11px 0",borderRadius:12,border:"none",background:text.trim()?mood.color:"rgba(255,255,255,0.06)",color:text.trim()?"#fff":"#444",fontFamily:"Fraunces,Georgia,serif",fontSize:14,fontWeight:700,cursor:text.trim()?"pointer":"not-allowed",transition:"all 0.2s",boxShadow:text.trim()?"0 4px 16px "+mood.color+"50":"none"}}>
              Pin Entry
            </button>
            <div onMouseDown={startResize} style={{position:"absolute",right:0,top:0,bottom:0,width:8,cursor:"ew-resize",borderRadius:"0 20px 20px 0",background:"rgba(255,255,255,0.04)"}}>
              <div style={{position:"absolute",right:2,top:"50%",transform:"translateY(-50%)",width:3,height:30,borderRadius:2,background:"rgba(255,255,255,0.15)"}} />
            </div>
          </div>
        </DraggableItem>
        {/* Sticky entries */}
        {entries.map((entry,i)=>(
          <DraggableItem key={entry.id} initialX={entry.x||60} initialY={entry.y||(520+i*40)} onMove={(x,y)=>moveEntry(entry.id,x,y)}>
            <div style={{background:"rgba("+hexToRgb(mood.color)+",0.12)",backdropFilter:"blur(12px)",borderRadius:16,padding:"14px 16px",border:"1px solid rgba("+hexToRgb(mood.color)+",0.25)",boxShadow:"0 4px 20px rgba(0,0,0,0.3)",maxWidth:320,minWidth:200}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:mood.color,marginTop:3}} />
                <button onClick={()=>remove(entry.id)} style={{background:"rgba(220,38,38,0.3)",border:"none",borderRadius:6,padding:"2px 7px",fontSize:10,color:"#ff8888",cursor:"pointer"}}>x</button>
              </div>
              <p style={{fontFamily:"Lora,Georgia,serif",fontSize:14,lineHeight:1.7,color:"#e0e0e0",margin:0,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{entry.text}</p>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:"8px 0 0"}}>{fmtDate(entry.ts)} · {fmtTime(entry.ts)}</p>
            </div>
          </DraggableItem>
        ))}
        {/* Stickers */}
        {stickers.map((s)=>(
          <DraggableItem key={s.id} initialX={s.x} initialY={s.y} onMove={(x,y)=>moveSticker(s.id,x,y)}>
            <div style={{position:"relative"}}>
              <img src={s.src} style={{width:s.w+"px",height:"auto",borderRadius:12,display:"block",boxShadow:"0 4px 20px rgba(0,0,0,0.4)"}} />
              <button onClick={()=>removeSticker(s.id)} style={{position:"absolute",top:-8,right:-8,background:"#EF4444",border:"none",borderRadius:"50%",width:20,height:20,fontSize:11,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>x</button>
            </div>
          </DraggableItem>
        ))}
      </div>
    </div>
  );
}
