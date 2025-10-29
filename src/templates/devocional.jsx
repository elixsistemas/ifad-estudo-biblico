import * as React from "react";
import { graphql, Link } from "gatsby";
import SiteHeader from "../components/SiteHeader";

export default function Devocional({ data, children }) {
  const post = data.mdx;
  return (
    <>
      <SiteHeader />
      <main className="container">
        <nav className="breadcrumbs"><Link to="/devocionais/">Devocionais</Link> ▸ {post.frontmatter.title}</nav>
        <h1>{post.frontmatter.title}</h1>
        {post.frontmatter.referencia && <p className="pill">{post.frontmatter.referencia}</p>}
        <article className="texto">{children}</article>
      </main>
    </>
  );
}

export const query = graphql`
  query DevocionalById($id: String!) {
    mdx(id: {eq: $id}) {
      frontmatter { title referencia date(formatString: "DD/MM/YYYY") }
      excerpt(pruneLength: 160)
    }
  }
`;
