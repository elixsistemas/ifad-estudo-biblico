import * as React from "react";
import { Link } from "gatsby";
import plan from "../../content/plan/plan.json";
import SiteHeader from "../components/SiteHeader";
import Seo from "../components/SEO";
export const Head = ({ location }) => <Seo pathname={location.pathname} />;

function readLidos() {
  try {
    const raw = localStorage.getItem("ifad_plan_read");
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

function nextUnreadDayId(lidos) {
  const d = plan.dias.find(d => !lidos.has(d.id));
  return d?.id || plan.dias[0]?.id;
}

function WeekGroup({ startIdx, dias, lidos }) {
  return (
    <section className="week">
      <header className="week__title">Semana {Math.floor(startIdx / 7) + 1}</header>
      <ul className="week__list">
        {dias.map(d => {
          const done = lidos.has(d.id);
          return (
            <li key={d.id} className={`daycard ${done ? "is-done" : ""}`}>
              <div className="daycard__left">
                <span className="daycard__num">Dia {String(d.id).padStart(3, "0")}</span>
                <span className="daycard__refs">{d.refs.join(", ").toUpperCase()}</span>
              </div>
              <div className="daycard__right">
                <span className={`chip ${done ? "ok" : ""}`}>{done ? "lido" : "pendente"}</span>
                <Link className="btn slim" to={`/plano/dia-${d.id}`}>Ler</Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function Plano() {
  const [lidos, setLidos] = React.useState(new Set());

  React.useEffect(() => {
    const load = () => setLidos(readLidos());
    load();
    const onPlanUpdated = () => load();
    const onVis = () => { if (!document.hidden) load(); };
    window.addEventListener("focus", load);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("plan:updated", onPlanUpdated);
    return () => {
      window.removeEventListener("focus", load);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("plan:updated", onPlanUpdated);
    };
  }, []);

  const total = plan.dias.length;
  const done = lidos.size;
  const pct  = Math.round((done / total) * 100);
  const continuar = nextUnreadDayId(lidos);

  // agrupa em semanas (7 em 7)
  const semanas = [];
  for (let i = 0; i < plan.dias.length; i += 7) {
    semanas.push({ startIdx: i, dias: plan.dias.slice(i, i + 7) });
  }

  return (
    <>
      <SiteHeader />
      <main className="container">
        <div className="plan-hero card">
          <div>
            <h1>Plano Anual</h1>
            <p className="muted">{done}/{total} dias • {pct}% concluído</p>
            <div className="progress">
              <div className="bar" style={{ width: `${pct}%` }} />
              <div className="label">{pct}%</div>
            </div>
            <div className="cta">
              <Link className="btn" to={`/plano/dia-${continuar}`}>Continuar de onde parei</Link>
              <Link className="btn outline" to="/app/reader">Abrir leitor</Link>
            </div>
          </div>
        </div>

        <nav className="tabs plan-tabs">
          <span className="pill">Visão geral</span>
          <span className="pill">{done} lidos</span>
          <span className="pill">{total - done} pendentes</span>
        </nav>

        <div className="weeks">
          {semanas.map(w => (
            <WeekGroup key={w.startIdx} startIdx={w.startIdx} dias={w.dias} lidos={lidos} />
          ))}
        </div>
      </main>
    </>
  );
}
