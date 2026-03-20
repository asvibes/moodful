import { useEffect } from "react";
export function GlitterCursor({ color }) {
  useEffect(() => {
    const particles = [];
    const colors = [color || "#fff", "#FFD700", "#FF69B4", "#00FFFF", "#fff"];
    const onMove = (e) => {
      for (let i = 0; i < 4; i++) {
        const p = document.createElement("div");
        const size = Math.random() * 8 + 4;
        const tx = (Math.random() - 0.5) * 80;
        const ty = (Math.random() - 0.5) * 80;
        const col = colors[Math.floor(Math.random() * colors.length)];
        p.style.cssText = "position:fixed;pointer-events:none;z-index:9999;border-radius:50%;background:" + col + ";box-shadow:0 0 6px " + col + ";width:" + size + "px;height:" + size + "px;left:" + (e.clientX - size/2) + "px;top:" + (e.clientY - size/2) + "px;transition:all 0.8s ease-out;opacity:1;";
        document.body.appendChild(p);
        particles.push(p);
        requestAnimationFrame(() => {
          p.style.transform = "translate(" + tx + "px," + ty + "px) scale(0)";
          p.style.opacity = "0";
        });
        setTimeout(() => { p.remove(); }, 900);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [color]);
  return null;
}
