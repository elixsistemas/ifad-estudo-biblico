import * as React from "react";
import { graphql, Link, navigate } from "gatsby";
import SiteHeader from "../components/SiteHeader";
import PrimaryButton from "../components/PrimaryButton";
import { StaticImage } from "gatsby-plugin-image";

export default function Devocionais({ data }) {
  const posts = data.allMdx.nodes;
  return (
    <>
      <SiteHeader />
      <main className="container">
        <h1>Devocionais</h1>
        <p className="note">Leituras e reflexões em formato MDX.</p>

        {/* exemplo de imagem otimizada (marca "redimensionamento de imagens") */}
        <div className="card" style={{margin:"12px 0 20px"}}>
          <StaticImage
            src="../images/icon.png"
            alt="Ícone IFAD"
            width={128}
            placeholder="blurred"
          />
          <p className="note">Imagem otimizada via <code>gatsby-plugin-image</code>.</p>
        </div>

        <ul className="results">
          {posts.map(p => (
            <li key={p.id}>
              <Link to={`/devocionais/${p.frontmatter.slug}/`}>
                <strong>{p.frontmatter.title}</strong>
              </Link>
              <div className="note">{p.frontmatter.date} {p.frontmatter.referencia ? `• ${p.frontmatter.referencia}` : ""}</div>
            </li>
          ))}
        </ul>

        <div style={{marginTop:16}}>
          <PrimaryButton onClick={() => navigate("/criar-imagem/")}>
            Criar imagem com versículo
          </PrimaryButton>
        </div>
      </main>
    </>
  );
}

export const pageQuery = graphql`
  {
    allMdx(
      filter: { internal: { contentFilePath: { regex: "/content/devocionais/" } } }
      sort: {frontmatter: {date: DESC}}
    ) {
      nodes {
        id
        frontmatter { title slug referencia date(formatString: "DD/MM/YYYY") }
      }
    }
  }
`;
