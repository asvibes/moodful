export function AuroraBackground({ colors, style = {} }) {
  const [c1, c2, c3, c4] = colors || ["#333","#444","#555","#333"];
  return (
    <>
      <style>{`
        @keyframes aurora1 { 0%,100%{transform:translate(-20%,-20%) scale(1.4) rotate(0deg)} 50%{transform:translate(20%,10%) scale(1.6) rotate(180deg)} }
        @keyframes aurora2 { 0%,100%{transform:translate(20%,20%) scale(1.3) rotate(0deg)} 50%{transform:translate(-15%,-10%) scale(1.5) rotate(-120deg)} }
        @keyframes aurora3 { 0%,100%{transform:translate(0%,-30%) scale(1.5) rotate(0deg)} 50%{transform:translate(10%,20%) scale(1.2) rotate(90deg)} }
      `}</style>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit", ...style }}>
        <div style={{ position: "absolute", inset: 0, background: "#0a0a12" }} />
        <div style={{ position: "absolute", width: "80%", height: "80%", top: "10%", left: "10%",
          background: "radial-gradient(ellipse," + c1 + "60 0%,transparent 70%)",
          animation: "aurora1 8s ease-in-out infinite", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", width: "70%", height: "70%", top: "20%", left: "20%",
          background: "radial-gradient(ellipse," + c2 + "50 0%,transparent 70%)",
          animation: "aurora2 10s ease-in-out infinite", filter: "blur(35px)" }} />
        <div style={{ position: "absolute", width: "60%", height: "60%", top: "15%", left: "25%",
          background: "radial-gradient(ellipse," + c3 + "40 0%,transparent 70%)",
          animation: "aurora3 12s ease-in-out infinite", filter: "blur(30px)" }} />
      </div>
    </>
  );
}
