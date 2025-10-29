import * as React from "react";
import plan from "../../content/plan/plan.json";
import VersionSelect from "../components/VersionSelect";
import BookSelect from "../components/BookSelect";
import ChapterSelect from "../components/ChapterSelect";
import VerseSelect from "../components/VerseSelect";
const TOKEN = process.env.GATSBY_BIBLIA_TOKEN;

// ---------- helpers de fetch ----------
async function getJsonOrError(res){
  const t = await res.text();
  try {
    const j = t ? JSON.parse(t) : {};
    if (!res.ok) throw new Error(j?.msg || j?.message || `HTTP ${res.status}`);
    return j;
  } catch {
    if (!res.ok) throw new Error(t || `HTTP ${res.status}`);
    return {};
  }
}
async function fetchChapter({version,abbrev,chapter}) {
  const url = `https://www.abibliadigital.com.br/api/verses/${version}/${abbrev}/${chapter}`;
  const res = await fetch(url, { headers:{ Authorization:`Bearer ${TOKEN}`, Accept:"application/json" } });
  return getJsonOrError(res);
}
async function fetchVerse({version,abbrev,chapter,number}) {
  const url = `https://www.abibliadigital.com.br/api/verses/${version}/${abbrev}/${chapter}/${number}`;
  const res = await fetch(url, { headers:{ Authorization:`Bearer ${TOKEN}`, Accept:"application/json" } });
  return getJsonOrError(res);
}
async function fallback({abbrev,chapter,number}) {
  const ref = number ? `${abbrev}+${chapter}:${number}` : `${abbrev}+${chapter}`;
  let r = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=almeida`);
  const d = await r.json();
  if (d?.text) return { book:{name:"Fallback"}, chapter:`${chapter}`, number, text:d.text };
  if (Array.isArray(d?.verses))
    return { book:{name:"Fallback"}, chapter:{number:chapter}, verses:d.verses.map(v=>({number:v.verse,text:v.text})) };
  throw new Error("Fallback falhou");
}

// ---------- helpers de plano ----------
function dayIndex(dayId){ return plan.dias.findIndex(d => d.id === dayId); }
function dayByIndex(i){ return (i>=0 && i<plan.dias.length) ? plan.dias[i] : null; }
function parseRef(r){
  const [b,rest] = r.toLowerCase().split(" ");
  const [c,v] = (rest||"").split(":");
  return { book:b, chapter:Number(c||1), verse: v ? Number(v) : "" };
}
function seqDoPlano(dayId){
  const dia = plan.dias.find(d=>d.id===dayId);
  return dia ? dia.refs.map(parseRef) : null;
}

// ---------- URL helpers ----------
function readParams(){
  if (typeof window==="undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  return {
    version:(sp.get("version")||"acf"),
    book:(sp.get("book")||"jo").toLowerCase(),
    chapter:Number(sp.get("chapter")||3),
    verse: sp.get("verse") ? Number(sp.get("verse")) : "",
    day: sp.get("day") || "",
    i: sp.get("i") ? Number(sp.get("i")) : null
  };
}
function syncUrl({version,book,chapter,verse,day,i}){
  if (typeof window==="undefined") return;
  const p = new URLSearchParams({ version, book, chapter:String(chapter) });
  if (verse) p.set("verse", String(verse));
  if (day) p.set("day", day);
  if (i!==null && i!==undefined) p.set("i", String(i));
  window.history.replaceState({}, "", `/app/reader?${p.toString()}`);
}

// ---------- componente ----------
export default function Reader(){
  const init = readParams();
  const [version,setVersion] = React.useState(init.version || "acf");
  const [abbrev,setAbbrev]   = React.useState(init.book);
  const [chapter,setChapter] = React.useState(init.chapter);
  const [number,setNumber]   = React.useState(init.verse);
  const [day,setDay]         = React.useState(init.day);
  const [idx,setIdx]         = React.useState(init.i);

  const [loading,setLoading] = React.useState(false);
  const [error,setError]     = React.useState("");
  const [data,setData]       = React.useState(null);

  const seq = React.useMemo(()=> day ? seqDoPlano(day) : null, [day]);

  React.useEffect(() => {
  // se veio com parâmetros (book/day), já carrega
  if (typeof window !== "undefined") {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("book") || sp.get("day")) {
      fetchAndSet(); // usa version/abbrev/chapter/number atuais
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  async function fetchAndSet(v=version,b=abbrev,c=chapter,n=number){
    setLoading(true); setError(""); setData(null);
    try {
      const payload = n
        ? await fetchVerse({version:v,abbrev:b,chapter:c,number:n})
        : await fetchChapter({version:v,abbrev:b,chapter:c});
      setData(payload);
    } catch(err){
      const msg = String(err?.message||err);
      if (/401|403|token|authorized/i.test(msg)){
        try {
          const p2 = await fallback({abbrev:b,chapter:c,number:n});
          setData(p2);
          setError("Usando fonte pública (fallback).");
        } catch(e2){
          setError(`Falhou (ABD ${msg}) e fallback: ${e2.message}`);
        }
      } else setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function onBookChange(b){ setAbbrev(b); if (chapter>1) setChapter(1); }

  function goPlan(delta){
    if(!day) return;
    const iDay = dayIndex(day);
    if(iDay < 0) return;

    let s = seqDoPlano(day);
    let next = (idx ?? 0) + delta;

    if(next >= 0 && s && next < s.length){
      const r = s[next];
      setIdx(next); setAbbrev(r.book); setChapter(r.chapter); setNumber(r.verse||"");
      syncUrl({version,book:r.book,chapter:r.chapter,verse:r.verse||"",day,i:next});
      fetchAndSet(version, r.book, r.chapter, r.verse||"");
      return;
    }
    if(next >= (s?.length||0)){
      const nextDay = dayByIndex(iDay+1); if(!nextDay) return;
      const s2 = nextDay.refs.map(parseRef); const r = s2[0];
      setIdx(0); setAbbrev(r.book); setChapter(r.chapter); setNumber(r.verse||""); setDay(nextDay.id);
      syncUrl({version,book:r.book,chapter:r.chapter,verse:r.verse||"",day:nextDay.id,i:0});
      fetchAndSet(version, r.book, r.chapter, r.verse||"");
      return;
    }
    const prevDay = dayByIndex(iDay-1); if(!prevDay) return;
    const s3 = prevDay.refs.map(parseRef); const last = s3.length-1; const r = s3[last];
    setIdx(last); setAbbrev(r.book); setChapter(r.chapter); setNumber(r.verse||""); setDay(prevDay.id);
    syncUrl({version,book:r.book,chapter:r.chapter,verse:r.verse||"",day:prevDay.id,i:last});
    fetchAndSet(version, r.book, r.chapter, r.verse||"");
  }

  function concluirDiaEAvançar(){
    if(!day) return;
    try{
      const raw = localStorage.getItem("ifad_plan_read");
      const arr = raw ? JSON.parse(raw) : [];
      const set = new Set(arr); set.add(day);
      localStorage.setItem("ifad_plan_read", JSON.stringify([...set]));
      if(typeof window !== "undefined") window.dispatchEvent(new Event("plan:updated"));
    }catch{}
    goPlan(+1);
  }

  async function onSubmit(e){
    e.preventDefault();
    syncUrl({version,book:abbrev,chapter,verse:number,day,i:idx});
    fetchAndSet();
  }

  return (
    <div className="reader">
      <h1>Leitura</h1>

      <form onSubmit={onSubmit} className="form">
        <div className="controls">
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

        <div className="action">
          {seq ? (
            <>
              <div className="cta" style={{gap:8}}>
                <button className="btn outline" type="button" onClick={()=>goPlan(-1)} disabled={loading||(idx??0)<=0}>◀ Anterior (dia)</button>
                <button className="btn" type="submit" disabled={loading}>{loading?"Carregando...":"Ler"}</button>
                <button className="btn outline" type="button" onClick={()=>goPlan(1)} disabled={loading}>Próximo (dia) ▶</button>
              </div>
              <span className="note">Dia {day} • {(idx??0)+1}/{seq.length}</span>
              {(idx ?? 0) === (seq.length-1) && (
                <div style={{marginTop:8}}>
                  <button className="btn" type="button" onClick={concluirDiaEAvançar}>
                    Concluir dia e avançar ▶
                  </button>
                </div>
              )}
            </>
          ) : (
            <button className="btn" type="submit" disabled={loading}>{loading?"Carregando...":"Ler"}</button>
          )}
        </div>
      </form>

      {error && <p className="alert">{error}</p>}

      {data?.verses && (
        <section className="panel">
          <h2>{data.book?.name} {data.chapter?.number} ({version.toUpperCase()})</h2>
          <ol className="texto">
            {data.verses.map(v => (
              <li key={v.number}>
                <span className="n">{v.number}</span> {v.text}
              </li>
            ))}
          </ol>
        </section>
      )}

      {data?.text && data?.book && (
        <section className="panel">
          <h2>{data.book?.name} {data.chapter}:{data.number} ({version.toUpperCase()})</h2>
          <p className="texto"><span className="n">{data.number}</span> {data.text}</p>
        </section>
      )}
    </div>
  );
}
