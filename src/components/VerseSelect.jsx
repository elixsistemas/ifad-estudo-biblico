import * as React from "react";
const TOKEN = process.env.GATSBY_BIBLIA_TOKEN;

export default function VerseSelect({ book, chapter, value, onChange, id="verse" }) {
  const [max, setMax] = React.useState(0);

  React.useEffect(() => {
    let cancel=false;
    (async () => {
      try {
        const url = `https://www.abibliadigital.com.br/api/verses/acf/${book}/${chapter}`;
        const res = await fetch(url, { headers:{ Authorization:`Bearer ${TOKEN}` } });
        const data = await res.json();
        const count = Array.isArray(data?.verses) ? data.verses.length : (data?.chapter?.verses || 0);
        if (!cancel) setMax(count || 0);
      } catch { setMax(0); }
    })();
    return ()=>{ cancel=true; };
  }, [book, chapter]);

  if (!max) {
    return <input id={id} type="number" min="1" value={value} onChange={e=>onChange(e.target.value)} placeholder="—" />;
  }
  const items = Array.from({length:max}, (_,i)=>i+1);
  return (
    <select id={id} value={value || ""} onChange={e=>onChange(parseInt(e.target.value,10))}>
      <option value="">— (capítulo inteiro)</option>
      {items.map(n => <option key={n} value={n}>{n}</option>)}
    </select>
  );
}
