Estudo Bíblico IFAD — Jamstack (Gatsby)

Aplicação de leitura bíblica e plano anual da IFAD, construída com Gatsby (Jamstack) combinando SSG (Static Site Generation) e SPA (Single Page Application) para uma experiência rápida, moderna e confiável — com progresso diário, leitor integrado, busca resiliente, e formulários de Pedido de Oração e Contato.

✨ Principais recursos

SSG + SPA (lado a lado)

Páginas do Plano são estáticas (SSG) para velocidade e SEO.

Área /app é SPA client-only (Leitura e Busca), garantindo interatividade dinâmica.

Leitor inteligente

Dropdowns para Versão, Livro, Capítulo e Verso (evita erros de digitação).

Botões Anterior/Próximo que atravessam dias do plano.

Botão Concluir dia e avançar (marca como lido e abre o próximo dia).

Fallback automático para fonte pública quando a API principal estiver indisponível.

Plano anual com progresso

365 dias (AT+NT diário), com badge “pendente/✓ lido” e barra de progresso.

Estado persistente via localStorage e sincronização entre abas/rotas.

Formulários

Pedido de Oração e Contato, prontos para Netlify Forms (ou outro backend).

Busca resiliente

Lida com variações de payload (q/query/search) e com/remova acentos.

Tema Claro/Escuro, acessibilidade básica (foco visível, labels htmlFor/id), layout responsivo.

🏗️ Arquitetura

Gatsby 5 (React 18)

Páginas SSG

/plano (lista e progresso)

/plano/dia-XYZ (detalhe de cada dia)

Rotas Client-Only (SPA)

/app/reader (Leitor)

/app/busca (Busca)

Integrações

API: https://www.abibliadigital.com.br (token JWT)

Fallback: https://bible-api.com/ (somente leitura)

Estrutura de pastas (simplificada)
content/
  plan/plan.json          # dias e referências (AT+NT diário)
src/
  components/             # Header, selects, etc.
  pages/
    index.jsx             # home
    plano.jsx             # lista do plano (SSG)
    pedido-oracao.jsx     # form
    contato.jsx           # form
    app/index.jsx         # router SPA (/app/*)
  spa/
    Reader.jsx            # leitor (SPA)
    Busca.jsx             # busca (SPA)
  styles/global.css
  templates/
    Day.jsx               # página do dia (SSG)
gatsby-node.js            # gera /plano/dia-XYZ e marca /app/* como client-only

✅ Requisitos

Node.js LTS recomendada: 18.x ou 20.x
(Node 22 pode funcionar, mas muitas libs do ecossistema Gatsby ainda recomendam 18/20.)

npm 8+ (ou pnpm/yarn se preferir)

Token da API A Bíblia Digital (veja abaixo)

🔐 Ambiente (.env)

Crie /.env.development e/ou /.env.production com:

GATSBY_BIBLIA_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....   # seu JWT


Gatsby expõe variáveis que começam com GATSBY_ ao cliente. Não coloque segredos sensíveis sem esse prefixo na build do front-end.

🔑 Gerando o token (A Bíblia Digital)

Criar usuário (exemplo em PowerShell):

