import * as React from "react";
import plan from "../../content/plan/plan.json";
import { Link } from "gatsby";
import SiteHeader from "../components/SiteHeader";
import SEO from "../components/SEO";
export const Head = ({ location }) => <SEO pathname={location.pathname} />;

function readLidos() {
  try {
    const raw = localStorage.getItem("ifad_plan_read");
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

export default function Plano() {
  const [lidos, setLidos] = React.useState(new Set());

  React.useEffect(() => {
    const load = () => setLidos(readLidos());
    load();
    const onPlanUpdated = () => load();
    window.addEventListener("focus", load);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) load(); });
    window.addEventListener("plan:updated", onPlanUpdated);
    return () => {
      window.removeEventListener("focus", load);
      window.removeEventListener("plan:updated", onPlanUpdated);
    };
  }, []);

  const total = plan.dias.length;
  const done = lidos.size;
  const pct  = Math.round((done / total) * 100);

  return (
    <>
      <SiteHeader />
      <main className="container">
        <h1>Plano Anual</h1>

        <div className="progress">
          <div className="bar" style={{ width: `${pct}%` }} />
          <span className="label">{done}/{total} ({pct}%)</span>
        </div>

        <ul className="days">
          {plan.dias.map(d => {
            const isDone = lidos.has(d.id);
            return (
              <li key={d.id} style={{display:"flex", gap:8, alignItems:"center"}}>
                <Link to={`/plano/dia-${d.id}`} style={{flex:1}}>
                  Dia {d.id} — {d.refs.join(", ")}
                </Link>
                <span className={`pill ${isDone ? "ok" : ""}`}>{isDone ? "✓ lido" : "pendente"}</span>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
