import * as React from "react";
import plan from "../../content/plan/plan.json";
import VersionSelect from "../components/VersionSelect";
import BookSelect from "../components/BookSelect";
import ChapterSelect from "../components/ChapterSelect";
import VerseSelect from "../components/VerseSelect";
import { Link } from "gatsby";

const TOKEN = process.env.GATSBY_BIBLIA_TOKEN;
const DEFAULT_VERSION = "acf";

// ---------- fetch helpers ----------
async function getJsonOrError(res){
  const t = await res.text();
  try{
    const j = t ? JSON.parse(t) : {};
    if(!res.ok) throw new Error(j?.msg || j?.message || `HTTP ${res.status}`);
    return j;
  }catch{
    if(!res.ok) throw new Error(t || `HTTP ${res.status}`);
    return {};
  }
}
async function fetchChapter({version,abbrev,chapter}){
  const url=`https://www.abibliadigital.com.br/api/verses/${version}/${abbrev}/${chapter}`;
  const res=await fetch(url,{headers:{Authorization:`Bearer ${TOKEN}`,Accept:"application/json"}});
  return getJsonOrError(res);
}
async function fetchVerse({version,abbrev,chapter,number}){
  const url=`https://www.abibliadigital.com.br/api/verses/${version}/${abbrev}/${chapter}/${number}`;
  const res=await fetch(url,{headers:{Authorization:`Bearer ${TOKEN}`,Accept:"application/json"}});
  return getJsonOrError(res);
}
async function fallback({abbrev,chapter,number}){
  const ref=number?`${abbrev}+${chapter}:${number}`:`${abbrev}+${chapter}`;
  let r=await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=almeida`);
  const d=await r.json();
  if(d?.text) return {book:{name:abbrev.toUpperCase()},chapter:`${chapter}`,number,text:d.text};
  if(Array.isArray(d?.verses))
    return {book:{name:abbrev.toUpperCase()},chapter:{number:chapter},verses:d.verses.map(v=>({number:v.verse,text:v.text}))};
  throw new Error("Fallback falhou");
}

// ---------- plano helpers ----------
function dayIndex(dayId){ return plan.dias.findIndex(d => d.id === dayId); }
function dayByIndex(i){ return (i>=0 && i<plan.dias.length) ? plan.dias[i] : null; }
function parseRef(r){ const [b,rest]=r.toLowerCase().split(" "); const [c,v]=(rest||"").split(":"); return { book:b, chapter:Number(c||1), verse: v?Number(v):"" }; }
function seqDoPlano(dayId){ const dia = plan.dias.find(d=>d.id===dayId); return dia ? dia.refs.map(parseRef) : null; }

// items lidos do dia (bolinha)
const STORAGE_ITEMS = "ifad_plan_read_items";
function getReadSet(dayId){
  try { const all = JSON.parse(localStorage.getItem(STORAGE_ITEMS) || "{}"); return new Set(all[dayId] || []); }
  catch { return new Set(); }
}
function saveReadSet(dayId, set){
  try { const all = JSON.parse(localStorage.getItem(STORAGE_ITEMS) || "{}"); all[dayId] = [...set]; localStorage.setItem(STORAGE_ITEMS, JSON.stringify(all)); }
  catch {}
}

// dia concluído (progress bar do plano anual)
function markDayDone(dayId){
  try{
    const raw = localStorage.getItem("ifad_plan_read");
    const arr = raw ? JSON.parse(raw) : [];
    const set = new Set(arr); set.add(dayId);
    localStorage.setItem("ifad_plan_read", JSON.stringify([...set]));
    window.dispatchEvent(new Event("plan:updated"));
  }catch{}
}

// ---------- URL helpers ----------
function readParams(){
  if(typeof window==="undefined") return {};
  const sp=new URLSearchParams(window.location.search);
  return {
    version:(sp.get("version")||DEFAULT_VERSION),
    book:(sp.get("book")||"jo").toLowerCase(),
    chapter:Number(sp.get("chapter")||3),
    verse:sp.get("verse")?Number(sp.get("verse")):"",
    day:sp.get("day")||"",
    i:sp.get("i")?Number(sp.get("i")):null
  };
}
function syncUrl({version,book,chapter,verse,day,i}){
  if(typeof window==="undefined") return;
  const p=new URLSearchParams({version,book,chapter:String(chapter)});
  if(verse) p.set("verse",String(verse));
  if(day) p.set("day",day);
  if(i!==null && i!==undefined) p.set("i",String(i));
  window.history.replaceState({}, "", `/app/reader?${p.toString()}`);
}

// ---------- componente ----------
export default function Reader(){
  const init=readParams();
  const [version,setVersion]=React.useState(init.version || DEFAULT_VERSION);
  const [abbrev,setAbbrev]=React.useState(init.book);
  const [chapter,setChapter]=React.useState(init.chapter);
  const [number,setNumber]=React.useState(init.verse);
  const [day,setDay]=React.useState(init.day);
  const [idx,setIdx]=React.useState(init.i);

  const [loading,setLoading]=React.useState(false);
  const [error,setError]=React.useState("");
  const [data,setData]=React.useState(null);

  // modo imersivo se vier de um dia do plano
  const planMode = Boolean(day);
  const seq = React.useMemo(()=> day? seqDoPlano(day): null,[day]);

  // tamanho de fonte (somente modo plano)
  const [font, setFont] = React.useState(() => {
    if (typeof localStorage === "undefined") return 20;
    const v = Number(localStorage.getItem("ifad_font") || 20);
    return Math.min(Math.max(v, 16), 28);
  });
  React.useEffect(()=>{ try{ localStorage.setItem("ifad_font", String(font)); }catch{} }, [font]);

  React.useEffect(()=>{ syncUrl({version,book:abbrev,chapter,verse:number,day,i:idx}); },[]);

  async function fetchAndSet(v=version,b=abbrev,c=chapter,n=number){
    setLoading(true); setError(""); setData(null);
    try {
      const payload = n? await fetchVerse({version:v,abbrev:b,chapter:c,number:n})
                       : await fetchChapter({version:v,abbrev:b,chapter:c});
      setData(payload);
    } catch(err){
      const msg=String(err?.message||err);
      if(/401|403|token|authorized/i.test(msg)){
        try{ const p2=await fallback({abbrev:b,chapter:c,number:n}); setData(p2); setError("Usando fonte pública (fallback)."); }
        catch(e2){ setError(`Falhou (ABD ${msg}) e fallback: ${e2.message}`); }
      } else setError(msg);
    } finally { setLoading(false); }
  }

  function onBookChange(b){ setAbbrev(b); if (chapter>1) setChapter(1); }

  function goPlan(delta){
    if(!day) return;
    const iDay = dayIndex(day);
    if(iDay < 0) return;

    const s = seqDoPlano(day);
    let next = (idx ?? 0) + delta;

    if(next >= 0 && s && next < s.length){
      const r = s[next];
      setIdx(next); setAbbrev(r.book); setChapter(r.chapter); setNumber(r.verse||"");
      syncUrl({version,book:r.book,chapter:r.chapter,verse:r.verse||"",day,i:next});
      fetchAndSet(version, r.book, r.chapter, r.verse||"");
      return;
    }
    if(next >= (s?.length||0)){
      // dia concluído
      markDayDone(day);
      return;
    }
    // anterior fora do índice? ignora
  }

  // marca o trecho atual como lido e avança
  function concluirTrecho(){
    if(!day) return;
    const s = getReadSet(day);
    const pos = idx ?? 0;
    s.add(pos);
    saveReadSet(day, s);
    // se todos os itens do dia foram lidos, conclui o dia
    const total = seq?.length || 1;
    if (s.size >= total) markDayDone(day);
    goPlan(+1);
  }

  // auto-carregar no modo plano
  React.useEffect(() => {
    if (planMode) fetchAndSet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planMode]);

  async function onSubmit(e){ e.preventDefault(); syncUrl({version,book:abbrev,chapter,verse:number,day,i:idx}); fetchAndSet(); }

  // —————————— RENDER ——————————
  if (planMode){
    const progressTxt = `Dia ${String(day).padStart(3,"0")} • ${(idx??0)+1} de ${seq?.length||1}`;
    const chipBook = data?.book?.name ? `${data.book.name} ${data?.chapter?.number || chapter}` : `${abbrev.toUpperCase()} ${chapter}`;
    return (
      <>
        <div className="focus-top container">
          <Link className="top-btn" to={`/plano/dia-${day}`} aria-label="Voltar">‹</Link>
          <div className="chips">
            <span className="chip">{chipBook}</span>
            <span className="chip">{version.toUpperCase()}</span>
          </div>
          <div className="top-actions" aria-label="Tamanho da fonte">
            <button onClick={()=>setFont(f=>Math.max(16,f-2))} className="top-btn">A−</button>
            <button onClick={()=>setFont(f=>Math.min(28,f+2))} className="top-btn">A+</button>
          </div>
        </div>

        <main className="container">
          {error && <p className="alert">{error}</p>}

          {loading && <p className="note">Carregando…</p>}

          {data?.verses && (
            <article className="reading" style={{ fontSize: `${font}px` }}>
              <h2 style={{ margin: "8px 0 12px" }}>
                {data.book?.name} {data.chapter?.number}
              </h2>
              <ol className="texto">
                {data.verses.map(v => (
                  <li key={v.number}><span className="n">{v.number}</span> {v.text}</li>
                ))}
              </ol>
            </article>
          )}
          {data?.text && data?.book && (
            <article className="reading" style={{ fontSize: `${font}px` }}>
              <h2 style={{ margin: "8px 0 12px" }}>
                {data.book?.name} {data.chapter}:{data.number}
              </h2>
              <p className="texto"><span className="n">{data.number}</span> {data.text}</p>
            </article>
          )}
        </main>

        <div className="focus-bottom">
          <div className="container">
            <div className="progress-mini">{progressTxt}</div>
            <button className="btn" onClick={concluirTrecho}>Concluir leitura</button>
          </div>
        </div>
      </>
    );
  }

  // Modo “livre” (com formulário) — permanece como estava
  return (
    <>
      <h1>Leitura</h1>

      <form onSubmit={onSubmit} className="form">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"10px"}}>
          <div className="field">
            <label htmlFor="version">Versão</label>
            <VersionSelect id="version" value={version} onChange={setVersion} />
          </div>
          <div className="field">
            <label htmlFor="book">Livro</label>
            <BookSelect id="book" value={abbrev} onChange={onBookChange} />
          </div>
          <div className="field">
            <label htmlFor="chapter">Capítulo</label>
            <ChapterSelect id="chapter" book={abbrev} value={chapter} onChange={setChapter} />
          </div>
          <div className="field">
            <label htmlFor="verse">Verso (opcional)</label>
            <VerseSelect id="verse" book={abbrev} chapter={chapter} value={number} onChange={setNumber} />
          </div>
        </div>

        <div className="cta" style={{gap:8,flexWrap:"wrap"}}>
          <button className="btn" type="submit" disabled={loading}>{loading?"Carregando...":"Ler"}</button>
        </div>
      </form>

      {error && <p className="alert">{error}</p>}

      {data?.verses && (<>
        <h2>{data.book?.name} {data.chapter?.number} ({version.toUpperCase()})</h2>
        <ol className="texto">{data.verses.map(v=><li key={v.number}><span className="n">{v.number}</span> {v.text}</li>)}</ol>
      </>)}
      {data?.text && data?.book && (<>
        <h2>{data.book?.name} {data.chapter}:{data.number} ({version.toUpperCase()})</h2>
        <p className="texto"><span className="n">{data.number}</span> {data.text}</p>
      </>)}
    </>
  );
}
