// gatsby-node.js
const path = require("path");
const plan = require("./content/plan/plan.json");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(/* GraphQL */ `
    type MdxFrontmatter @infer {
      title: String!
      slug: String
      date: Date @dateformat
      description: String
      reader: String
      cover: File @fileByRelativePath
    }
  `);
};

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
  const devTemplate = path.resolve("./src/templates/Devocional.jsx");
  const result = await graphql(`
    {
      allMdx(
        filter: { internal: { contentFilePath: { regex: "/content/(devocionais)/" } } }
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

// SPA client-only em /app/*
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;
  if (/^\/app/.test(page.path)) {
    page.matchPath = "/app/*";
    createPage(page);
  }
};
