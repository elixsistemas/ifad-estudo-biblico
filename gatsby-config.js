module.exports = {
  siteMetadata: {
    title: "IFAD Leitura",
    description: "SSG + SPA com plano de leitura bíblica (Gatsby v5).",
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: { name: "plan", path: `${__dirname}/content/plan` },
    },
  ],
};
