import { useState } from "react";
import { loadImage, saveImage, removeImage, loadBgColor, saveBgColor } from "../utils/storage";
import { AuroraBackground } from "./AuroraBackground";
export function MoodCard({ mood, onClick, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [image, setImage] = useState(() => loadImage(mood.id));
  const [bgColor, setBgColor] = useState(() => loadBgColor(mood.id));
  const handleUpload = (e) => {
    e.stopPropagation(); const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { saveImage(mood.id, ev.target.result); setImage(ev.target.result); };
    reader.readAsDataURL(file);
  };
  return (
    <div onClick={() => onClick(mood)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position:"relative", borderRadius:24, overflow:"hidden", cursor:"pointer", aspectRatio:"3/4",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s",
        boxShadow: hovered ? "0 20px 60px "+mood.color+"60" : "0 4px 20px "+mood.color+"20" }}>
      {image ? <img src={image} alt={mood.label} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
        : bgColor ? <div style={{ position:"absolute", inset:0, background:bgColor }} />
        : <AuroraBackground colors={mood.aurora} />}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)" }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"16px" }}>
        <p style={{ fontFamily:"Fraunces, Georgia, serif", fontSize:20, fontWeight:700, color:"#fff", margin:0, textShadow:"0 2px 8px rgba(0,0,0,0.5)" }}>{mood.label}</p>
      </div>
      {hovered && (
        <div onClick={(e) => e.stopPropagation()} style={{ position:"absolute", top:10, right:10, display:"flex", flexDirection:"column", gap:5 }}>
          <label style={{ background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"5px 9px", fontSize:11, color:"#fff", cursor:"pointer", fontWeight:600, textAlign:"center" }}>
            {image ? "Change Photo" : "+ Photo"}
            <input type="file" accept="image/*" onChange={handleUpload} style={{ display:"none" }} />
          </label>
          {image && <button onClick={(e)=>{e.stopPropagation();removeImage(mood.id);setImage(null);}} style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, padding:"5px 9px", fontSize:11, color:"#fff", cursor:"pointer" }}>Remove Photo</button>}
          <label style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, padding:"5px 9px", fontSize:11, color:"#fff", cursor:"pointer", textAlign:"center" }}>
            Set Color
            <input type="color" defaultValue={bgColor||mood.color} onChange={(e)=>{e.stopPropagation();saveBgColor(mood.id,e.target.value);setBgColor(e.target.value);}} onClick={(e)=>e.stopPropagation()} style={{ opacity:0, position:"absolute", width:0, height:0 }} />
          </label>
          {(image||bgColor) && <button onClick={(e)=>{e.stopPropagation();removeImage(mood.id);setImage(null);saveBgColor(mood.id,"");setBgColor(null);}} style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, padding:"5px 9px", fontSize:11, color:"#fff", cursor:"pointer" }}>Reset Aurora</button>}
        </div>
      )}
      {hovered && <button onClick={(e)=>{e.stopPropagation();onDelete&&onDelete(mood.id);}} style={{ position:"absolute", top:10, left:10, background:"rgba(220,38,38,0.6)", backdropFilter:"blur(8px)", border:"none", borderRadius:8, padding:"5px 10px", fontSize:11, color:"#fff", cursor:"pointer", fontWeight:600 }}>Delete</button>}
    </div>
  );
}
