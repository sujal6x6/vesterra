import { siteDefaults } from "@/lib/site-defaults";

export function GET() {
  return Response.json(
    {
      name: "Vesterra Group",
      short_name: "Vesterra",
      description: siteDefaults.seo.description,
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#f8f3e9",
      theme_color: "#07100c",
      lang: "en-IN",
      icons: [
        {
          src: "/assets/vesterra-mark.svg",
          sizes: "any",
          type: "image/svg+xml",
          purpose: "any maskable",
        },
      ],
    },
    {
      headers: {
        "content-type": "application/manifest+json; charset=utf-8",
        "cache-control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
