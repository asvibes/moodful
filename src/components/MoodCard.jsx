import { useState } from "react";
import { loadImage, saveImage } from "../utils/storage";
export function MoodCard({ mood, onClick, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [image, setImage] = useState(() => loadImage(mood.id));
  const handleUpload = (e) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { saveImage(mood.id, ev.target.result); setImage(ev.target.result); };
    reader.readAsDataURL(file);
  };
  return (
    <div onClick={() => onClick(mood)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", borderRadius: 24, overflow: "hidden", cursor: "pointer", aspectRatio: "3/4",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s",
        boxShadow: hovered ? "0 20px 60px " + mood.color + "60" : "0 4px 20px " + mood.color + "30",
        background: image ? "#000" : mood.bg }}>
      {image && <img src={image} alt={mood.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px" }}>
        <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff", margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{mood.label}</p>
      </div>
      <label onClick={(e) => e.stopPropagation()} style={{ position: "absolute", top: 10, right: 10,
        background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8,
        padding: "5px 9px", fontSize: 11, color: "#fff", cursor: "pointer",
        opacity: hovered ? 1 : 0, transition: "opacity 0.2s", fontWeight: 600 }}>
        {image ? "Change" : "+ Photo"}
        <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
      </label>
      {mood.isCustom && onDelete && (
        <button onClick={(e) => { e.stopPropagation(); onDelete(mood.id); }}
          style={{ position: "absolute", top: 10, left: 10, background: "rgba(220,38,38,0.5)",
            border: "none", borderRadius: 8, padding: "5px 9px", fontSize: 11,
            color: "#fff", cursor: "pointer", opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>
          Remove
        </button>
      )}
    </div>
  );
}
