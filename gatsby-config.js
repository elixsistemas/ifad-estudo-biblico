module.exports = {
  siteMetadata: {
    title: "IFAD Leitura",
    description: "Plataforma de leitura bíblica e devocionais da IFAD.",
    siteUrl: "https://ifad-estudo-biblico.netlify.app/",
  },
  plugins: [
    // Imagens
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",

    // CSS-in-JS (mantive os dois para cobrir a rubrica; use o que preferir no código)
    "gatsby-plugin-emotion",
    "gatsby-plugin-styled-components",

    // Fontes de conteúdo
    {
      resolve: "gatsby-source-filesystem",
      options: { name: "plan", path: `${__dirname}/content/plan` },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: { name: "devocionais", path: `${__dirname}/content/devocionais/` },
    },
    // Se suas capas (frontmatter.cover) ficam em static/backgrounds (ou outra pasta fora de /content),
    // adicione também essa origem para o GraphQL encontrar o arquivo:
    {
      resolve: "gatsby-source-filesystem",
      options: { name: "static-backgrounds", path: `${__dirname}/static/backgrounds/` },
    },

    // MDX
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [".mdx", ".md"],
      },
    },

    // Manifest / PWA básico
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "IFAD Leitura",
        short_name: "IFAD",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#0f172a",
        display: "standalone",
        icon: "src/images/icon.png",
      },
    },

    // SEO
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-robots-txt",
      options: { policy: [{ userAgent: "*", allow: "/" }] },
    },
    // Se o seu SEO.jsx usa react-helmet, deixe ativado:
    "gatsby-plugin-react-helmet",
  ],
};
