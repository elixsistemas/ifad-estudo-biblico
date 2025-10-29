Estudo Bíblico IFAD — Jamstack (Gatsby)

Aplicação de leitura bíblica e plano anual construída em Gatsby 5 (Jamstack), combinando SSG (Static Site Generation) e SPA (client-only) para entregar velocidade, resiliência e UX caprichada.
Inclui leitor integrado, plano anual com progresso, busca robusta com fallback, e formulários de Pedido de Oração e Contato prontos para Netlify Forms.

Demo (CDN): https://ifad-estudo-biblico.netlify.app/

Repositório: https://github.com/elixsistemas/ifad-estudo-biblico

✨ Principais recursos

SSG + SPA lado a lado

Páginas do plano geradas estaticamente: /plano e /plano/dia-XYZ (SEO e velocidade).

Área /app/* é SPA client-only para leitura e busca dinâmicas.

Plano anual com progresso

365 dias (AT+NT diário), badges pendente / ✓ lido, barra de progresso e sincronização entre abas.

Estados persistidos via localStorage (ifad_plan_read, ifad_plan_read_items).

Leitor inteligente

Versão / Livro / Capítulo / Verso com selects guiados (evitam erro de digitação).

Navegação Anterior/Próximo atravessando itens do dia; Concluir leitura marca e avança.

Modo imersivo quando aberto pelo plano, com A−/A+ e fonte persistente.

Fallback automático para bible-api.com se a API principal falhar (mensagens claras).

Busca resiliente

Tenta múltiplos formatos de payload (q/query/search), remove acentos e lida com variações de resposta.

Formulários

Pedido de Oração e Contato preparados para Netlify Forms, com validação básica e layout responsivo.

Acessibilidade e tema

Tema Claro/Escuro, foco visível, labels com htmlFor/id, contraste verificado e UI responsiva.

🏗️ Arquitetura (Jamstack)

Gatsby 5 (React 18)

SSG

/plano (lista e progresso)

/plano/dia-XYZ (detalhe por dia; 365 páginas geradas via gatsby-node.js)

SPA Client-Only

/app/reader (Leitura)

/app/busca (Busca)

CDN: Netlify (build + deploy via CI/CD)

🗂️ Estrutura de pastas (resumo)
content/
  plan/plan.json          # dias e referências do plano (AT+NT diário)

src/
  components/             # SiteHeader, SEO, selects, etc.
  pages/
    index.jsx             # home
    plano.jsx             # lista do plano (SSG)
    pedido-oracao.jsx     # form (Netlify Forms)
    contato.jsx           # form (Netlify Forms)
    app/
      index.jsx           # router client-only para /app/*
  spa/
    Reader.jsx            # leitor (SPA, com modo imersivo)
    Busca.jsx             # busca (SPA)
    ImageComposer.jsx     # util opcional
  styles/global.css
  templates/
    Day.jsx               # página do dia (SSG)

gatsby-node.js            # gera /plano/dia-XYZ e marca /app/* como client-only
gatsby-config.js          # plugins (image, sitemap, robots, mdx etc.)

🔐 Ambiente (.env)

Crie /.env.development e/ou /.env.production:

GATSBY_BIBLIA_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...   # seu JWT


Gatsby expõe variáveis que começam com GATSBY_ ao cliente. Não coloque segredos sensíveis sem esse prefixo.

Como obter o token (A Bíblia Digital)

Cadastre-se em https://www.abibliadigital.com.br/ e gere seu token. Teste com:

$h = @{ Authorization = "Bearer SEU_TOKEN"; Accept="application/json" }
Invoke-RestMethod -Method Get -Uri "https://www.abibliadigital.com.br/api/check" -Headers $h


A aplicação faz fallback de leitura para https://bible-api.com/ se necessário.

▶️ Rodando localmente
npm install
npm run develop
# http://localhost:8000


Build de produção:

npm run build
npm run serve

🚀 Deploy (CDN + CI/CD)
Netlify (recomendado)

Conecte o repositório (GitHub): https://github.com/elixsistemas/ifad-estudo-biblico

Site em produção: https://ifad-estudo-biblico.netlify.app/

Configure GATSBY_BIBLIA_TOKEN nas Environment Variables (Site Settings → Build & deploy → Environment).

Pipeline CI/CD (Fluxo exigido)

Commit no GitHub → Netlify dispara build.

Build OK → Deploy automático para a CDN.

Site atualizado em: https://ifad-estudo-biblico.netlify.app/

Adicionar o usuário do professor como colaborador no GitHub para que ele possa commitar e disparar a pipeline.

🧩 Como funciona (SSG + SPA)

SSG (Plano): gatsby-node.js lê content/plan/plan.json e gera /plano/dia-XYZ.
Progresso do plano salvo em localStorage (ifad_plan_read) e sincronizado com plan:updated.

SPA (/app): Leitor e Busca em /app/* (client-only), mantendo estado no navegador.
O Leitor sincroniza a URL com ?version,book,chapter,verse,day,i, possui modo imersivo, A−/A+ e Concluir leitura que marca e avança.

🧪 QA / Acessibilidade (checklist)

 Foco visível; navegação por teclado.

 label htmlFor pareado com id.

 Contraste ok em Claro/Escuro.

 Leitor imersivo pelo plano; Anterior/Próximo respeita a sequência.

 Concluir marca ✓ e avança; fim do dia dispara sincronização.

 Busca trata acentos/payloads, com mensagens claras.

 Forms com validação básica e compatíveis com Netlify Forms.

 Responsivo (mobile-first), inclusive controles do leitor.

🖼️ Imagens, SEO e Metadados

gatsby-plugin-image / sharp para otimização (quando houver imagens na rota).

SEO.jsx define title, description e image via Head.

gatsby-plugin-sitemap e gatsby-plugin-robots-txt para metadados do site.

🧭 Rotas a partir de arquivos de marcação

Template src/templates/Day.jsx usa dados do plano a partir de JSON (camada estática).

Suporte a MDX opcional (ex.: content/devocionais/*.mdx), com geração de páginas /devocionais/[slug] pelo gatsby-node.js (se ativado no projeto).

🛠️ Troubleshooting

401/403 na API: token inválido/ausente → ver GATSBY_BIBLIA_TOKEN e rebuild.

Busca sem retorno: a API é sensível ao payload; a app tenta q/query/search e remove acentos.

Node 22: se der conflito de libs, use Node 18/20.

Plugins: “There was a problem loading plugin …” → instale conforme package.json ou ajuste gatsby-config.js.

📦 Scripts
npm run clean     # limpa cache do Gatsby
npm run develop   # modo desenvolvimento
npm run build     # build de produção
npm run serve     # serve a pasta /public

🔒 Privacidade

Progresso salvo localmente (sem PII).

Formulários podem conter dados sensíveis; use Netlify Forms/backend próprio com acesso restrito e HTTPS.

🤝 Contribuindo

Branch: feat/minha-melhoria

Commits pequenos e descritivos

PR com contexto (por quê/como) e prints quando útil

Padrões: acessibilidade, tema claro/escuro, SSG/SPA coesos, sem dependências desnecessárias.

📜 Licença

Defina conforme diretriz da Elix Sistemas (ex.: MIT).
Copyright (c) Elix Sistemas

🖼️ Screenshots (sugestão)

/plano (progresso)

/plano/dia-XYZ (UI do dia + concluir)

/app/reader (imersivo + A−/A+)

/app/busca (resultados)

/pedido-oracao e /contato

🙌 Agradecimentos

A Bíblia Digital pela API aberta

Comunidade Gatsby

Equipe e membros da IFAD pelo apoio contínuo