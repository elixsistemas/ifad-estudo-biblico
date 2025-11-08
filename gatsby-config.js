module.exports = {
  siteMetadata: {
    title: "IFAD – Leitura bíblica e devocionais",
    description: "Plataforma de leitura bíblica e devocionais da IFAD.",
    siteUrl: "https://biblia.ifad.com.br",
    image: "/capas/capa_3.png",
    social: {
      instagram: "https://www.instagram.com/ifadoficial",
    },
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-emotion",
    "gatsby-plugin-styled-components",
    {
      resolve: "gatsby-source-filesystem",
      options: { name: "plan", path: `${__dirname}/content/plan` },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: { name: "devocionais", path: `${__dirname}/content/devocionais/` },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "static-backgrounds",
        path: `${__dirname}/static/backgrounds/`,
      },
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: { extensions: [".mdx", ".md"] },
    },
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
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-robots-txt",
      options: { policy: [{ userAgent: "*", allow: "/" }] },
    },
    "gatsby-plugin-react-helmet",
  ],
};
