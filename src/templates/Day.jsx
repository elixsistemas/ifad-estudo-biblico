import * as React from "react";
import { Link } from "gatsby";
import SiteHeader from "../components/SiteHeader";
import plan from "../../content/plan/plan.json";

function toQueryFromRef(r, dayId, index) {
  const clean = r.trim().toLowerCase().replace(/\s+/g, " ");
  const [livro, resto] = clean.split(" ");
  const [cap, vers] = (resto || "").split(":");
  const p = new URLSearchParams({ version:"acf", book:livro, chapter:cap||"1", day:dayId, i:String(index) });
  if (vers) p.set("verse", vers);
  return `/app/reader?${p.toString()}`;
}

function getSiblings(dayId){
  const i = plan.dias.findIndex(d => d.id === dayId);
  return {
    prev: i>0 ? plan.dias[i-1].id : null,
    next: i<plan.dias.length-1 ? plan.dias[i+1].id : null,
  };
}

export default function Day({ pageContext: { id, refs, titulo } }) {
  const first = refs[0];
  const [lido, setLido] = React.useState(false);
  const sib = getSiblings(id);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("ifad_plan_read");
      const set = raw ? new Set(JSON.parse(raw)) : new Set();
      setLido(set.has(id));
    } catch { setLido(false); }
  }, [id]);

  function toggleLido() {
    try {
      const raw = localStorage.getItem("ifad_plan_read");
      const arr = raw ? JSON.parse(raw) : [];
      const set = new Set(arr);
      if (set.has(id)) set.delete(id); else set.add(id);
      localStorage.setItem("ifad_plan_read", JSON.stringify([...set]));
      setLido(set.has(id));
      if (typeof window !== "undefined") window.dispatchEvent(new Event("plan:updated"));
    } catch {}
  }

  function concluirEDepoisIr(){
    toggleLido();
    if (sib.next && typeof window !== "undefined") {
      window.location.assign(`/plano/dia-${sib.next}`);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="container">
        <nav className="breadcrumbs">
          <Link to="/plano">{(titulo || "Plano Anual").replace("(AT+NT diário)","")}</Link> <span>›</span> <strong>Dia {id}</strong>
        </nav>

        <h1>Dia {id}</h1>
        <p><strong>Referências:</strong> {refs.join(", ")}</p>

        <div className="cta" style={{gap:12,flexWrap:"wrap"}}>
          <Link className="btn" to={toQueryFromRef(first, id, 0)}>Ler agora</Link>
          {refs.map((r, idx) => (
            <Link key={r} className="btn outline" to={toQueryFromRef(r, id, idx)}>Abrir {r}</Link>
          ))}
          {sib.prev && <Link className="btn outline" to={`/plano/dia-${sib.prev}`}>◀ Dia {sib.prev}</Link>}
          {sib.next && <Link className="btn outline" to={`/plano/dia-${sib.next}`}>Dia {sib.next} ▶</Link>}

          <button className={`btn ${lido ? "" : "outline"}`} onClick={toggleLido}>
            {lido ? "✓ Marcado como lido" : "Marcar como lido"}
          </button>
          {sib.next && (
            <button className="btn" onClick={concluirEDepoisIr}>
              Concluir dia e ir para o próximo ▶
            </button>
          )}
        </div>
      </main>
    </>
  );
}
