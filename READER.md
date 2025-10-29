READER.md — Leitor (SPA) do Estudo Bíblico IFAD

Documento técnico do Leitor em /app/reader (SPA client-only). Cobre objetivos de design, fluxo de dados, contrato de APIs, estados, URL schema, eventos, acessibilidade, troubleshooting e testes manuais.

Stack: React 18, Gatsby 5 (client-only via @gatsbyjs/reach-router), Fetch API.

1) Objetivos de design

Determinístico por URL: toda leitura é reconstituível com
?version&book&chapter&verse[&day&i].

Plan-aware: quando aberto a partir do Plano, respeita a sequência diária e oferece Anterior/Próximo com travessia de dias.

Resiliente: tenta A Bíblia Digital (ABD); ao falhar por permissão/ratelimit/indisponibilidade, usa fallback público (Bible API).

UX segura: selects para Versão/Livro/Capítulo/Verso, reduzindo entradas inválidas.

Sincronização: a URL é atualizada (deep link) a cada ação relevante.

Modo imersivo mobile-first: fonte ajustável (A−/A+), CTA fixo de conclusão e top bar sticky.

2) URL Schema

Rota base:
/app/reader?version=acf&book=jo&chapter=3&verse=16&day=003&i=0

Param	Tipo	Obrig.	Exemplo	Descrição
version	string	sim	acf	Abrev. da versão (dropdown).
book	string	sim	jo	Abrev. do livro (minúsculas).
chapter	number	sim	3	Capítulo (1..N).
verse	number | ""	não	16	Verso; vazio = capítulo inteiro.
day	string	não	003	Id do Dia do plano; ativa modo imersivo.
i	number	não	0	Índice da referência dentro do dia (0..len-1).

Sem day: leitor se comporta como “livre” (form com selects).

Com day e i: mostra contador Dia 003 • 1/3 e navegação Anterior/Próximo.

3) Estado e sincronização

Estados principais (simplificado):

const [version, setVersion] = React.useState(init.version || "acf");
const [abbrev,  setAbbrev]  = React.useState(init.book);
const [chapter, setChapter] = React.useState(init.chapter);
const [number,  setNumber]  = React.useState(init.verse); // "" => capítulo inteiro
const [day]                 = React.useState(init.day);   // string | ""
const [idx,     setIdx]     = React.useState(init.i);     // number | null
const [data,    setData]    = React.useState(null);       // payload renderizável
const [error,   setError]   = React.useState("");
const [loading, setLoading] = React.useState(false);

// fonte (modo plano), persistida
const [font, setFont] = React.useState(() => {
  if (typeof localStorage === "undefined") return 20;
  const v = Number(localStorage.getItem("ifad_font") || 20);
  return Math.min(Math.max(v, 16), 28);
});


Sincronização de URL:

function syncUrl({version, book, chapter, verse, day, i}) {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams({ version, book, chapter: String(chapter) });
  if (verse) p.set("verse", String(verse));
  if (day)   p.set("day", day);
  if (i !== null && i !== undefined) p.set("i", String(i));
  window.history.replaceState({}, "", `/app/reader?${p.toString()}`);
}


Chamado no submit, na navegação (Anterior/Próximo) e quando a leitura no plano muda (idx).

4) Data flow (fetch)
4.1 API Primária — A Bíblia Digital (ABD)

Capítulo
GET https://www.abibliadigital.com.br/api/verses/:version/:abbrev/:chapter
Headers: Authorization: Bearer <TOKEN>, Accept: application/json

Resposta esperada (resumo):

{
  "book": {"name":"João"},
  "chapter": {"number":3, "verses":36},
  "verses": [{"number":1,"text":"..."}, ...]
}


Verso
GET https://www.abibliadigital.com.br/api/verses/:version/:abbrev/:chapter/:number

{
  "book": {"name":"João"},
  "chapter": 3,
  "number": 16,
  "text": "..."
}

4.2 Fallback — Bible API (somente leitura)

Ativado quando erro 401/403/ratelimit (ou indisponibilidade):

Capítulo: GET https://bible-api.com/joao%203?translation=almeida

Verso: GET https://bible-api.com/joao%203:16?translation=almeida

Normalização do fallback para o modelo interno:

Capítulo → { book:{name:...}, chapter:{number}, verses:[{number,text}] }

Verso → { book:{name:...}, chapter:number, number:number, text }

4.3 Tratamento de erro

Exibe mensagem no topo (.alert), sem quebrar a leitura (usa fallback sempre que possível).

5) Integração com o Plano
5.1 Fonte de verdade

content/plan/plan.json:

{
  "titulo": "Plano Anual (AT+NT diário)",
  "dias": [
    { "id": "001", "refs": ["gn 1", "gn 2", "mt 1"] }
  ]
}


Helpers (resumo):

function dayIndex(dayId){ return plan.dias.findIndex(d => d.id === dayId); }
function parseRef(r){
  const [b, rest] = r.toLowerCase().split(" ");
  const [c, v]    = (rest||"").split(":");
  return { book: b, chapter: Number(c||1), verse: v?Number(v):"" };
}
function seqDoPlano(dayId){
  const dia = plan.dias.find(d => d.id === dayId);
  return dia ? dia.refs.map(parseRef) : null;
}

