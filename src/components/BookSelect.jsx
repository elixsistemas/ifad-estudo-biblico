import * as React from "react";

const BOOKS = [
  ["gn","Gênesis",50],["ex","Êxodo",40],["lv","Levítico",27],["nm","Números",36],["dt","Deuteronômio",34],
  ["js","Josué",24],["jz","Juízes",21],["rt","Rute",4],["1sm","1 Samuel",31],["2sm","2 Samuel",24],
  ["1rs","1 Reis",22],["2rs","2 Reis",25],["1cr","1 Crônicas",29],["2cr","2 Crônicas",36],["ed","Esdras",10],
  ["ne","Neemias",13],["et","Ester",10],["jó","Jó",42],["sl","Salmos",150],["pv","Provérbios",31],
  ["ec","Eclesiastes",12],["ct","Cantares",8],["is","Isaías",66],["jr","Jeremias",52],["lm","Lamentações",5],
  ["ez","Ezequiel",48],["dn","Daniel",12],["os","Oseias",14],["jl","Joel",3],["am","Amós",9],["ob","Obadias",1],
  ["jn","Jonas",4],["mq","Miqueias",7],["na","Naum",3],["hc","Habacuque",3],["sf","Sofonias",3],["ag","Ageu",2],
  ["zc","Zacarias",14],["ml","Malaquias",4],["mt","Mateus",28],["mc","Marcos",16],["lc","Lucas",24],["jo","João",21],
  ["at","Atos",28],["rm","Romanos",16],["1co","1 Coríntios",16],["2co","2 Coríntios",13],["gl","Gálatas",6],
  ["ef","Efésios",6],["fp","Filipenses",4],["cl","Colossenses",4],["1ts","1 Tessalonicenses",5],["2ts","2 Tessalonicenses",3],
  ["1tm","1 Timóteo",6],["2tm","2 Timóteo",4],["tt","Tito",3],["fm","Filemom",1],["hb","Hebreus",13],["tg","Tiago",5],
  ["1pe","1 Pedro",5],["2pe","2 Pedro",3],["1jo","1 João",5],["2jo","2 João",1],["3jo","3 João",1],["jd","Judas",1],["ap","Apocalipse",22],
];

export function chaptersOf(abbr){
  const it = BOOKS.find(b => b[0] === abbr.toLowerCase());
  return it ? it[2] : 1;
}

export default function BookSelect({ value, onChange, id="book" }) {
  return (
    <select id={id} value={value} onChange={e=>onChange(e.target.value)}>
      {BOOKS.map(([abbr, name]) => <option key={abbr} value={abbr}>{name}</option>)}
    </select>
  );
}
