// Gera content/plan/plan.json com 365 dias
// Modos: "cover" (capa-a-capa) | "otnt" (2 caps AT + 1 cap NT)
const fs = require("fs");
const path = require("path");

// Tabela essencial: abreviação PT-BR + nº de capítulos (ACF/ARA padrão)
const BOOKS = [
  { abbr: "gn", name: "Gênesis", ch: 50 },
  { abbr: "ex", name: "Êxodo", ch: 40 },
  { abbr: "lv", name: "Levítico", ch: 27 },
  { abbr: "nm", name: "Números", ch: 36 },
  { abbr: "dt", name: "Deuteronômio", ch: 34 },
  { abbr: "js", name: "Josué", ch: 24 },
  { abbr: "jz", name: "Juízes", ch: 21 },
  { abbr: "rt", name: "Rute", ch: 4 },
  { abbr: "1sm", name: "1 Samuel", ch: 31 },
  { abbr: "2sm", name: "2 Samuel", ch: 24 },
  { abbr: "1rs", name: "1 Reis", ch: 22 },
  { abbr: "2rs", name: "2 Reis", ch: 25 },
  { abbr: "1cr", name: "1 Crônicas", ch: 29 },
  { abbr: "2cr", name: "2 Crônicas", ch: 36 },
  { abbr: "ed", name: "Esdras", ch: 10 },
  { abbr: "ne", name: "Neemias", ch: 13 },
  { abbr: "et", name: "Ester", ch: 10 },
  { abbr: "jó", name: "Jó", ch: 42 },
  { abbr: "sl", name: "Salmos", ch: 150 },
  { abbr: "pv", name: "Provérbios", ch: 31 },
  { abbr: "ec", name: "Eclesiastes", ch: 12 },
  { abbr: "ct", name: "Cantares", ch: 8 },
  { abbr: "is", name: "Isaías", ch: 66 },
  { abbr: "jr", name: "Jeremias", ch: 52 },
  { abbr: "lm", name: "Lamentações", ch: 5 },
  { abbr: "ez", name: "Ezequiel", ch: 48 },
  { abbr: "dn", name: "Daniel", ch: 12 },
  { abbr: "os", name: "Oseias", ch: 14 },
  { abbr: "jl", name: "Joel", ch: 3 },
  { abbr: "am", name: "Amós", ch: 9 },
  { abbr: "ob", name: "Obadias", ch: 1 },
  { abbr: "jn", name: "Jonas", ch: 4 },
  { abbr: "mq", name: "Miqueias", ch: 7 },
  { abbr: "na", name: "Naum", ch: 3 },
  { abbr: "hc", name: "Habacuque", ch: 3 },
  { abbr: "sf", name: "Sofonias", ch: 3 },
  { abbr: "ag", name: "Ageu", ch: 2 },
  { abbr: "zc", name: "Zacarias", ch: 14 },
  { abbr: "ml", name: "Malaquias", ch: 4 },

  // Novo Testamento
  { abbr: "mt", name: "Mateus", ch: 28 },
  { abbr: "mc", name: "Marcos", ch: 16 },
  { abbr: "lc", name: "Lucas", ch: 24 },
  { abbr: "jo", name: "João", ch: 21 },
  { abbr: "at", name: "Atos", ch: 28 },
  { abbr: "rm", name: "Romanos", ch: 16 },
  { abbr: "1co", name: "1 Coríntios", ch: 16 },
  { abbr: "2co", name: "2 Coríntios", ch: 13 },
  { abbr: "gl", name: "Gálatas", ch: 6 },
  { abbr: "ef", name: "Efésios", ch: 6 },
  { abbr: "fp", name: "Filipenses", ch: 4 },
  { abbr: "cl", name: "Colossenses", ch: 4 },
  { abbr: "1ts", name: "1 Tessalonicenses", ch: 5 },
  { abbr: "2ts", name: "2 Tessalonicenses", ch: 3 },
  { abbr: "1tm", name: "1 Timóteo", ch: 6 },
  { abbr: "2tm", name: "2 Timóteo", ch: 4 },
  { abbr: "tt", name: "Tito", ch: 3 },
  { abbr: "fm", name: "Filemom", ch: 1 },
  { abbr: "hb", name: "Hebreus", ch: 13 },
  { abbr: "tg", name: "Tiago", ch: 5 },
  { abbr: "1pe", name: "1 Pedro", ch: 5 },
  { abbr: "2pe", name: "2 Pedro", ch: 3 },
  { abbr: "1jo", name: "1 João", ch: 5 },
  { abbr: "2jo", name: "2 João", ch: 1 },
  { abbr: "3jo", name: "3 João", ch: 1 },
  { abbr: "jd", name: "Judas", ch: 1 },
  { abbr: "ap", name: "Apocalipse", ch: 22 },
];

const OT = BOOKS.slice(0, 39);
const NT = BOOKS.slice(39);

function pad3(n) { return String(n).padStart(3, "0"); }
function ref(abbr, chap) { return `${abbr.toUpperCase()} ${chap}`.replace("JÓ", "Jó"); } // ajuste de maiúsculas/acentos

function buildCoverPlan() {
  const refs = [];
  for (const b of BOOKS) for (let c=1; c<=b.ch; c++) refs.push(ref(b.abbr, c));
  // distribuir em 365 dias (tamanho aproximado por dia)
  const perDay = Math.ceil(refs.length / 365); // ~ (1189/365 ≈ 3.26)
  const dias = [];
  for (let i=0; i<365; i++) {
    const slice = refs.slice(i*perDay, (i+1)*perDay);
    if (slice.length === 0) break;
    dias.push({ id: pad3(i+1), refs: slice });
  }
  return { titulo: "Plano Anual (Capa-a-capa)", dias };
}

function buildOTNTPlan() {
  // 2 caps AT + 1 cap NT por dia (aprox.)
  const seqOT = OT.flatMap(b => Array.from({length: b.ch}, (_,i)=>ref(b.abbr, i+1)));
  const seqNT = NT.flatMap(b => Array.from({length: b.ch}, (_,i)=>ref(b.abbr, i+1)));

  const dias = [];
  let iOT = 0, iNT = 0;
  for (let d=1; d<=365; d++) {
    const refs = [];
    for (let k=0; k<2 && iOT < seqOT.length; k++) refs.push(seqOT[iOT++]);
    if (iNT < seqNT.length) refs.push(seqNT[iNT++]);
    dias.push({ id: pad3(d), refs });
    if (iOT>=seqOT.length && iNT>=seqNT.length) break;
  }
  return { titulo: "Plano Anual (AT+NT diário)", dias };
}

function main() {
  const mode = (process.argv[2] || "cover").toLowerCase(); // "cover" | "otnt"
  const plan = mode === "otnt" ? buildOTNTPlan() : buildCoverPlan();
  const outPath = path.join(process.cwd(), "content", "plan", "plan.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(plan, null, 2), "utf-8");
  console.log(`OK: ${plan.dias.length} dias gerados em ${outPath}`);
}

main();
