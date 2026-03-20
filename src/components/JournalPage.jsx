import { useState, useEffect, useRef } from "react";
import { loadJournal, addJournalEntry, deleteJournalEntry, updateEntryPos, loadImage, saveImage, removeImage, loadBgColor, saveBgColor, loadStickers, saveStickers } from "../utils/storage";
import { AuroraBackground } from "./AuroraBackground";
import { DraggableItem } from "./DraggableItem";
import { MONTHS } from "../constants/moods";
const fmtDate = (ts) => { const d = new Date(ts); return MONTHS[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear(); };
const fmtTime = (ts) => new Date(ts).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
const BG_TITLE_KEY = (id) => "title_"+id;
const BG_BRIGHT_KEY = (id) => "bright_"+id;
const BG_IMG_POS_KEY = (id) => "imgpos_"+id;
const BOXES_KEY = (id) => "boxes_"+id;
export function JournalPage({ mood, onBack }) {
  const [entries, setEntries] = useState(() => loadJournal(mood.id));
  const [boxes, setBoxes] = useState(() => { try { return JSON.parse(localStorage.getItem(BOXES_KEY(mood.id)) || "[]"); } catch { return []; } });
  const [image, setImage] = useState(() => loadImage(mood.id));
  const [bgColor, setBgColor] = useState(() => loadBgColor(mood.id));
  const [stickers, setStickers] = useState(() => loadStickers(mood.id));
  const [animIn, setAnimIn] = useState(false);
  const [brightness, setBrightness] = useState(() => parseFloat(localStorage.getItem(BG_BRIGHT_KEY(mood.id)) || "0.45"));
  const [title, setTitle] = useState(() => localStorage.getItem(BG_TITLE_KEY(mood.id)) || mood.label);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [imgPos, setImgPos] = useState(() => { try { return JSON.parse(localStorage.getItem(BG_IMG_POS_KEY(mood.id)) || "{}"); } catch { return {}; } });
  useEffect(() => { setTimeout(() => setAnimIn(true), 10); }, []);
  const saveBoxes = (b) => { setBoxes(b); localStorage.setItem(BOXES_KEY(mood.id), JSON.stringify(b)); };
  const addBox = () => { const b = { id: Date.now(), text:"", x:80+Math.random()*200, y:120+Math.random()*100, w:400, bgColor:"#0a0a10", textColor:"#e0e0e0", accentColor:mood.color }; saveBoxes([...boxes, b]); };
  const updateBox = (id, changes) => saveBoxes(boxes.map(b => b.id===id ? {...b,...changes} : b));
  const removeBox = (id) => saveBoxes(boxes.filter(b => b.id!==id));
  const moveBox = (id, x, y) => saveBoxes(boxes.map(b => b.id===id ? {...b,x,y} : b));
  const save = (boxId) => { const box = boxes.find(b=>b.id===boxId); if (!box?.text?.trim()) return; setEntries(addJournalEntry(mood.id, box.text.trim(), box.x, box.y+200)); updateBox(boxId, { text:"" }); };
  const remove = (id) => setEntries(deleteJournalEntry(mood.id, id));
  const moveEntry = (id, x, y) => setEntries(updateEntryPos(mood.id, id, x, y));
  const handleBgImage = (e) => { const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=(ev)=>{ saveImage(mood.id,ev.target.result); setImage(ev.target.result); setImgPos({}); localStorage.removeItem(BG_IMG_POS_KEY(mood.id)); }; r.readAsDataURL(f); };
  const handleStickerUpload = (e) => { const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=(ev)=>{ const s={id:Date.now(),src:ev.target.result,x:200,y:400,w:120}; const u=[...stickers,s]; setStickers(u); saveStickers(mood.id,u); }; r.readAsDataURL(f); };
  const removeSticker = (id) => { const u=stickers.filter(s=>s.id!==id); setStickers(u); saveStickers(mood.id,u); };
  const moveSticker = (id,x,y) => { const u=stickers.map(s=>s.id===id?{...s,x,y}:s); setStickers(u); saveStickers(mood.id,u); };
  const goBack = () => { setAnimIn(false); setTimeout(onBack,350); };
  const setBright = (v) => { setBrightness(v); localStorage.setItem(BG_BRIGHT_KEY(mood.id), v); };
  const saveTitle = (v) => { setTitle(v); localStorage.setItem(BG_TITLE_KEY(mood.id), v); };
  const updateImgPos = (key, val) => { const np={...imgPos,[key]:val}; setImgPos(np); localStorage.setItem(BG_IMG_POS_KEY(mood.id),JSON.stringify(np)); };
  const resetImgAdj = () => { setImgPos({}); localStorage.removeItem(BG_IMG_POS_KEY(mood.id)); };
  const pageH = Math.max(window.innerHeight*3, entries.length*200+1200);
  function hexToRgb(hex) { try { const r=parseInt(hex.slice(1,3),16); const g=parseInt(hex.slice(3,5),16); const b=parseInt(hex.slice(5,7),16); return r+","+g+","+b; } catch { return "100,100,200"; } }
  const imgStyle = { width:"100%", height:"100%", objectFit:imgPos.fit||"cover", objectPosition:(imgPos.x||50)+"% "+(imgPos.y||50)+"%", transition:"object-position 0.2s" };
  return (
    <div style={{position:"fixed",inset:0,zIndex:999,transform:animIn?"translateX(0)":"translateX(100%)",transition:"transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",overflowY:"auto",overflowX:"hidden"}}>
      <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden"}}>
        {image ? <img src={image} alt="" style={imgStyle} />
          : bgColor ? <div style={{position:"absolute",inset:0,background:bgColor}} />
          : <AuroraBackground colors={mood.aurora} style={{borderRadius:0}} />}
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,"+brightness+")",transition:"background 0.3s"}} />
      </div>
      <div style={{position:"relative",zIndex:1,minHeight:pageH+"px",width:"100%"}}>
        <div style={{position:"sticky",top:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",background:"rgba(255,255,255,0.07)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,0.1)",boxShadow:"0 4px 30px rgba(0,0,0,0.2)"}}>
          <button onClick={goBack} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"7px 16px",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Fraunces,Georgia,serif",flexShrink:0}}>Back</button>
          <div style={{flex:1,display:"flex",justifyContent:"center",padding:"0 16px"}}>
            <h1 onClick={()=>{ const t=prompt("Rename:",title); if(t) saveTitle(t); }} title="Click to rename"
              style={{fontFamily:"Fraunces,Georgia,serif",fontSize:24,fontWeight:700,color:"#fff",margin:0,cursor:"pointer",textShadow:"0 2px 12px rgba(0,0,0,0.4)",borderBottom:"1px dashed rgba(255,255,255,0.2)",paddingBottom:2}}>{title}</h1>
          </div>
          <div style={{display:"flex",gap:6,flexShrink:0}}>
            <button onClick={addBox} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"7px 14px",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"Fraunces,Georgia,serif",fontWeight:600}}>+ Box</button>
            <button onClick={()=>setSettingsOpen(!settingsOpen)} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"7px 12px",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"Fraunces,Georgia,serif",fontWeight:600}}>Settings</button>
            <label style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"7px 12px",fontSize:13,color:"#fff",cursor:"pointer",fontWeight:600,fontFamily:"Fraunces,Georgia,serif"}}>
              + Sticker
              <input type="file" accept="image/*" onChange={handleStickerUpload} style={{display:"none"}} />
            </label>
          </div>
        </div>
        {settingsOpen && (
          <>
            <div onClick={()=>setSettingsOpen(false)} style={{position:"fixed",inset:0,zIndex:48}} />
            <div style={{position:"fixed",top:68,right:20,zIndex:49,background:"rgba(10,10,16,0.96)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:20,width:300,boxShadow:"0 20px 60px rgba(0,0,0,0.7)",maxHeight:"80vh",overflowY:"auto"}}>
              <p style={{fontFamily:"Fraunces,Georgia,serif",fontSize:15,fontWeight:700,color:"#fff",margin:"0 0 16px"}}>Journal Settings</p>
              <p style={{fontSize:11,color:"#888",margin:"0 0 6px",letterSpacing:1,textTransform:"uppercase"}}>Rename</p>
              <div style={{display:"flex",gap:6,marginBottom:16}}>
                <input value={title} onChange={(e)=>setTitle(e.target.value)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"7px 10px",color:"#fff",fontSize:13,outline:"none"}} />
                <button onClick={()=>{ saveTitle(title); setSettingsOpen(false); }} style={{background:mood.color,border:"none",borderRadius:8,padding:"7px 12px",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:700}}>Save</button>
              </div>
              <p style={{fontSize:11,color:"#888",margin:"0 0 8px",letterSpacing:1,textTransform:"uppercase"}}>Background</p>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                <label style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px",cursor:"pointer",color:"#fff",fontSize:13,display:"flex",alignItems:"center",gap:8}}>
                  Photo: Change Background
                  <input type="file" accept="image/*" onChange={(e)=>{ handleBgImage(e); setSettingsOpen(false); }} style={{display:"none"}} />
                </label>
                <label style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px",cursor:"pointer",color:"#fff",fontSize:13,display:"flex",alignItems:"center",gap:8,position:"relative"}}>
                  Color: Set Background Color
                  <input type="color" defaultValue={bgColor||mood.color} onChange={(e)=>{ saveBgColor(mood.id,e.target.value); setBgColor(e.target.value); setImage(null); }} style={{position:"absolute",opacity:0,inset:0,width:"100%",height:"100%",cursor:"pointer"}} />
                </label>
                {(image||bgColor) && <button onClick={()=>{ removeImage(mood.id); setImage(null); saveBgColor(mood.id,""); setBgColor(null); setSettingsOpen(false); }} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px",color:"#aaa",fontSize:13,cursor:"pointer",textAlign:"left"}}>Reset to Aurora</button>}
              </div>
              {image && (<>
                <p style={{fontSize:11,color:"#888",margin:"0 0 8px",letterSpacing:1,textTransform:"uppercase"}}>Image Position</p>
                <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:14,marginBottom:16,display:"flex",flexDirection:"column",gap:12}}>
                  <div>
                    <p style={{fontSize:11,color:"#666",margin:"0 0 6px"}}>Fit Mode</p>
                    <div style={{display:"flex",gap:6}}>
                      {["cover","fill"].map(f=>(
                        <button key={f} onClick={()=>updateImgPos("fit",f)} style={{flex:1,padding:"6px 0",borderRadius:8,border:"1px solid "+((imgPos.fit||"cover")===f?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.1)"),background:(imgPos.fit||"cover")===f?"rgba(255,255,255,0.15)":"transparent",color:"#fff",fontSize:11,cursor:"pointer"}}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><p style={{fontSize:11,color:"#666",margin:0}}>Horizontal</p><p style={{fontSize:11,color:"#888",margin:0}}>{imgPos.x||50}%</p></div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:12,color:"#666"}}>L</span>
                      <input type="range" min="0" max="100" step="1" value={imgPos.x||50} onChange={(e)=>updateImgPos("x",parseInt(e.target.value))} style={{flex:1,accentColor:mood.color,cursor:"pointer"}} />
                      <span style={{fontSize:12,color:"#666"}}>R</span>
                    </div>
                  </div>
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><p style={{fontSize:11,color:"#666",margin:0}}>Vertical</p><p style={{fontSize:11,color:"#888",margin:0}}>{imgPos.y||50}%</p></div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:12,color:"#666"}}>T</span>
                      <input type="range" min="0" max="100" step="1" value={imgPos.y||50} onChange={(e)=>updateImgPos("y",parseInt(e.target.value))} style={{flex:1,accentColor:mood.color,cursor:"pointer"}} />
                      <span style={{fontSize:12,color:"#666"}}>B</span>
                    </div>
                  </div>
                  <button onClick={resetImgAdj} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"7px 0",color:"#888",fontSize:12,cursor:"pointer",width:"100%"}}>Reset Position</button>
                </div>
              </>)}
              <p style={{fontSize:11,color:"#888",margin:"0 0 8px",letterSpacing:1,textTransform:"uppercase"}}>Overlay Darkness</p>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                <span style={{fontSize:12,color:"#888"}}>Light</span>
                <input type="range" min="0" max="0.85" step="0.05" value={brightness} onChange={(e)=>setBright(parseFloat(e.target.value))} style={{flex:1,accentColor:mood.color,cursor:"pointer"}} />
                <span style={{fontSize:12,color:"#888"}}>Dark</span>
              </div>
              <p style={{fontSize:11,color:"#555",textAlign:"center",margin:0}}>{Math.round((1-brightness)*100)}% brightness</p>
            </div>
          </>
        )}
        {boxes.map((box) => (
          <WriteBox key={box.id} box={box} mood={mood} onUpdate={updateBox} onRemove={removeBox} onMove={moveBox} onSave={save} />
        ))}
        {entries.map((entry,i)=>(
          <DraggableItem key={entry.id} initialX={entry.x||60} initialY={entry.y||(200+i*40)} onMove={(x,y)=>moveEntry(entry.id,x,y)}>
            <div style={{background:"rgba("+hexToRgb(mood.color)+",0.12)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderRadius:16,padding:"14px 16px",border:"1px solid rgba("+hexToRgb(mood.color)+",0.25)",boxShadow:"0 4px 24px rgba(0,0,0,0.3)",maxWidth:340,minWidth:200}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:mood.color,marginTop:3,flexShrink:0}} />
                <button onClick={()=>remove(entry.id)} style={{background:"rgba(220,38,38,0.3)",border:"none",borderRadius:6,padding:"2px 7px",fontSize:10,color:"#ff8888",cursor:"pointer"}}>x</button>
              </div>
              <p style={{fontFamily:"Lora,Georgia,serif",fontSize:14,lineHeight:1.7,color:"#e0e0e0",margin:0,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{entry.text}</p>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.35)",margin:"10px 0 0",borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:8}}>{fmtDate(entry.ts)} · {fmtTime(entry.ts)}</p>
            </div>
          </DraggableItem>
        ))}
        {stickers.map((s)=>(
          <DraggableItem key={s.id} initialX={s.x} initialY={s.y} onMove={(x,y)=>moveSticker(s.id,x,y)}>
            <div style={{position:"relative"}}>
              <img src={s.src} style={{width:s.w+"px",height:"auto",borderRadius:12,display:"block",boxShadow:"0 4px 20px rgba(0,0,0,0.4)"}} />
              <button onClick={()=>removeSticker(s.id)} style={{position:"absolute",top:-8,right:-8,background:"#EF4444",border:"none",borderRadius:"50%",width:20,height:20,fontSize:11,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>x</button>
            </div>
          </DraggableItem>
        ))}
        {boxes.length===0 && entries.length===0 && stickers.length===0 && (
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}>
            <p style={{fontFamily:"Fraunces,Georgia,serif",fontSize:18,color:"rgba(255,255,255,0.2)",margin:0}}>tap + Box to start writing</p>
          </div>
        )}
      </div>
    </div>
  );
}
function WriteBox({ box, mood, onUpdate, onRemove, onMove, onSave }) {
  const [colorOpen, setColorOpen] = useState(false);
  const resizing = useRef(false);
  const resizeStart = useRef(0);
  const resizeStartW = useRef(0);
  const startResize = (e) => { e.preventDefault(); resizing.current=true; resizeStart.current=e.clientX; resizeStartW.current=box.w; const onM=(e2)=>{ if(!resizing.current) return; onUpdate(box.id,{w:Math.max(260,resizeStartW.current+(e2.clientX-resizeStart.current))}); }; const onU=()=>{ resizing.current=false; window.removeEventListener("mousemove",onM); window.removeEventListener("mouseup",onU); }; window.addEventListener("mousemove",onM); window.addEventListener("mouseup",onU); };
  return (
    <DraggableItem initialX={box.x} initialY={box.y} onMove={(x,y)=>onMove(box.id,x,y)}>
      <div style={{width:box.w+"px",position:"relative",borderRadius:20,overflow:"visible"}}>
        <div style={{borderRadius:20,background:"rgba(255,255,255,0.08)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.18)",boxShadow:"0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",overflow:"hidden",position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px 8px",background:"rgba(255,255,255,0.06)",backdropFilter:"blur(8px)",borderBottom:"1px solid rgba(255,255,255,0.1)",cursor:"grab"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:"#EF4444",opacity:0.8}} />
              <div style={{width:9,height:9,borderRadius:"50%",background:"#FBBF24",opacity:0.8}} />
              <div style={{width:9,height:9,borderRadius:"50%",background:"#34D399",opacity:0.8}} />
            </div>
            <div style={{display:"flex",gap:5}}>
              <button onClick={(e)=>{e.stopPropagation();setColorOpen(!colorOpen);}} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:7,padding:"3px 9px",fontSize:11,color:"#fff",cursor:"pointer"}}>colors</button>
              <button onClick={(e)=>{e.stopPropagation();onRemove(box.id);}} style={{background:"rgba(220,38,38,0.25)",border:"1px solid rgba(220,38,38,0.3)",borderRadius:7,padding:"3px 9px",fontSize:11,color:"#ff8888",cursor:"pointer"}}>x</button>
            </div>
          </div>
          {colorOpen && (
            <div onClick={(e)=>e.stopPropagation()} style={{padding:"12px 14px",background:"rgba(10,10,16,0.95)",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:"#888",letterSpacing:0.5}}>BOX BACKGROUND</span>
                <input type="color" value={box.bgColor||"#0a0a10"} onChange={(e)=>{e.stopPropagation();onUpdate(box.id,{bgColor:e.target.value});}} style={{width:32,height:24,border:"none",borderRadius:4,cursor:"pointer",padding:0}} />
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:"#888",letterSpacing:0.5}}>TEXT COLOR</span>
                <input type="color" value={box.textColor||"#e0e0e0"} onChange={(e)=>{e.stopPropagation();onUpdate(box.id,{textColor:e.target.value});}} style={{width:32,height:24,border:"none",borderRadius:4,cursor:"pointer",padding:0}} />
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:"#888",letterSpacing:0.5}}>ACCENT COLOR</span>
                <input type="color" value={box.accentColor||mood.color} onChange={(e)=>{e.stopPropagation();onUpdate(box.id,{accentColor:e.target.value});}} style={{width:32,height:24,border:"none",borderRadius:4,cursor:"pointer",padding:0}} />
              </div>
              <button onClick={()=>onUpdate(box.id,{bgColor:"#0a0a10",textColor:"#e0e0e0",accentColor:mood.color})} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:7,padding:"5px 0",color:"#888",fontSize:11,cursor:"pointer"}}>Reset Colors</button>
            </div>
          )}
          <div style={{padding:"12px 14px",background:box.bgColor||"#0a0a10",backdropFilter:"none"}}>
            <textarea value={box.text||""} onChange={(e)=>onUpdate(box.id,{text:e.target.value})} placeholder="Write freely..." rows={4}
              style={{width:"100%",boxSizing:"border-box",padding:"10px 12px",borderRadius:12,border:"2px solid rgba(255,255,255,0.06)",fontFamily:"Lora,Georgia,serif",fontSize:15,lineHeight:1.75,color:box.textColor||"#e0e0e0",background:"rgba(0,0,0,0.25)",resize:"none",outline:"none",transition:"border-color 0.2s"}}
              onFocus={(e)=>(e.target.style.borderColor=box.accentColor||mood.color)}
              onBlur={(e)=>(e.target.style.borderColor="rgba(255,255,255,0.06)")} />
            <button onClick={()=>onSave(box.id)} disabled={!box.text?.trim()}
              style={{marginTop:8,width:"100%",padding:"10px 0",borderRadius:11,border:"none",background:(box.text&&box.text.trim().length>0)?(box.accentColor||mood.color):"rgba(255,255,255,0.05)",color:(box.text&&box.text.trim())?"#fff":"#444",fontFamily:"Fraunces,Georgia,serif",fontSize:13,fontWeight:700,cursor:(box.text?.trim())?"pointer":"not-allowed",transition:"all 0.2s",boxShadow:(box.text?.trim())?"0 4px 14px "+(box.accentColor||mood.color)+"40":"none"}}>
              Pin Entry
            </button>
          </div>
        </div>
        <div onMouseDown={startResize} style={{position:"absolute",right:-6,top:0,bottom:0,width:12,cursor:"ew-resize",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:3,height:32,borderRadius:2,background:"rgba(255,255,255,0.2)"}} />
        </div>
      </div>
    </DraggableItem>
  );
}
