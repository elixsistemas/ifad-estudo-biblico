READER.md — Leitor (SPA) do Estudo Bíblico IFAD

Documento técnico do Leitor em /app/reader (SPA client-only). Cobre design, fluxo de dados, contrato de APIs, estados, URL schema, eventos e troubleshooting.

Stack: React 18, Gatsby 5 (client-only via @gatsbyjs/reach-router), Fetch API.

1) Objetivos de design

Determinístico por URL: toda leitura é reconstituível apenas com ?version&book&chapter&verse[&day& i].

Plan-aware: quando aberto a partir do Plano, respeita a sequência diária e atravessa dias ao usar Anterior/Próximo.

Resiliente: tenta API oficial (A Bíblia Digital); se falhar por permissão/ratelimit, usa fallback público.

UX segura: dropdowns para Versão/Livro/Capítulo/Verso, evitando entradas inválidas.

Sincronização: URL é atualizada com history.replaceState em cada ação (deep links).

2) URL Schema

Rota base:

/app/reader?version=acf&book=jo&chapter=3&verse=16&day=003&i=0


Parâmetros:

Param	Tipo	Obrigatório	Exemplo	Descrição
version	string	sim	acf	Abreviação da versão (dropdown).
book	string	sim	jo	Abrev. do livro (minúsculas).
chapter	number	sim	3	Capítulo (1..N).
verse	number | ""	não	16	Verso; vazio = capítulo inteiro.
day	string	não	003	Id do Dia (plano); ativa navegação sequencial.
i	number	não	0	Índice da referência dentro do dia (0..refs.length-1).

Sem day: o leitor se comporta como livre (sem sequência).

Com day e i: exibe contador Dia 003 • 1/3 e ativa Anterior/Próximo (dia).

3) Estado e sincronização

Estados principais (React):

const [version,setVersion] = useState(init.version || "acf");
const [abbrev,setAbbrev]   = useState(init.book);
const [chapter,setChapter] = useState(init.chapter);
const [number,setNumber]   = useState(init.verse);   // "" para capítulo inteiro
const [day,setDay]         = useState(init.day);     // string ou ""
const [idx,setIdx]         = useState(init.i);       // number | null
const [data,setData]       = useState(null);         // payload renderizável
const [error,setError]     = useState("");
const [loading,setLoading] = useState(false);


Sincronização de URL:

function syncUrl({version,book,chapter,verse,day,i}){
  const p = new URLSearchParams({ version, book, chapter:String(chapter) });
  if (verse) p.set("verse", String(verse));
  if (day)   p.set("day", day);
  if (i!==null && i!==undefined) p.set("i", String(i));
  history.replaceState({}, "", `/app/reader?${p.toString()}`);
}


Chamado em submit e em navegação (Anterior/Próximo/concluir dia).

4) Data flow (fetch)
4.1 API Primária — A Bíblia Digital

Capítulo
GET https://www.abibliadigital.com.br/api/verses/:version/:abbrev/:chapter
Headers: Authorization: Bearer <TOKEN>, Accept: application/json
Resposta esperada:

{
  "book": {"name":"João", "...": "..."},
  "chapter": {"number":3, "verses":36},
  "verses": [{"number":1,"text":"..."}, ...]
}


Verso
GET https://www.abibliadigital.com.br/api/verses/:version/:abbrev/:chapter/:number
Resposta esperada:

{
  "book": {"name":"João", "...": "..."},
  "chapter": 3,
  "number": 16,
  "text": "Porque Deus amou..."
}

4.2 Fallback — Bible API (somente leitura)

Quando erro 401/403/ratelimit/indisponibilidade:

Capítulo: GET https://bible-api.com/joao%203?translation=almeida

Verso: GET https://bible-api.com/joao%203:16?translation=almeida

Normalização do fallback para o modelo interno:

Capítulo → { book:{name:"Fallback"}, chapter:{number}, verses:[{number,text}] }

Verso → { book:{name:"Fallback"}, chapter:number, number:number, text }

4.3 Tratamento de erro

Mostra mensagem no topo (.alert), mas renderiza o que der (fallback).

Nunca lança erro não-capturado (o leitor sempre tenta mostrar algo).

5) Integração com o Plano
5.1 Fonte de verdade

content/plan/plan.json

{
  "titulo": "Plano Anual (AT+NT diário)",
  "dias": [
    { "id": "001", "refs": ["gn 1", "gn 2", "mt 1"] },
    ...
  ]
}


Helpers:

function dayIndex(dayId){ return plan.dias.findIndex(d => d.id === dayId); }
function dayByIndex(i){ return (i>=0 && i<plan.dias.length) ? plan.dias[i] : null; }
function parseRef(r){ const [b,rest]=r.toLowerCase().split(" "); const [c,v]=(rest||"").split(":"); return { book:b, chapter:+(c||1), verse: v?+v:"" }; }
function seqDoPlano(dayId){ const d = plan.dias.find(x=>x.id===dayId); return d ? d.refs.map(parseRef) : null; }

