import { PublicLayout } from "@/components/public-layout";
import { TeamSection } from "@/components/team-section";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Our Team",
  description: "Meet the leadership team guiding Vesterra Group across real estate, hospitality and investments.",
  path: "/team",
});

export default function TeamPage() {
  return <PublicLayout current="/team" pageClass="team-page">
    <section className="page-hero compact">
      <div className="page-orb" />
      <div className="wrap">
        <div className="eyebrow">Our Team</div>
        <h1>Experience that leads.<br/><span>Perspective that lasts.</span></h1>
        <p>Meet the people shaping Vesterra’s direction with experience, clarity and personal attention.</p>
      </div>
    </section>
    <TeamSection />
  </PublicLayout>;
}
