import siteHtml from "../public/site.html?raw";
import { absoluteSiteUrl, getSiteSettings, normaliseSiteUrl } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSiteSettings();
  if (settings.maintenance?.enabled) {
    return new Response(maintenanceHtml(), {
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
    });
  }
  const { seo, contact, social } = settings;
  const siteUrl = normaliseSiteUrl(seo.siteUrl);
  const image = absoluteSiteUrl(seo.ogImage, siteUrl);
  const organization = {
    "@type":seo.localBusinessEnabled ? (seo.businessType || "RealEstateAgent") : "Organization", "@id":`${siteUrl}/#organization`,
    name:seo.businessName || "Vesterra Group", url:siteUrl, logo:absoluteSiteUrl("/assets/vesterra-mark.svg", siteUrl), image,
    telephone:seo.businessPhone || contact.phone, address:{"@type":"PostalAddress",streetAddress:contact.address,addressLocality:"Mohali",addressRegion:"Punjab",addressCountry:"IN"},
    priceRange:seo.priceRange || undefined, sameAs:[social.instagram,social.facebook,social.whatsappChannel].filter(Boolean),
    geo:seo.latitude && seo.longitude ? {"@type":"GeoCoordinates",latitude:seo.latitude,longitude:seo.longitude} : undefined,
  };
  const schema = {"@context":"https://schema.org","@graph":[organization,{"@type":"WebSite","@id":`${siteUrl}/#website`,url:siteUrl,name:"Vesterra Group",description:seo.description,inLanguage:"en-IN",publisher:{"@id":`${siteUrl}/#organization`}}]};
  const tags = [
    `<link rel="canonical" href="${escapeAttribute(siteUrl)}/${""}">`,
    `<meta name="robots" content="${seo.robotsIndex ? "index" : "noindex"},${seo.robotsFollow ? "follow" : "nofollow"}">`,
    `<meta name="keywords" content="${escapeAttribute(seo.keywords)}">`,
    `<link rel="manifest" href="/manifest.webmanifest"><meta name="application-name" content="Vesterra Group">`,
    `<meta property="og:type" content="website"><meta property="og:locale" content="en_IN"><meta property="og:site_name" content="Vesterra Group"><meta property="og:url" content="${escapeAttribute(siteUrl)}"><meta property="og:title" content="${escapeAttribute(seo.ogTitle || seo.title)}"><meta property="og:description" content="${escapeAttribute(seo.ogDescription || seo.description)}"><meta property="og:image" content="${escapeAttribute(image)}"><meta property="og:image:alt" content="Vesterra Group">`,
    `<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeAttribute(seo.ogTitle || seo.title)}"><meta name="twitter:description" content="${escapeAttribute(seo.ogDescription || seo.description)}"><meta name="twitter:image" content="${escapeAttribute(image)}">`,
    seo.twitterHandle ? `<meta name="twitter:site" content="${escapeAttribute(seo.twitterHandle)}">` : "",
    seo.googleVerification ? `<meta name="google-site-verification" content="${escapeAttribute(seo.googleVerification)}">` : "",
    seo.bingVerification ? `<meta name="msvalidate.01" content="${escapeAttribute(seo.bingVerification)}">` : "",
    `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,"\\u003c")}</script>`,
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

function maintenanceHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Vesterra Group | Under Maintenance</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&display=swap" rel="stylesheet">
<style>
:root{--bg:#faf7f2;--text:#1a1612;--gold:#c98f2e;--glow:rgba(201,143,46,.25);box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root{color-scheme:dark;--bg:#0b0d12;--text:#f4efe6;--gold:#e9b261;--glow:rgba(233,178,97,.22)}}
html{height:100%}
*{box-sizing:border-box;margin:0}
body{min-height:100%;display:flex;align-items:center;padding:6vw clamp(20px,8vw,140px);background:var(--bg);color:var(--text);background-image:radial-gradient(60rem 30rem at 85% 50%,var(--glow),transparent 65%)}
h1{font:600 clamp(44px,9vw,110px)/1.03 "Cormorant Garamond",Georgia,serif;letter-spacing:-.01em}
h1 em{display:block;color:var(--gold);font-style:italic}
</style>
</head>
<body>
<h1>Under maintenance.<em>Back with promise.</em></h1>
</body>
</html>`;
}

function escapeAttribute(value:string) {
  return String(value || "").replace(/[&<>\"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char] || char));
}
