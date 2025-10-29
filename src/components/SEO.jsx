import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";

export default function Seo({ title, description, pathname, image }) {
  const { site } = useStaticQuery(graphql`
    query SeoSiteMeta {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
    }
  `);

  const meta = site?.siteMetadata ?? {};
  const metaTitle = title ? `${title} • ${meta.title}` : meta.title;
  const metaDesc = description || meta.description || "";
  const url = pathname ? new URL(pathname, meta.siteUrl).toString() : meta.siteUrl;
  const ogImage = image ? new URL(image, meta.siteUrl).toString() : undefined;

  return (
    <>
      <title>{metaTitle}</title>
      {metaDesc && <meta name="description" content={metaDesc} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={meta.title} />
      <meta property="og:title" content={metaTitle} />
      {metaDesc && <meta property="og:description" content={metaDesc} />}
      {url && <meta property="og:url" content={url} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter cards */}
      <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={metaTitle} />
      {metaDesc && <meta name="twitter:description" content={metaDesc} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </>
  );
}
