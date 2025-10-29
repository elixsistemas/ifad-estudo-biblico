module.exports = {
  siteMetadata: {
    title: "IFAD Leitura",
    description: "Plataforma de leitura bíblica e devocionais da IFAD.",
    siteUrl: "https://SEU-SITE-NETLIFY" // útil para SEO e sitemap
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-emotion",

    { resolve: "gatsby-source-filesystem", options: { name: "plan", path: `${__dirname}/content/plan` } },
    { resolve: "gatsby-source-filesystem", options: { name: "devocionais", path: `${__dirname}/content/devocionais/` } },
    { resolve: "gatsby-source-filesystem", options: { name: "backgrounds", path: `${__dirname}/content/backgrounds/` } },

    // MDX neutro (sem textos promocionais)
    "gatsby-plugin-mdx",

    // Manifesto PWA (nomes neutros, sem “Gatsby”)
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "IFAD Leitura",
        short_name: "IFAD",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#0f172a",
        display: "standalone",
        icon: "src/images/icon.png"
      }
    },

    // SEO silencioso
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-robots-txt",
      options: { policy: [{ userAgent: "*", allow: "/" }] }
    }
  ]
}
