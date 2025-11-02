import * as React from "react";
const TOKEN = process.env.GATSBY_BIBLIA_TOKEN;

function uniqByAbbrev(list) {
  const seen = new Set(); const out = [];
  for (const v of list) {
    const key = (v.abbrev || "").toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({ abbrev: key, version: v.version || v.name || key.toUpperCase() });
  }
  return out;
}

export default function VersionSelect({ value, onChange, id="version" }) {
  const [items, setItems] = React.useState([
    { abbrev: "acf", version: "Almeida Corrigida Fiel" },
    { abbrev: "apee", version: "Louis Segond (francês)" },
    { abbrev: "bbe", version: "Bible in Basic English (inglês)" },
    { abbrev: "kjv", version: "King James Version (inglês)" },
    { abbrev: "nvi", version: "Nova Versão Internacional" },
    { abbrev: "ra",  version: "Almeida Revista e Atualizada" },
    { abbrev: "rvr", version: "Reina-Valera (espanhol)" },
  ]);

  React.useEffect(() => {
    let cancel=false;
    (async () => {
      try {
        const res = await fetch("https://www.abibliadigital.com.br/api/versions", {
          headers:{ Authorization:`Bearer ${TOKEN}`, Accept:"application/json" }
        });
        if (!res.ok) return;
        const data = await res.json();
        const api = Array.isArray(data) ? data : [];
        const apiList = api
          .filter(v => ((v.language||v.lang||"").toLowerCase().includes("port") || !(v.language||v.lang)))
          .map(v => ({ abbrev:(v.abbrev||"").toLowerCase(), version:v.version||v.name||v.abbrev }));
        const merged = uniqByAbbrev([...apiList, ...items]).sort((a,b)=>a.version.localeCompare(b.version,"pt-BR"));
        if (cancel) return;
        setItems(merged);
        const has = merged.some(v => v.abbrev === (value||"").toLowerCase());
        if (!has && merged.length && typeof onChange==="function") onChange(merged[0].abbrev);
      } catch {}
    })();
    return ()=>{ cancel=true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const has = items.some(v => v.abbrev === (value||"").toLowerCase());
    if (!has && items.length && typeof onChange==="function") onChange(items[0].abbrev);
  }, [items, value, onChange]);

  return (
    <select id={id} value={value} onChange={e=>onChange(e.target.value)}>
      {items.map(v => <option key={v.abbrev} value={v.abbrev}>{v.version} ({v.abbrev})</option>)}
    </select>
  );
}