5.2 Navegação entre referências e atravessando dias
function goPlan(delta){
  if(!day) return;
  const iDay = dayIndex(day);
  let s = seqDoPlano(day);
  let next = (idx ?? 0) + delta;

  // dentro do dia
  if(next >= 0 && next < s.length){ /* set idx + fetch */ return; }

  // fim do dia → começo do próximo
  if(next >= s.length){
    const nextDay = dayByIndex(iDay+1); if(!nextDay) return;
    const s2 = nextDay.refs.map(parseRef); const r = s2[0];
    /* set day=nextDay.id + idx=0 + fetch */ return;
  }

  // antes do início → último do dia anterior
  const prevDay = dayByIndex(iDay-1); if(!prevDay) return;
  const s3 = prevDay.refs.map(parseRef); const last = s3.length-1; const r = s3[last];
  /* set day=prevDay.id + idx=last + fetch */
}

5.3 Concluir dia
function concluirDiaEAvançar(){
  if(!day) return;
  // marca como lido
  const raw = localStorage.getItem("ifad_plan_read");
  const arr = raw ? JSON.parse(raw) : [];
  const set = new Set(arr); set.add(day);
  localStorage.setItem("ifad_plan_read", JSON.stringify([...set]));
  window.dispatchEvent(new Event("plan:updated")); // sincroniza /plano
  // avança
  goPlan(+1);
}

6) Components do Leitor

VersionSelect

Mescla lista fallback local + API /versions.

Se value atual não existir na lista, seleciona a primeira válida.

BookSelect

Lista fixa de livros brasileiros (com contagem de capítulos).

Exporta chaptersOf(abbrev).

ChapterSelect

Gera [1..N] usando chaptersOf(book).

VerseSelect

Busca GET /verses/acf/:book/:chapter e cria um select 1..M.

Sem M → exibe <input type="number"> como degradação elegante.

7) Eventos e persistência

localStorage["ifad_plan_read"] = JSON.stringify([...Set])
Conjunto de id de dias concluídos (ex.: "003").

Evento plan:updated
Emitido pelo Leitor e pelas páginas de Dia ao marcar/desmarcar.
/plano escuta para recalcular progresso e badges.

8) Acessibilidade e UX

Labels com htmlFor/id.

Foco visível (:focus-visible no CSS).

Target mínimo ~44px para tap (inputs/botões).

Tema claro/escuro com persistência em localStorage['theme'].

9) Testes manuais (cenários-chave)

Leitura livre (sem day): /app/reader?version=acf&book=mt&chapter=1

Alterar livro/capítulo/verso → URL atualiza; leitura renderiza.

A partir do Plano: /plano/dia-003 → “Ler agora”

Ver Dia 003 • 1/3.

Próximo (dia) avança refs; no fim atravessa para próximo dia.

Anterior (dia) no início volta para dia anterior (última ref).

Conclusão: No último item do dia, clicar Concluir dia e avançar →
/plano mostra ✓ lido e a barra aumenta.

Fallback: desligar token ou simular 403/401 →
Leitura mostra alert e renderiza com Bible API.

VerseSelect: trocar livro para um com poucos versos (ex.: ob 1) →
select de versos aparece com range correto.

Multitab: abrir /plano e o Leitor em abas diferentes; marcar concluído →
/plano atualiza por causa de plan:updated/visibilitychange.

10) Erros comuns e mitigação

Token inválido/ausente → 401/403:
Fallback entra; mostrar alert discreto; orientar configurar .env.

Ratlimit → 429/500 esporádico:
Usuário ainda consegue ler (fallback). Evitar loops de requisições.

Entrada inválida (livro ou capítulo fora do range):
Dropdowns eliminam 99% dos casos; try/catch exibe mensagem útil.

11) Extensões recomendadas

Botão “Copiar referência”
Monta João 3:16 (ACF) — … e copia para clipboard.

Auto-marcar “lido” ao rolar
Usar IntersectionObserver no último parágrafo (opção).

Salvar progresso por referência
Além do “dia concluído”, salvar última ref vista (day+i) para “Continuar de onde parei”.

Sincronização em nuvem
(Supabase/Firebase) para múltiplos dispositivos.

12) APIs — contrato sintético
12.1 A Bíblia Digital (ABD)

GET /api/check → {result:"success"}

GET /api/verses/:version/:abbrev/:chapter

GET /api/verses/:version/:abbrev/:chapter/:number

POST /api/verses/search → instável (usa variações: q, query, search)

Headers sempre: Authorization: Bearer <TOKEN>, Accept: application/json.

12.2 Bible API

GET https://bible-api.com/<book> <chapter>[:verse]?translation=almeida
Ex.: joao%203 ou joao%203:16

13) Convenções internas

Abreviações de livro minúsculas ("jo", "mt", "gn").

version em minúsculas ("acf", "ara", "nvi").

Dia é sempre string zero-padded: "003", "145".

Nunca “quebra” a leitura por erro: sempre tenta fallback.

14) Referências cruzadas (arquivos)

src/spa/Reader.jsx — Componente principal (este doc).

src/components/*Select.jsx — Dropdowns e helpers.

content/plan/plan.json — Sequência do plano.

src/templates/Day.jsx — Páginas SSG por dia (linka para o Leitor).

src/pages/plano.jsx — Progresso e badges; escuta plan:updated.

gatsby-node.js — Geração SSG e rotas client-only.

15) Roadmap (curto prazo)

Copiar/Compartilhar versículo

“Continuar de onde parei” no topo do /plano

Telemetria leve (eventos de dia concluído) com consentimento

Testes e2e (Playwright) para navegação entre dias

Contato técnico: equipe IFAD / mantenedores do repositório.
Licença: conforme política IFAD (ex.: MIT).