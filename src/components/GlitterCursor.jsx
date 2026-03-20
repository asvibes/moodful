import { useEffect } from "react";
export function GlitterCursor({ color }) {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = "@keyframes glit{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}";
    document.head.appendChild(style);
    let last = 0;
    const onMove = (e) => {
      const now = Date.now();
      if (now - last < 40) return;
      last = now;
      for (let i = 0; i < 3; i++) {
        const p = document.createElement("div");
        const size = Math.random() * 4 + 2;
        const col = ["#FFD700","#FF9FF3","#aaaaff","#fff"][Math.floor(Math.random()*4)];
        p.style.cssText = "position:fixed;pointer-events:none;z-index:99999;border-radius:50%;width:"+size+"px;height:"+size+"px;background:"+col+";box-shadow:0 0 4px "+col+";left:"+(e.clientX+(Math.random()-0.5)*8-size/2)+"px;top:"+(e.clientY-size/2)+"px;animation:glit 0.7s ease-out forwards;";
        p.style.setProperty("--tx",((Math.random()-0.5)*20)+"px");
        p.style.setProperty("--ty",(-(Math.random()*20+5))+"px");
        document.body.appendChild(p);
        setTimeout(()=>p.remove(),750);
      }
    };
    window.addEventListener("mousemove",onMove);
    return ()=>{ window.removeEventListener("mousemove",onMove); style.remove(); };
  },[color]);
  return null;
}
