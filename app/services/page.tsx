import Link from "next/link";
import { PublicLayout } from "@/components/public-layout";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Our Verticals",
  description: "Explore Vesterra Group across real estate, hospitality and investments—three focused verticals connected by quality and a long-term perspective.",
  path: "/services",
});

const verticals = [
  {
    number: "01",
    id: "real-estate",
    kicker: "Places with purpose",
    title: "Real Estate",
    text: "Residential and commercial opportunities considered around how people live, work and build lasting value.",
    detail: "Residential · Commercial · Property opportunities",
    href: "/properties",
    action: "Explore properties",
  },
  {
    number: "02",
    id: "hospitality",
    kicker: "Experiences with character",
    title: "Hospitality",
    text: "Thoughtful stays and spaces shaped around comfort, attentive service and the details people remember.",
    detail: "Stays · Experiences · Service",
    href: "/contact?interest=Hospitality",
    action: "Discuss hospitality",
  },
  {
    number: "03",
    id: "investments",
    kicker: "Perspective for tomorrow",
    title: "Investments",
    text: "Measured opportunities approached with context, clarity and a disciplined, longer-term point of view.",
    detail: "Perspective · Discipline · Long-term value",
    href: "/contact?interest=Investments",
    action: "Start a conversation",
  },
];

export default function ServicesPage() {
  return <PublicLayout current="/services" pageClass="services-page">
    <section className="page-hero services-hero">
      <div className="page-orb" />
      <div className="wrap">
        <div className="eyebrow">Our verticals</div>
        <h1>Three focused worlds.<br/><span>One Vesterra vision.</span></h1>
        <p>Distinct fields, connected by thoughtful decisions, personal attention and a commitment to lasting value.</p>
        <nav className="vertical-jump-nav" aria-label="Explore our verticals">
          {verticals.map((vertical) => <a href={`#${vertical.id}`} key={vertical.id}>
            <span>{vertical.number}</span>{vertical.title}
          </a>)}
        </nav>
      </div>
    </section>

    <section className="sec services-showcase" aria-labelledby="verticals-title">
      <div className="wrap services-intro">
        <div>
          <div className="eyebrow">Where we focus</div>
          <h2 className="h2" id="verticals-title">Built differently.<br/><em>Connected deliberately.</em></h2>
        </div>
        <p className="lede">Each vertical responds to a different ambition. Together, they reflect one clear approach: understand the context, focus on what matters and take the longer view.</p>
      </div>

      <div className="wrap vertical-rail-head" aria-hidden="true">
        <span>Explore all three verticals</span>
        <span>Auto-swipes · swipe anytime <b>→</b></span>
      </div>

      <div className="wrap vertical-page-list">
        {verticals.map((vertical) => <article className="vertical-page-card reveal" id={vertical.id} key={vertical.number}>
          <span className="vertical-number">{vertical.number}</span>
          <div className="vertical-card-copy">
            <small>{vertical.kicker}</small>
            <h2>{vertical.title}</h2>
            <p>{vertical.text}</p>
            <div className="vertical-detail">{vertical.detail}</div>
          </div>
          <Link href={vertical.href}>{vertical.action}<b aria-hidden="true">↗</b></Link>
        </article>)}
      </div>
    </section>

    <section className="sec services-cta">
      <div className="wrap services-cta-card reveal">
        <div>
          <div className="eyebrow">One point of contact</div>
          <h2>Not sure where your enquiry belongs?</h2>
          <p>Tell us what you are considering. Our team will help you find the right starting point.</p>
        </div>
        <Link className="btn btn-primary" href="/contact">Talk to Vesterra <span>↗</span></Link>
      </div>
    </section>
  </PublicLayout>;
}
