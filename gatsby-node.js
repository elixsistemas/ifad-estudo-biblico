const path = require("path");
const plan = require("./content/plan/plan.json");

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // 1) Páginas do Plano Anual (SSG)
  const dayTemplate = path.resolve("./src/templates/Day.jsx");
  plan.dias.forEach((dia) => {
    createPage({
      path: `/plano/dia-${dia.id}`,
      component: dayTemplate,
      context: {
        id: dia.id,
        refs: dia.refs,
        titulo: plan.titulo || "Plano Anual",
      },
    });
  });

  // 2) Páginas de Devocionais (MDX → rotas)
  const devTemplate = path.resolve("./src/templates/Devocional.jsx"); // respeita caixa
  const result = await graphql(`
    {
      allMdx(
        filter: { internal: { contentFilePath: { regex: "/content[\\\\/]{1}devocionais[\\\\/]/" } } }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          id
          frontmatter { slug title date }
          internal { contentFilePath }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild("Erro ao carregar MDX para devocionais", result.errors);
    return;
  }

  const posts = result.data?.allMdx?.nodes || [];
  posts.forEach((node) => {
    const slug = node.frontmatter?.slug || node.id;
    createPage({
      path: `/devocionais/${slug}`,
      component: `${devTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        id: node.id,
        frontmatter: node.frontmatter || {},
        slug,
      },
    });
  });
};

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;
  // SPA client-only em /app/*
  if (/^\/app/.test(page.path)) {
    page.matchPath = "/app/*";
    createPage(page);
  }
};
