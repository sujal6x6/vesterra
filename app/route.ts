import siteHtml from "../public/site.html?raw";
import { absoluteSiteUrl, getSiteSettings, normaliseSiteUrl } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSiteSettings();
  if (settings.maintenance?.enabled) {
    return new Response(maintenanceHtml(settings.maintenance), {
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

function maintenanceHtml(maintenance: { title?: string; message?: string }) {
  const title = escapeAttribute(maintenance.title || "We’ll be back soon");
  const message = escapeAttribute(maintenance.message || "Our website is currently undergoing scheduled maintenance. Please check back shortly.");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title} | Vesterra Group</title><link rel="icon" href="/assets/vesterra-mark.svg"><style>@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');*{box-sizing:border-box}body{margin:0;min-height:100vh;background:#111214;color:#f8f5ef;font-family:'DM Sans',sans-serif;display:grid;place-items:center;padding:28px;overflow:hidden}body:before{content:'';position:fixed;width:620px;height:620px;border:1px solid #d5a64035;border-radius:50%;top:-250px;right:-170px}body:after{content:'';position:fixed;width:440px;height:440px;border:1px solid #d5a64022;border-radius:50%;bottom:-270px;left:-170px}.wrap{width:min(100%,820px);position:relative;z-index:1;text-align:center}.brand{display:inline-flex;align-items:center;gap:12px;color:#fff;text-decoration:none;text-transform:uppercase;letter-spacing:.22em;font-size:13px;font-weight:700}.brand img{width:48px;height:48px;border-radius:10px}.eyebrow{margin:74px 0 18px;color:#d5a640;font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase}.status{display:inline-flex;align-items:center;gap:9px;border:1px solid #d5a64050;border-radius:999px;color:#f3d98e;padding:8px 13px;font-size:12px}.dot{width:8px;height:8px;border-radius:50%;background:#d5a640;box-shadow:0 0 0 6px #d5a64018}.title{font:400 clamp(48px,9vw,92px)/.98 'DM Serif Display',serif;margin:23px 0 22px;letter-spacing:-.035em}.message{max-width:540px;margin:0 auto;color:#b6b4ae;font-size:16px;line-height:1.75}.line{width:110px;height:1px;background:#d5a640;margin:36px auto 20px}.foot{color:#777771;font-size:12px;letter-spacing:.06em}</style></head><body><main class="wrap"><a class="brand" href="/"><img src="/assets/vesterra-mark.svg" alt="Vesterra Group"><span>Vesterra Group</span></a><p class="eyebrow">Maintenance in progress</p><div class="status"><span class="dot"></span>We’re refreshing the experience</div><h1 class="title">${title}</h1><p class="message">${message}</p><div class="line"></div><p class="foot">Thank you for your patience.</p></main></body></html>`;
}

function escapeAttribute(value:string) {
  return String(value || "").replace(/[&<>\"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char] || char));
}