$body = @{
  name          = "Seu Nome"
  email         = "voce@exemplo.com"
  password      = "SuaSenhaForte123!"
  notifications = $true
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "https://www.abibliadigital.com.br/api/users" `
  -ContentType "application/json" `
  -Body $body


Resposta inclui token. Guarde-o.

(Opcional) Redefinir/atualizar token:

$auth = @{ email="voce@exemplo.com"; password="SuaSenhaForte123!" } | ConvertTo-Json
$resp = Invoke-RestMethod -Method Put `
  -Uri "https://www.abibliadigital.com.br/api/users/token" `
  -ContentType "application/json" `
  -Body $auth
$resp.token  # novo JWT


Testar:

$h = @{ Authorization = "Bearer SEU_TOKEN"; Accept="application/json" }
Invoke-RestMethod -Method Get -Uri "https://www.abibliadigital.com.br/api/check" -Headers $h


Taxas: a API possui limites/ratelimit. Evite loops agressivos de busca.

▶️ Rodando localmente
npm install
npm run develop
# abre em http://localhost:8000


Build de produção:

npm run build
npm run serve   # serve o /public

🚀 Deploy

Netlify (recomendado): arraste a pasta /public (build) ou conecte o repositório.
Configure GATSBY_BIBLIA_TOKEN nas Environment Variables do projeto.
Forms (pedido-oracao, contato) já prontos para Netlify Forms.

Vercel: funciona bem (SSG). Rotas client-only já configuradas em gatsby-node.js.

🧩 Como funciona (SSG + SPA)

SSG (Plano): gatsby-node.js lê content/plan/plan.json e gera 365 páginas /plano/dia-XYZ.
Progresso é salvo em localStorage (ifad_plan_read) e sincronizado por eventos (plan:updated).

SPA (/app): o Leitor e a Busca vivem em /app/* com @gatsbyjs/reach-router.

O Leitor consome a API com Bearer (do .env), faz fallback quando necessário, e sincroniza a URL (?version&book&chapter&verse&day&i), permitindo compartilhar links.

Navegação Anterior/Próximo respeita a sequência do dia e atravessa dias quando chega ao início/fim.

🧪 Checklist de QA / Acessibilidade

 Navegação por teclado (foco visível).

 Labels associados (htmlFor/id) em todos os inputs.

 Contraste OK em tema claro/escuro.

 Leitor abre pelo plano e Próx./Ant. transita entre refs do dia (e atravessa dias).

 Concluir dia marca ✓ e avança.

 Busca retorna itens (ou mensagem útil). Testar termo com/sem acentos.

 Forms enviam (Netlify) e mostram validação básica.

🛠️ Problemas comuns (Troubleshooting)

HTTP 403/401 na API
Token ausente/expirado. Confirme GATSBY_BIBLIA_TOKEN no .env e rebuild. Teste /api/check.

HTTP 500 na Busca
A rota verses/search pode ser sensível a payload/acentos. A Busca já tenta várias formas (q, query, search) e remove acentos. Sem sucesso, aparece mensagem clara.

Node 22
Se encontrar erros de dependência, use Node 18/20 (nvm/volta) para maior compatibilidade com Gatsby 5.

“There was a problem loading plugin …”
Instale os plugins listados no package.json ou remova do gatsby-config.js se não usados.

Leitor sem versos
Cheque version, book (abreviação minúscula), chapter válido para o livro, e verse dentro do range. O VerseSelect já limita automaticamente.

🔧 Personalização / Extensões

Plano alternativo: troque content/plan/plan.json (mesma estrutura).

Compartilhar versículo: adicione botão “Copiar referência” no Leitor.

i18n: internacionalize labels e livros.

Persistência em nuvem: trocar localStorage por backend (ex.: Supabase) para progresso multi-dispositivo.

Analytics: adicionar eventos (ex.: dia concluído) respeitando privacidade.

📦 Scripts úteis
npm run clean     # limpa cache do Gatsby
npm run develop   # modo desenvolvimento
npm run build     # build de produção
npm run serve     # serve a pasta /public

🔒 Privacidade

O progresso é salvo localmente (localStorage), sem dados pessoais.

Os formulários podem enviar dados sensíveis (pedido de oração). Configure destino seguro (Netlify Forms ou backend próprio) e controle de acesso ao dashboard.

🤝 Contribuindo

Crie uma branch: feat/minha-melhoria

Faça commits pequenos e claros

Abra PR descrevendo o “por quê” e “como”

Inclua prints/links quando útil

Padrões: acessibilidade, tema claro/escuro, sem dependências desnecessárias, manter SSG/SPA coesos.

📜 Licença

Defina a licença conforme diretriz da IFAD (ex.: MIT).
Copyright (c) IFAD

🖼️ Screenshots (sugestão)

/plano (progresso pendente e lido)

/plano/dia-XYZ (botões abrir refs e concluir)

/app/reader (dropdowns + leitura + concluir dia)

/app/busca (resultado e fallback)

/pedido-oracao / /contato

🙌 Agradecimentos

A Bíblia Digital pela API aberta

Comunidade Gatsby

Equipe e membros da IFAD por inspirar o projeto