import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";

export default function SEO({ title, description, image, pathname }) {
  const { site } = useStaticQuery(graphql`
    { site { siteMetadata { title description siteUrl } } }
  `);
  const siteT = site.siteMetadata.title;
  const siteD = site.siteMetadata.description;
  const siteU = site.siteMetadata.siteUrl;

  const metaTitle = title ? `${title} | ${siteT}` : siteT;
  const metaDesc  = description || siteD;
  const url       = `${siteU}${pathname || ""}`;
  const metaImage = image ? `${siteU}${image}` : undefined;

  return (
    <>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta property="og:site_name" content={siteT} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={url} />
      {metaImage && <meta property="og:image" content={metaImage} />}
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
