import type { Metadata } from "next";
import { PublicLayout } from "@/components/public-layout";
import { TeamSection } from "@/components/team-section";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the leadership team guiding Vesterra Group across real estate, hospitality and investments.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return <PublicLayout current="/team" pageClass="team-page">
    <section className="page-hero compact">
      <div className="page-orb" />
      <div className="wrap">
        <div className="eyebrow">Our Team</div>
        <h1>Experience that leads.<br/><span>Perspective that lasts.</span></h1>
        <p>Meet the people shaping Vesterra’s direction and bringing a personal, informed approach to every opportunity.</p>
      </div>
    </section>
    <TeamSection />
  </PublicLayout>;
}
