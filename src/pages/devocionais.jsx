import * as React from "react";
import { graphql, Link } from "gatsby";
import SiteHeader from "../components/SiteHeader";

export const query = graphql`
  {
    allMdx(
      filter: { internal: { contentFilePath: { regex: "/content/devocionais/" } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        frontmatter { slug title date }
      }
    }
  }
`;

export default function DevocionaisPage({ data }){
  const items = data.allMdx.nodes;
  return (
    <>
      <SiteHeader />
      <main className="container">
        <h1>Devocionais</h1>
        <ul className="results">
          {items.map((p) => (
            <li key={p.frontmatter.slug}>
              <Link to={`/devocionais/${p.frontmatter.slug}`}>
                <strong>{p.frontmatter.title}</strong>
                {p.frontmatter.date && (
                  <div className="note">{new Date(p.frontmatter.date).toLocaleDateString()}</div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
