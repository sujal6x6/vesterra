import type { Metadata } from "next";
import "./globals.css";
import { absoluteSiteUrl, getSiteSettings, normaliseSiteUrl } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteSettings();
  const siteUrl = normaliseSiteUrl(seo.siteUrl);
  const socialImage = absoluteSiteUrl(seo.ogImage, siteUrl);
  return {
    metadataBase: new URL(siteUrl),
    applicationName: "Vesterra Group",
    title: { default: seo.title, template: "%s | Vesterra Group" },
    description: seo.description,
    manifest: "/manifest.webmanifest",
    authors: [{ name: "Vesterra Group", url: siteUrl }],
    creator: "Vesterra Group",
    publisher: "Vesterra Group",
    category: "Real Estate",
    keywords: seo.keywords.split(",").map((item) => item.trim()).filter(Boolean),
    robots: { index: seo.robotsIndex, follow: seo.robotsFollow, googleBot: { index: seo.robotsIndex, follow: seo.robotsFollow } },
    openGraph: { type: "website", locale: "en_IN", siteName: "Vesterra Group", url: siteUrl, title: seo.ogTitle || seo.title, description: seo.ogDescription || seo.description, images: [{ url: socialImage, alt: "Vesterra Group" }] },
    twitter: { card: "summary_large_image", site: seo.twitterHandle || undefined, title: seo.ogTitle || seo.title, description: seo.ogDescription || seo.description, images: [socialImage] },
    verification: { google: seo.googleVerification || undefined, other: seo.bingVerification ? { "msvalidate.01": seo.bingVerification } : undefined },
    icons: { icon: "/assets/vesterra-mark.svg", shortcut: "/assets/vesterra-mark.svg", apple: "/assets/vesterra-mark.svg" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const { seo, contact, social } = settings;
  const siteUrl = normaliseSiteUrl(seo.siteUrl);
  const organization = {
    "@type": seo.localBusinessEnabled ? (seo.businessType || "RealEstateAgent") : "Organization",
    "@id": `${siteUrl}/#organization`,
    name: seo.businessName || "Vesterra Group",
    url: siteUrl,
    logo: absoluteSiteUrl("/assets/vesterra-mark.svg", siteUrl),
    image: absoluteSiteUrl(seo.ogImage, siteUrl),
    telephone: seo.businessPhone || contact.phone,
    address: { "@type": "PostalAddress", streetAddress: contact.address, addressLocality: "Mohali", addressRegion: "Punjab", addressCountry: "IN" },
    priceRange: seo.priceRange || undefined,
    sameAs: [social.instagram, social.facebook, social.whatsappChannel].filter(Boolean),
    geo: seo.latitude && seo.longitude ? { "@type": "GeoCoordinates", latitude: seo.latitude, longitude: seo.longitude } : undefined,
  };
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Vesterra Group",
        description: seo.description,
        inLanguage: "en-IN",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Outfit:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/theme.css" />
        <link rel="stylesheet" href="/polish.css" />
      </head>
      <body className="antialiased"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}/>{children}</body>
    </html>
  );
}
