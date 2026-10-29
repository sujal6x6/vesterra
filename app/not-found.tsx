import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/public-layout";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested page could not be found.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <PublicLayout>
    <section className="page-hero compact">
      <div className="page-orb" />
      <div className="wrap">
        <div className="eyebrow">404 · Page not found</div>
        <h1>This page has moved.<br/><span>Let’s find a better direction.</span></h1>
        <p>The page you requested is unavailable. Explore Vesterra’s properties, verticals or contact our team.</p>
        <div className="hero-ctas">
          <Link className="btn btn-primary" href="/">Return home</Link>
          <Link className="btn btn-secondary" href="/properties">Explore properties</Link>
        </div>
      </div>
    </section>
  </PublicLayout>;
}
