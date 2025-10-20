import * as React from "react";
import { chaptersOf } from "./BookSelect";

export default function ChapterSelect({ book, value, onChange, id="chapter" }) {
  const max = chaptersOf(book);
  const items = Array.from({length:max}, (_,i)=>i+1);
  return (
    <select id={id} value={value} onChange={e=>onChange(parseInt(e.target.value,10))}>
      {items.map(n => <option key={n} value={n}>{n}</option>)}
    </select>
  );
}
