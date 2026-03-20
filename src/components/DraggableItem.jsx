import { useState, useRef } from "react";
export function DraggableItem({ children, initialX = 100, initialY = 100, onMove, style = {} }) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const onMouseDown = (e) => {
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;
    e.preventDefault();
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    const onMove2 = (e2) => {
      if (!dragging.current) return;
      const nx = e2.clientX - offset.current.x;
      const ny = e2.clientY - offset.current.y;
      setPos({ x: nx, y: ny });
      onMove && onMove(nx, ny);
    };
    const onUp = () => { dragging.current = false; window.removeEventListener("mousemove", onMove2); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove2);
    window.addEventListener("mouseup", onUp);
  };
  return (
    <div onMouseDown={onMouseDown}
      style={{ position:"absolute", left:pos.x, top:pos.y, cursor:"grab", userSelect:"none", ...style }}>
      {children}
    </div>
  );
}
