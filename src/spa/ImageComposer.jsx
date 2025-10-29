import * as React from "react";

const PRESETS = [
  { label: "Fundo neutro", value: "solid" },
  { label: "Fundo 1", value: "/backgrounds/bg1.jpg" },
  { label: "Fundo 2", value: "/backgrounds/bg2.jpg" },
];

export default function ImageComposer(){
  const canvasRef = React.useRef(null);
  const [text, setText] = React.useState("“Porque Deus amou o mundo...”");
  const [ref, setRef]   = React.useState("João 3:16");
  const [bg, setBg]     = React.useState("solid");
  const [color, setColor] = React.useState("#0a0f1a");
  const [fontColor, setFontColor] = React.useState("#ffffff");
  const [size, setSize] = React.useState(48);
  const [logo, setLogo] = React.useState(true);
  const W = 1080, H = 1080; // formato quadrado (Instagram)

  React.useEffect(() => {
    const c = canvasRef.current; if(!c) return;
    const ctx = c.getContext("2d");

    function draw(bgImg){
      // fundo
      if(bg === "solid" || !bgImg){
        ctx.fillStyle = color;
        ctx.fillRect(0,0,W,H);
      } else {
        // cover
        const r = Math.max(W/bgImg.width, H/bgImg.height);
        const nw = bgImg.width * r, nh = bgImg.height * r;
        const nx = (W - nw)/2, ny = (H - nh)/2;
        ctx.drawImage(bgImg, nx, ny, nw, nh);
        ctx.fillStyle = "rgba(0,0,0,.25)";
        ctx.fillRect(0,0,W,H); // overlay para contraste
      }

      // texto
      ctx.fillStyle = fontColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `700 ${size}px Inter, system-ui, sans-serif`;
      const margin = 80;
      wrapText(ctx, text, W/2, H/2 - 40, W - margin*2, size * 1.3);

      // referência
      ctx.font = `600 ${Math.max(28, size*0.5)}px Inter, system-ui, sans-serif`;
      ctx.globalAlpha = .95;
      ctx.fillText(ref, W/2, H - 80);
      ctx.globalAlpha = 1;

      // logo opcional (canto inferior direito)
      if(logo && window._ifadLogo){
        const L = 140; // tamanho do logo
        ctx.globalAlpha = .8;
        ctx.drawImage(window._ifadLogo, W - L - 36, H - L - 36, L, L);
        ctx.globalAlpha = 1;
      }
    }

    if(bg !== "solid"){
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => draw(img);
      img.src = bg;
    } else {
      draw(null);
    }
  }, [text, ref, bg, color, fontColor, size, logo]);

  // pre-carregar logo (opcional)
  React.useEffect(() => {
    const img = new Image();
    img.src = "/logo.png"; // coloque o logo em /static/logo.png
    img.onload = () => (window._ifadLogo = img);
  }, []);

  function download(){
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url; a.download = "versiculo.png"; a.click();
  }

  return (
    <div className="card">
      <div className="form">
        <div className="field">
          <label>Texto do versículo</label>
          <textarea rows={4} value={text} onChange={e=>setText(e.target.value)} />
        </div>
        <div className="field">
          <label>Referência</label>
          <input value={ref} onChange={e=>setRef(e.target.value)} />
        </div>
        <div className="field">
          <label>Fundo</label>
          <select value={bg} onChange={e=>setBg(e.target.value)}>
            {PRESETS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        {bg==="solid" &&
          <div className="field">
            <label>Cor do fundo</label>
            <input type="color" value={color} onChange={e=>setColor(e.target.value)} />
          </div>
        }
        <div className="field">
          <label>Cor do texto</label>
          <input type="color" value={fontColor} onChange={e=>setFontColor(e.target.value)} />
        </div>
        <div className="field">
          <label>Tamanho do texto: {size}px</label>
          <input type="range" min="28" max="72" value={size} onChange={e=>setSize(+e.target.value)} />
        </div>
        <label><input type="checkbox" checked={logo} onChange={e=>setLogo(e.target.checked)} /> Incluir logo</label>

        <button className="btn" onClick={download}>Baixar PNG</button>
      </div>

      <div style={{display:"grid",placeItems:"center", marginTop:16}}>
        <canvas ref={canvasRef} width={W} height={H} style={{maxWidth:"100%", borderRadius:12, border:"1px solid var(--line)"}} />
      </div>
    </div>
  );
}

// quebra de linha com largura máxima
function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  const words = text.split(" ");
  let line = "", lines = [], test;
  for (let n=0;n<words.length;n++){
    test = line + words[n] + " ";
    if (ctx.measureText(test).width > maxWidth && n>0){
      lines.push(line.trim());
      line = words[n] + " ";
    } else line = test;
  }
  lines.push(line.trim());
  const offset = (lines.length-1)*lineHeight/2;
  lines.forEach((l,i)=>ctx.fillText(l, x, y - offset + i*lineHeight));
}
