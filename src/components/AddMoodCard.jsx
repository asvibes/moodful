import { useState } from "react";
import { saveImage } from "../utils/storage";
const COLORS = ["#FF6B6B","#FF9F43","#FECA57","#48DBFB","#FF9FF3","#54A0FF","#5F27CD","#00D2D3"];
export function AddMoodCard({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("#FF6B6B");
  const [hovered, setHovered] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const handleImage = (e) => { const file = e.target.files[0]; if (!file) return; const r = new FileReader(); r.onload = (ev) => { setPreview(ev.target.result); setImageData(ev.target.result); }; r.readAsDataURL(file); };
  const submit = () => { if (!label.trim()) return; const id = "custom_"+Date.now(); if (imageData) saveImage(id, imageData); onAdd(label.trim(), color, id); setLabel(""); setColor("#FF6B6B"); setPreview(null); setImageData(null); setOpen(false); };
  if (open) return (
    <div style={{ borderRadius:24, border:"2px dashed #333", aspectRatio:"3/4", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:16, background:"#1a1a20", gap:10, overflow:"hidden", position:"relative" }}>
      {preview && <img src={preview} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.25 }} />}
      <div style={{ position:"relative", zIndex:1, width:"100%", display:"flex", flexDirection:"column", gap:10, alignItems:"center" }}>
        <p style={{ fontFamily:"Fraunces, Georgia, serif", fontSize:15, fontWeight:700, color:"#fff", margin:0 }}>New Mood</p>
        <input value={label} onChange={(e)=>setLabel(e.target.value)} placeholder="Mood name..." style={{ width:"100%", padding:"8px 12px", borderRadius:10, border:"2px solid #333", fontSize:13, outline:"none", boxSizing:"border-box", background:"#0F0F13", color:"#fff", fontFamily:"Lora, Georgia, serif" }} />
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center" }}>
          {COLORS.map((c) => <div key={c} onClick={()=>setColor(c)} style={{ width:22, height:22, borderRadius:"50%", background:c, cursor:"pointer", border:color===c?"3px solid #fff":"2px solid transparent" }} />)}
        </div>
        <label style={{ width:"100%", padding:"7px 0", borderRadius:10, border:"2px dashed #444", background:"transparent", fontSize:12, cursor:"pointer", color:preview?"#52B788":"#888", textAlign:"center", display:"block" }}>
          {preview ? "Photo added!" : "+ Upload Photo (optional)"}
          <input type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }} />
        </label>
        <div style={{ display:"flex", gap:8, width:"100%" }}>
          <button onClick={()=>{setOpen(false);setLabel("");setPreview(null);setImageData(null);}} style={{ flex:1, padding:"7px 0", borderRadius:10, border:"2px solid #333", background:"transparent", fontSize:12, cursor:"pointer", color:"#aaa" }}>Cancel</button>
          <button onClick={submit} style={{ flex:1, padding:"7px 0", borderRadius:10, border:"none", background:color, color:"#fff", fontSize:12, cursor:"pointer", fontFamily:"Fraunces, Georgia, serif", fontWeight:700 }}>Add</button>
        </div>
      </div>
    </div>
  );
  return (
    <div onClick={()=>setOpen(true)} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{ borderRadius:24, border:"2px dashed #2a2a30", aspectRatio:"3/4", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", gap:8, background:hovered?"#1a1a20":"#141418", transform:hovered?"scale(1.02)":"scale(1)", transition:"all 0.2s" }}>
      <div style={{ width:48, height:48, borderRadius:"50%", background:"#2a2a30", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, color:"#555" }}>+</div>
      <p style={{ fontFamily:"Fraunces, Georgia, serif", fontSize:13, fontWeight:600, color:"#444", margin:0 }}>Add Mood</p>
    </div>
  );
}
