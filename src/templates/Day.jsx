import * as React from "react";
import { Link } from "gatsby";
import plan from "../../content/plan/plan.json";
import SiteHeader from "../components/SiteHeader";
import SEO from "../components/SEO";
export const Head = ({ location }) => <SEO pathname={location.pathname} />;

// Parse "GN 1:1" -> { book, chapter, verse? }
function parseRef(r) {
  const [b, rest] = r.toLowerCase().split(" ");
  const [c, v] = (rest || "").split(":");
  return { book: b, chapter: Number(c || 1), verse: v ? Number(v) : "" };
}

export default function Day({ pageContext }) {
  const { id } = pageContext; // passado no gatsby-node
  const idx = plan.dias.findIndex(d => d.id === id);
  const dia = plan.dias[idx];
  const prev = plan.dias[idx - 1];
  const next = plan.dias[idx + 1];

  // checklist por dia: itens lidos (0..n-1)
  const [ticks, setTicks] = React.useState(new Set());
  // status do dia no plano
  const [isDone, setIsDone] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(`ifad_day_${id}`);
      setTicks(new Set(raw ? JSON.parse(raw) : []));
    } catch {}
    try {
      const raw = localStorage.getItem("ifad_plan_read");
      const s = new Set(raw ? JSON.parse(raw) : []);
      setIsDone(s.has(id));
    } catch {}
  }, [id]);

  function toggleTick(k) {
    setTicks(curr => {
      const n = new Set(curr);
      n.has(k) ? n.delete(k) : n.add(k);
      try { localStorage.setItem(`ifad_day_${id}`, JSON.stringify([...n])); } catch {}
      return n;
    });
  }

  function concluirDia() {
    try {
      const raw = localStorage.getItem("ifad_plan_read");
      const s = new Set(raw ? JSON.parse(raw) : []);
      s.add(id);
      localStorage.setItem("ifad_plan_read", JSON.stringify([...s]));
      window.dispatchEvent(new Event("plan:updated"));
      setIsDone(true);
    } catch {}
  }

  function readerHref(i) {
    const r = parseRef(dia.refs[i]);
    const q = new URLSearchParams({
      version: "acf",
      book: r.book,
      chapter: String(r.chapter),
      day: String(id),
      i: String(i),
    });
    if (r.verse) q.set("verse", String(r.verse));
    return `/app/reader?${q.toString()}`;
  }

  // chips de navegação: mostra 5 dias ao redor (n-2..n+2)
  const chips = [];
  for (let off = -2; off <= 2; off++) {
    const d = plan.dias[idx + off];
    if (d) chips.push(d);
  }

  const total = plan.dias.length;

  return (
    <>
      <SiteHeader />
      <main className="container dayfocus">
        <header className="day-hero card">
          <div className="day-hero__top">
            <div className="breadcrumbs">
              <Link to="/plano">Plano anual</Link> · Dia {id} de {total}
            </div>
            {isDone && <span className="chip ok">Em dia!</span>}
          </div>

          <h1>Leituras de hoje</h1>

          {/* chips com dias próximos */}
          <div className="chips-wrap">
            <div className="chips-scroll">
              {chips.map(d => {
                const current = d.id === id;
                return (
                  <Link
                    key={d.id}
                    to={`/plano/dia-${d.id}`}
                    className={`chip-day ${current ? "is-current" : ""}`}
                  >
                    <div className="chip-day__num">{d.id}</div>
                    <div className="chip-day__sub">dia</div>
                    {current && <div className="check">✓</div>}
                  </Link>
                );
              })}
            </div>
          </div>
        </header>

        {/* lista de passagens do dia */}
        <section className="reading card">
          <ul className="reading-list">
            {dia.refs.map((ref, i) => {
              const done = ticks.has(i);
              return (
                <li
                  key={i}
                  className={`reading-item ${done ? "is-done" : ""}`}
                  onClick={() => toggleTick(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleTick(i);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={done}
                >
                  <span className="circle" aria-hidden />
                  <span className="reading-text">{ref}</span>
                  <Link
                    className="go"
                    to={readerHref(i)}
                    aria-label={`Ler ${ref}`}
                    onClick={(e) => e.stopPropagation()} // não marcar quando clicar na seta
                  >
                    ›
                  </Link>
                </li>

              );
            })}
          </ul>
        </section>

        {/* navegação de dias + CTA */}
        <nav className="day-actions">
          <div className="side-nav">
            {prev ? <Link className="btn outline" to={`/plano/dia-${prev.id}`}>◀ Dia {prev.id}</Link> : <span />}
            {next ? <Link className="btn outline" to={`/plano/dia-${next.id}`}>Dia {next.id} ▶</Link> : <span />}
          </div>

          <div className="sticky-cta">
            {!isDone ? (
              <button className="btn big" onClick={concluirDia}>Concluir dia</button>
            ) : (
              next ? <Link className="btn big" to={`/plano/dia-${next.id}`}>Começar a leitura do próximo</Link>
                   : <Link className="btn big" to="/plano">Ver resumo do plano</Link>
            )}
          </div>
        </nav>
      </main>
    </>
  );
}
