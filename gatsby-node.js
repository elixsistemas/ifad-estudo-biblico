// gatsby-node.js
const path = require("path");
const plan = require("./content/plan/plan.json");

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  // páginas de dia
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
    page.matchPath = "/app/*";      // client-only SPA
    createPage(page);
  }
};
