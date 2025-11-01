// src/templates/Devocional.jsx
import * as React from "react";
import { graphql, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import SiteHeader from "../components/SiteHeader";
import Seo from "../components/SEO";

export const Head = ({ data, location }) => {
  const t = data?.mdx?.frontmatter?.title || "Devocional";
  return <Seo pathname={location.pathname} title={t} />;
};

// util simples pra “achatar” nós do MDX em texto
function flatten(children) {
  return React.Children.toArray(children)
    .map(c => (typeof c === "string" ? c : c?.props ? flatten(c.props.children) : ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function DevocionalTemplate({ data, children }) {
  const mdx = data.mdx;
  const fm = mdx.frontmatter || {};
  const coverImg = fm.cover ? getImage(fm.cover) : null;

  // pega o primeiro <p> do MDX (fallback: description)
  const kids = React.Children.toArray(children);
  const firstP = kids.find(k => k?.type === "p") || null;
  const leadText = firstP ? flatten(firstP.props.children) : (fm.description || "");

  const dateStr = fm.date
    ? new Date(fm.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
    : "";

  // handlers
  const onCopy = async () => {
    try { await navigator.clipboard.writeText(leadText); } catch {}
  };

  return (
    <>
      <SiteHeader />

      <main className="container">
        <nav className="muted" style={{ marginBottom: 12 }}>
          <Link to="/devocionais/">Devocionais</Link> • {dateStr}
        </nav>

        <figure className="hero-figure improved">
          {coverImg && (
            <div className="hero-bg">
              <GatsbyImage image={coverImg} alt={fm.title} className="hero-img" />
            </div>
          )}

          <figcaption className="verse-card">
            <p className="verse-text">{leadText}</p>
            <div className="verse-actions">
              <button className="chip" onClick={onCopy} aria-label="Copiar verso">Copiar</button>
              <Link className="chip" to="/app/reader">Ler no app</Link>
            </div>
          </figcaption>
        </figure>

        <article className="prose devo-body" style={{ marginTop: 16 }}>
          {children}
        </article>

        <div className="cta" style={{ marginTop: 24 }}>
          <Link className="btn outline" to="/devocionais/">Voltar para lista</Link>
          <Link className="btn" to="/app/reader">Ler no app</Link>
        </div>
      </main>
    </>
  );
}

export const pageQuery = graphql`
  query DevocionalById($id: String!) {
    mdx(id: { eq: $id }) {
      id
      frontmatter {
        title
        date
        slug
        cover {
          childImageSharp {
            gatsbyImageData(width: 1600, placeholder: BLURRED, quality: 80)
          }
        }
        description
      }
    }
  }
`;
