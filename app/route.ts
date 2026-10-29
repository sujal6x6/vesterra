import siteHtml from "../public/site.html?raw";
import { absoluteSiteUrl, getSiteSettings, normaliseSiteUrl } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSiteSettings();
  const { seo, contact, social } = settings;
  const siteUrl = normaliseSiteUrl(seo.siteUrl);
  const image = absoluteSiteUrl(seo.ogImage, siteUrl);
  const schema = seo.localBusinessEnabled ? {
    "@context":"https://schema.org", "@type":seo.businessType || "RealEstateAgent", "@id":`${siteUrl}/#organization`,
    name:seo.businessName || "Vesterra Group", url:siteUrl, logo:absoluteSiteUrl("/assets/vesterra-mark.svg", siteUrl), image,
    telephone:seo.businessPhone || contact.phone, address:{"@type":"PostalAddress",streetAddress:contact.address,addressLocality:"Mohali",addressRegion:"Punjab",addressCountry:"IN"},
    priceRange:seo.priceRange || undefined, sameAs:[social.instagram,social.facebook,social.whatsappChannel].filter(Boolean),
    geo:seo.latitude && seo.longitude ? {"@type":"GeoCoordinates",latitude:seo.latitude,longitude:seo.longitude} : undefined,
  } : null;
  const tags = [
    `<link rel="canonical" href="${escapeAttribute(siteUrl)}/${""}">`,
    `<meta name="robots" content="${seo.robotsIndex ? "index" : "noindex"},${seo.robotsFollow ? "follow" : "nofollow"}">`,
    `<meta name="keywords" content="${escapeAttribute(seo.keywords)}">`,
    `<meta property="og:type" content="website"><meta property="og:site_name" content="Vesterra Group"><meta property="og:url" content="${escapeAttribute(siteUrl)}"><meta property="og:title" content="${escapeAttribute(seo.ogTitle || seo.title)}"><meta property="og:description" content="${escapeAttribute(seo.ogDescription || seo.description)}"><meta property="og:image" content="${escapeAttribute(image)}">`,
    `<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeAttribute(seo.ogTitle || seo.title)}"><meta name="twitter:description" content="${escapeAttribute(seo.ogDescription || seo.description)}"><meta name="twitter:image" content="${escapeAttribute(image)}">`,
    seo.twitterHandle ? `<meta name="twitter:site" content="${escapeAttribute(seo.twitterHandle)}">` : "",
    seo.googleVerification ? `<meta name="google-site-verification" content="${escapeAttribute(seo.googleVerification)}">` : "",
    seo.bingVerification ? `<meta name="msvalidate.01" content="${escapeAttribute(seo.bingVerification)}">` : "",
    schema ? `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,"\\u003c")}</script>` : "",
  ].join("");
  const html = siteHtml
    .replace(/<title>.*?<\/title>/, `<title>${escapeAttribute(seo.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeAttribute(seo.description)}">`)
    .replace("</head>", `${tags}</head>`);
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-cache",
    },
  });
}

function escapeAttribute(value:string) {
  return String(value || "").replace(/[&<>\"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char] || char));
}
