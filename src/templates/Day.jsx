import * as React from "react";
import { Link } from "gatsby";
import SiteHeader from "../components/SiteHeader";
import SEO from "../components/SEO";
export const Head = ({ location }) => <SEO pathname={location.pathname} />;

const DEFAULT_VERSION = "acf";

// "GN 5" -> { book: "gn", chapter: 5, verse: "" }
function parseRef(r) {
  const [b, rest] = r.toLowerCase().split(" ");
  const [c, v] = (rest || "").split(":");
  return { book: b, chapter: Number(c || 1), verse: v ? Number(v) : "" };
}

// storage por item lido (bolinhas)
const STORAGE_ITEMS = "ifad_plan_read_items";
function getReadSet(dayId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_ITEMS) || "{}");
    return new Set(all[dayId] || []);
  } catch {
    return new Set();
  }
}
function saveReadSet(dayId, set) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_ITEMS) || "{}");
    all[dayId] = [...set];
    localStorage.setItem(STORAGE_ITEMS, JSON.stringify(all));
  } catch {}
}

// opcional: marca o dia como concluído quando todos os itens estão lidos
function markDayDone(dayId) {
  try {
    const raw = localStorage.getItem("ifad_plan_read");
    const arr = raw ? JSON.parse(raw) : [];
    const set = new Set(arr);
    set.add(dayId);
    localStorage.setItem("ifad_plan_read", JSON.stringify([...set]));
    window.dispatchEvent(new Event("plan:updated"));
  } catch {}
}

export default function Day({ pageContext }) {
  const { id: dayId, refs = [] } = pageContext;

  const [readSet, setReadSet] = React.useState(new Set());

  React.useEffect(() => {
    setReadSet(getReadSet(dayId));
  }, [dayId]);

  function toggle(idx) {
    const s = getReadSet(dayId);
    if (s.has(idx)) s.delete(idx);
    else s.add(idx);
    saveReadSet(dayId, s);
    setReadSet(new Set(s));
    if (s.size === refs.length) markDayDone(dayId);
  }

  function readerUrl(ref, idx) {
    const { book, chapter, verse } = parseRef(ref);
    const params = new URLSearchParams({
      version: DEFAULT_VERSION,
      book,
      chapter: String(chapter),
      day: String(dayId),
      i: String(idx),
    });
    if (verse) params.set("verse", String(verse));
    return `/app/reader?${params.toString()}`;
  }

  return (
    <>
      <SiteHeader />
      <main className="container">
        <div className="card" style={{ padding: 18, marginBottom: 14 }}>
          <div className="muted pill" style={{ display: "inline-block" }}>
            Plano anual • Dia {String(dayId).padStart(3, "0")} de 365
          </div>
          <h1 style={{ marginTop: 6 }}>Leituras de hoje</h1>
        </div>

        <ul className="readings">
          {refs.map((ref, idx) => {
            const done = readSet.has(idx);
            return (
              <li className="reading-row" key={idx}>
                {/* link invisível cobrindo toda a linha */}
                <Link className="row-link" to={readerUrl(ref, idx)} aria-label={`Abrir ${ref}`} />

                {/* bolinha: só ela marca/desmarca; não navega */}
                <button
                  type="button"
                  className={`dot ${done ? "on" : ""}`}
                  aria-label={done ? `Desmarcar ${ref}` : `Marcar ${ref} como lido`}
                  aria-pressed={done}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle(idx);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      toggle(idx);
                    }
                  }}
                />

                <span className="label">{ref}</span>
                <span className="chev" aria-hidden>›</span>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
