export function AuroraBackground({ colors, style = {} }) {
  const [c1, c2, c3] = colors || ["#333","#444","#555"];
  return (
    <>
      <style>{`
        @keyframes a1{0%,100%{transform:translate(-20%,-20%) scale(1.4) rotate(0deg)}50%{transform:translate(20%,10%) scale(1.8) rotate(180deg)}}
        @keyframes a2{0%,100%{transform:translate(20%,20%) scale(1.3) rotate(0deg)}50%{transform:translate(-15%,-10%) scale(1.6) rotate(-120deg)}}
        @keyframes a3{0%,100%{transform:translate(0,-30%) scale(1.5) rotate(0deg)}50%{transform:translate(10%,20%) scale(1.3) rotate(90deg)}}
      `}</style>
      <div style={{ position:"absolute", inset:0, overflow:"hidden", borderRadius:"inherit", ...style }}>
        <div style={{ position:"absolute", inset:0, background:"#080810" }} />
        <div style={{ position:"absolute", width:"90%", height:"90%", top:"5%", left:"5%", background:"radial-gradient(ellipse,"+c1+"70 0%,transparent 65%)", animation:"a1 9s ease-in-out infinite", filter:"blur(50px)" }} />
        <div style={{ position:"absolute", width:"75%", height:"75%", top:"15%", left:"15%", background:"radial-gradient(ellipse,"+c2+"55 0%,transparent 65%)", animation:"a2 12s ease-in-out infinite", filter:"blur(40px)" }} />
        <div style={{ position:"absolute", width:"60%", height:"60%", top:"20%", left:"20%", background:"radial-gradient(ellipse,"+c3+"45 0%,transparent 65%)", animation:"a3 15s ease-in-out infinite", filter:"blur(35px)" }} />
      </div>
    </>
  );
}
