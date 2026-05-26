import { Helmet } from "react-helmet-async";
import { LOGO } from "../../lib/config.js";
import { DEFAULT_META_DESCRIPTION, SITE_NAME, SITE_TITLE, toAbsoluteUrl } from "../../lib/site.js";

export default function Seo({ title, description = DEFAULT_META_DESCRIPTION, path, image = LOGO, schema, noindex = false }) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_TITLE;
  const canonicalUrl = path ? toAbsoluteUrl(path) : (typeof window !== "undefined" ? window.location.href : "");
  const imageUrl = image ? toAbsoluteUrl(image) : undefined;
  const googleSiteVerification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION?.trim();

  return (
    <Helmet prioritizeSeoTags>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      {googleSiteVerification ? <meta name="google-site-verification" content={googleSiteVerification} /> : null}
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}

      {schema ? <script type="application/ld+json">{JSON.stringify(schema)}</script> : null}
    </Helmet>
  );
}
