import * as React from "react";
import SiteHeader from "../components/SiteHeader";

export const Head = ({ pageContext }) => {
  const title = pageContext?.frontmatter?.title || "Devocional";
  return (
    <>
      <title>{title} • IFAD Leitura</title>
      <meta name="description" content="Devocional IFAD" />
    </>
  );
};

export default function DevocionalTemplate({ children, pageContext }) {
  const { frontmatter } = pageContext || {};
  return (
    <>
      <SiteHeader />
      <main className="container">
        <article className="card">
          <header style={{marginBottom:12}}>
            <h1 style={{margin:"0 0 6px"}}>{frontmatter?.title || "Devocional"}</h1>
            {frontmatter?.date && (
              <div className="note">{new Date(frontmatter.date).toLocaleDateString()}</div>
            )}
          </header>
          <div className="texto">{children}</div>
        </article>
      </main>
    </>
  );
}
