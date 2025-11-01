import * as React from "react";
import { Link, graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import SiteHeader from "../../components/SiteHeader";
import Seo from "../../components/SEO";

export const Head = ({ location }) => (
  <Seo title="Devocionais" pathname={location.pathname} />
);

export default function DevocionaisPage({ data }) {
  const posts = data.allMdx.nodes;

  return (
    <>
      <SiteHeader />
      <main className="container">
        <h1 style={{ marginBottom: 8 }}>Devocionais</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          Mensagens curtas em formato MDX.
        </p>

        <div className="cards cards-3" style={{ marginTop: 20 }}>
          {posts.map((p) => {
            const img = p.frontmatter.cover ? getImage(p.frontmatter.cover) : null;
            const url = `/devocionais/${p.frontmatter.slug || p.id}/`;
            return (
              <article key={p.id} className="card">
                <Link to={url} className="card-link">
                  {img && (
                    <GatsbyImage image={img} alt={p.frontmatter.title} className="card-img" />
                  )}
                  <div className="card-body">
                    <h3 className="card-title" style={{ marginBottom: 4 }}>
                      {p.frontmatter.title}
                    </h3>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {new Date(p.frontmatter.date).toLocaleDateString()}
                    </div>
                    {p.frontmatter.description && (
                      <p className="muted" style={{ marginTop: 8 }}>
                        {p.frontmatter.description}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}

export const pageQuery = graphql`
  {
    allMdx(
      filter: { internal: { contentFilePath: { regex: "/content[\\\\/]{1}devocionais[\\\\/]/" } } }
      sort: { frontmatter: { date: DESC } }
      limit: 24
    ) {
      nodes {
        id
        frontmatter {
          title
          slug
          date
          description
          cover {
            childImageSharp {
              gatsbyImageData(width: 420, height: 236, placeholder: BLURRED, quality: 80)
            }
          }
        }
      }
    }
  }
`;