5.2 Navegação entre referências e travessia
function goPlan(delta) {
  if (!day) return;
  const s = seqDoPlano(day);
  let next = (idx ?? 0) + delta;

  // dentro do dia
  if (next >= 0 && s && next < s.length) {
    const r = s[next];
    setIdx(next);
    setAbbrev(r.book); setChapter(r.chapter); setNumber(r.verse || "");
    syncUrl({version, book:r.book, chapter:r.chapter, verse:r.verse||"", day, i:next});
    fetchAndSet(version, r.book, r.chapter, r.verse||"");
    return;
  }

  // fim do dia -> marca como concluído (ver 5.3)
  if (next >= (s?.length || 0)) {
    markDayDone(day);
    return;
  }
}

5.3 Conclusão de trecho/dia

Itens lidos do dia (bolinhas): localStorage["ifad_plan_read_items"] (por dia).

Dia concluído (barra do /plano): localStorage["ifad_plan_read"] (Set de ids).

function concluirTrecho() {
  if (!day) return;
  const s = getReadSet(day);
  const pos = idx ?? 0;
  s.add(pos);                 // marca item lido
  saveReadSet(day, s);

  const total = seq?.length || 1;
  if (s.size >= total) markDayDone(day); // conclui o dia
  goPlan(+1);
}

6) Components do Leitor

VersionSelect — carrega lista (local/API), mantém valor válido.

BookSelect — lista de livros (pt-BR) + chaptersOf(abbrev).

ChapterSelect — gera [1..N] via chaptersOf.

VerseSelect — consulta GET /verses/:version/:book/:chapter e cria select [1..M]; se M ausente, degrada para <input type="number">.

7) Eventos e persistência

localStorage["ifad_plan_read"] → ["003","145", ...] (dias concluídos).

localStorage["ifad_plan_read_items"] → { "003":[0,1,2], ... } (itens do dia).

Evento plan:updated — emitido ao concluir dia; /plano escuta e recalcula progresso; há também atualização por visibilitychange e focus.

8) Acessibilidade e UX

Labels com htmlFor/id.

Foco visível (:focus-visible).

Targets ~44px em mobile.

Tema claro/escuro persistente em localStorage["theme"].

Modo imersivo: top bar sticky, A−/A+ com persistência em localStorage["ifad_font"], CTA inferior fixo “Concluir leitura”.

9) Testes manuais (cenários-chave)

Leitura livre: /app/reader?version=acf&book=mt&chapter=1
Alterar selects → URL atualiza; leitura renderiza.

Plano: /plano/dia-003 → “Ler agora”
Ver Dia 003 • 1/N; Próximo avança; Concluir marca ✓ e sincroniza /plano.

Fallback: simular 401/403 (token ausente/inválido) → alert discreto + conteúdo da Bible API.

VerseSelect: livro com poucos versos (ex.: Obadias 1) cria range correto.

Multitab: /plano e Leitor em abas diferentes; concluir no Leitor → /plano atualiza (evento + visibilitychange).

10) Erros comuns e mitigação

401/403 (token): configurar GATSBY_BIBLIA_TOKEN e rebuild; fallback mantém leitura funcional.

Ratlimit/500: leitura segue via fallback.

Entrada inválida: selects evitam ranges inválidos; há try/catch com mensagens claras.

Rede móvel instável: UX mantém estado e exibe erro sem travar.

11) Convenções internas

Abreviações de livros minúsculas: "jo", "mt", "gn".

Versões em minúsculas: "acf", "ara", "nvi".

day é string zero-padded ("003").

Nunca interromper leitura por erro: sempre tentar fallback.

12) APIs — contrato sintético
12.1 A Bíblia Digital (ABD)

GET /api/check → {result:"success"}

GET /api/verses/:version/:abbrev/:chapter

GET /api/verses/:version/:abbrev/:chapter/:number

POST /api/verses/search (instável: usa variações q/query/search)

Headers: Authorization: Bearer <TOKEN>, Accept: application/json

12.2 Bible API (fallback)

GET https://bible-api.com/<book> <chapter>[:verse]?translation=almeida
Ex.: joao%203, joao%203:16

13) Referências cruzadas (arquivos)

src/spa/Reader.jsx — componente principal do leitor (este documento).

src/components/*Select.jsx — selects e helpers.

content/plan/plan.json — sequência do plano.

src/templates/Day.jsx — páginas SSG por dia (linka para o Leitor).

src/pages/plano.jsx — progresso e badges; escuta plan:updated.

gatsby-node.js — geração SSG e client-only /app/*.

src/styles/global.css — tema, layout, responsividade e UI do modo imersivo.

14) Observação sobre Hooks e lint

Para evitar re-renders e manter o bundle “limpo”:

// dispara apenas quando entra no modo plano
React.useEffect(() => {
  if (planMode) fetchAndSet();
  // Intenção: rodar uma vez ao ligar o modo plano.
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [planMode]);


Mantemos 1 warning do react-hooks/exhaustive-deps (consciente) para não disparar fetchAndSet a cada alteração de version/book/chapter/verse/idx durante a sessão imersiva.

Alternativa “lint-clean” exigiria useCallback + dependências completas, mas causaria fetches extras desnecessários. A decisão é intencional e documentada aqui.

15) Roadmap curto

Botão “Copiar referência” (clipboard).

“Continuar de onde parei” no topo do /plano (persistir última day+i).

Telemetria leve (dia concluído) com consentimento.

Testes e2e (Playwright) para navegação entre dias e fallback.

Contato técnico: mantenedores IFAD / Elix Sistemas
Licença: conforme política IFAD (ex.: MIT)