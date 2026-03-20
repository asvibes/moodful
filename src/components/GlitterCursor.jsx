import { useEffect } from "react";
export function GlitterCursor({ color }) {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = "@keyframes glitter{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}";
    document.head.appendChild(style);
    let last = 0;
    const onMove = (e) => {
      const now = Date.now();
      if (now - last < 30) return;
      last = now;
      for (let i = 0; i < 4; i++) {
        const p = document.createElement("div");
        const size = Math.random() * 4 + 2;
        const tx = ((Math.random() - 0.5) * 20) + "px";
        const ty = (-(Math.random() * 20 + 5)) + "px";
        const colors = [color||"#fff","#FFD700","#FF9FF3","#fff"];
        const col = colors[Math.floor(Math.random()*colors.length)];
        p.style.position = "fixed";
        p.style.pointerEvents = "none";
        p.style.zIndex = "99999";
        p.style.width = size+"px";
        p.style.height = size+"px";
        p.style.borderRadius = "50%";
        p.style.background = col;
        p.style.boxShadow = "0 0 "+size+"px "+col;
        p.style.left = (e.clientX + (Math.random()-0.5)*10 - size/2)+"px";
        p.style.top = (e.clientY - size/2)+"px";
        p.style.setProperty("--tx", tx);
        p.style.setProperty("--ty", ty);
        p.style.animation = "glitter 0.6s ease-out forwards";
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 650);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); document.head.removeChild(style); };
  }, [color]);
  return null;
}
