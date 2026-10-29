import type { Metadata } from "next";

const SITE_NAME = "Vesterra Group";
const SOCIAL_IMAGE = "/assets/properties/vesterra-hero-courtyard.webp";

export function createPageMetadata({
  title,
  description,
  path,
  image = SOCIAL_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url: path,
      images: [{ url: image, alt: socialTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}
