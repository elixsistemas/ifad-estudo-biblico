const path = require("path");
const plan = require("./content/plan/plan.json");

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  const dayTemplate = path.resolve("./src/templates/Day.jsx");
  plan.dias.forEach(dia => {
    createPage({
      path: `/plano/dia-${dia.id}`,
      component: dayTemplate,
      context: { id: dia.id, refs: dia.refs, titulo: plan.titulo || "Plano Anual" },
    });
  });
};

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;
  if (page.path.match(/^\/app/)) {
    page.matchPath = "/app/*";     
    createPage(page);
  }
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const plan = require("./content/plan/plan.json");
  const path = require("path");
  const dayTemplate = path.resolve("./src/templates/Day.jsx");
  plan.dias.forEach(dia => {
    createPage({
      path: `/plano/dia-${dia.id}`,
      component: dayTemplate,
      context: { id: dia.id, refs: dia.refs, titulo: plan.titulo || "Plano Anual" },
    });
  });

  const result = await graphql(`
    {
      allMdx(
        filter: { internal: { contentFilePath: { regex: "/content/devocionais/" } } }
        sort: {frontmatter: {date: DESC}}
      ) {
        nodes {
          id
          frontmatter { slug title date }
          internal { contentFilePath }
        }
      }
    }
  `);

  if (result.errors) reporter.panic("Erro ao carregar MDX", result.errors);

  const devTemplate = require("path").resolve("./src/templates/devocional.jsx");
  result.data.allMdx.nodes.forEach(node => {
    const slug = node.frontmatter?.slug || node.id;
    createPage({
      path: `/devocionais/${slug}/`,
      component: `${devTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: { id: node.id },
    });
  });
};

