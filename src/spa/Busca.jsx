import * as React from "react";
import VersionSelect from "../components/VersionSelect";
const TOKEN = process.env.GATSBY_BIBLIA_TOKEN;

function stripAccents(s=""){ return s.normalize("NFD").replace(/[\u0300-\u036f]/g,""); }

async function tryBodies(bodies) {
  let lastErr=null;
  for (const body of bodies) {
    try {
      const res = await fetch("https://www.abibliadigital.com.br/api/verses/search", {
        method:"POST",
        headers:{ Authorization:`Bearer ${TOKEN}`, "Content-Type":"application/json", Accept:"application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { lastErr=new Error(`HTTP ${res.status}`); continue; }
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data?.verses || data?.results || []);
      return list;
    } catch(e){ lastErr=e; }
  }
  throw lastErr || new Error("Busca indisponível");
}

export default function Busca(){
  const [version,setVersion]=React.useState("acf");
  const [q,setQ]=React.useState("fé");
  const [loading,setLoading]=React.useState(false);
  const [error,setError]=React.useState("");
  const [items,setItems]=React.useState([]);

  async function onSubmit(e){
    e.preventDefault(); setLoading(true); setError(""); setItems([]);
    const q1=q.trim(), q2=stripAccents(q1);
    try{
      const results = await tryBodies([
        { q:q1, version }, { query:q1, version }, { search:q1, version },
        { q:q2, version }, { query:q2, version }, { search:q2, version },
      ]);
      setItems(results);
      if (!results?.length && q1!==q2) setError("Nenhum resultado com acentos; tente também sem acentos.");
    }catch(err){ setError(`Busca falhou (${err.message||err})`); }
    finally{ setLoading(false); }
  }

  return (
    <>
      <h1>Busca</h1>
      <form onSubmit={onSubmit} className="form">
        <div className="field">
          <label htmlFor="q">Termo</label>
          <input id="q" value={q} onChange={e=>setQ(e.target.value)} placeholder="ex.: fé, graça, amor" />
        </div>
        <div className="field">
          <label htmlFor="ver">Versão</label>
          <VersionSelect id="ver" value={version} onChange={setVersion} />
        </div>
        <button className="btn" disabled={loading} type="submit">{loading?"Buscando...":"Buscar"}</button>
      </form>

      {error && <p className="alert">{error}</p>}

      {items?.length>0 && (
        <ul className="results">
          {items.map((it,i)=>{
            const ref = it?.reference || (it?.book?.name && it?.chapter && it?.number ? `${it.book.name} ${it.chapter}:${it.number}` : `Resultado ${i+1}`);
            const text = it?.text || it?.content || it?.verse || JSON.stringify(it);
            return <li key={i}><strong>{ref}</strong> — {text}</li>;
          })}
        </ul>
      )}
    </>
  );
}
