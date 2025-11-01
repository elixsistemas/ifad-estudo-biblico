import * as React from "react";
import { Link, navigate, useStaticQuery, graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import SiteHeader from "../components/SiteHeader";
import Seo from "../components/SEO";
import PrimaryButton from "../components/PrimaryButton";

export const Head = ({ location }) => <Seo pathname={location.pathname} />;

export default function Home() {
  // Busca os 3 devocionais mais recentes (MDX em /content/devocionais)
  const data = useStaticQuery(graphql`
    {
      recent: allMdx(
        filter: { internal: { contentFilePath: { regex: "/content[\\\\/]{1}devocionais[\\\\/]/" } } }
        sort: { frontmatter: { date: DESC } }
        limit: 3
      ) {
        nodes {
          id
          frontmatter {
            title
            slug
            date
            cover {
              childImageSharp {
                gatsbyImageData(width: 420, height: 236, placeholder: BLURRED)
              }
            }
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  const posts = data.recent.nodes;

  return (
    <>
      <SiteHeader />
      <main className="container">
        {/* Hero */}
        <header className="hero">
          <h1>Estudo Bíblico IFAD</h1>
          <p className="note">Leitura diária e plano anual com progresso.</p>
          <div className="cta">
            <PrimaryButton className="btn solid" onClick={() => navigate("/plano")}>Plano Anual</PrimaryButton>
            <PrimaryButton className="btn outline" onClick={() => navigate("/app/reader")}>Leitura</PrimaryButton>
          </div>
        </header>

        {/* Cards principais */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
          <div className="card">
            <h3>Leitura Guiada</h3>
            <p>
              Escolha livro, capítulo e verso. Quando aberto pelo plano, os botões
              avançam/retrocedem entre as leituras do dia.
            </p>
          </div>
          <div className="card">
            <h3>Pedidos de Oração</h3>
            <p>Envie pedidos para a equipe pastoral.</p>
            <Link className="btn" to="/pedido-oracao">Enviar pedido</Link>
          </div>
        </section>

        {/* Devocionais recentes */}
        <section style={{ marginTop: 32 }}>
          <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <h2 style={{ margin: 0 }}>Devocionais recentes</h2>
            <Link to="/devocionais/" className="link">ver todos</Link>
          </div>

          <div className="cards">
            {posts.map((p) => {
              const img = p.frontmatter.cover ? getImage(p.frontmatter.cover) : null;
              const slug = p.frontmatter.slug || p.id;
              const date = p.frontmatter.date
                ? new Date(p.frontmatter.date).toLocaleDateString("pt-BR")
                : "";
              return (
                <article key={p.id} className="card">
                  <Link to={`/devocionais/${slug}/`} className="card-link">
                    {img && <GatsbyImage image={img} alt={p.frontmatter.title} className="card-img" />}
                    <div className="card-body">
                      <h3 className="card-title">{p.frontmatter.title}</h3>
                      {date && <div className="muted">{date}</div>}
                    </div>
                  </Link>
                </article>
              );
            })}
            {/* Se ainda não houver MDX, mostra um placeholder simpático */}
            {posts.length === 0 && (
              <div className="card">
                <div className="card-body">
                  <strong>Nenhum devocional publicado ainda.</strong>
                  <p className="muted" style={{ marginTop: 6 }}>
                    Adicione arquivos <code>*.mdx</code> em <code>content/devocionais/</code> com
                    <code>title</code>, <code>date</code>, <code>slug</code> e (opcional) <code>cover</code>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
