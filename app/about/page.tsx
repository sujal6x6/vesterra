import { AnimatedBrand } from "@/components/animated-brand";
import { PublicLayout } from "@/components/public-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Discover the perspective, verticals and principles that shape Vesterra Group.",
  alternates: { canonical: "/about" },
};

const verticals = [
  {
    number: "01",
    title: "Real Estate",
    text: "We consider residential and commercial opportunities through the lens of location, purpose and the way people live and work.",
  },
  {
    number: "02",
    title: "Hospitality",
    text: "We value thoughtful environments, attentive service and the details that turn a place into a memorable experience.",
  },
  {
    number: "03",
    title: "Investments",
    text: "We examine opportunities with relevant context, clear thinking and a long-term perspective.",
  },
];

const approach = [
  {
    number: "01",
    title: "Understand the objective",
    text: "Every conversation begins with listening. We first learn what matters, what is being considered and what a meaningful outcome looks like.",
  },
  {
    number: "02",
    title: "Add useful perspective",
    text: "We focus the discussion on relevant information, thoughtful options and the context needed to make the next step clearer.",
  },
  {
    number: "03",
    title: "Stay personally involved",
    text: "Clear communication and personal attention remain central as the conversation moves from an idea towards a considered decision.",
  },
];

export default function AboutPage() {
  return <PublicLayout current="/about" pageClass="about-page">
    <section className="page-hero">
      <div className="page-orb" />
      <div className="wrap">
        <div className="eyebrow">About Vesterra</div>
        <h1>Different ventures.<br/><span>One enduring standard.</span></h1>
        <p>Vesterra connects real estate, hospitality and investments through clear thinking, personal attention and a long-term point of view.</p>
      </div>
    </section>

    <section className="sec about-intro">
      <div className="wrap story-grid reveal">
        <AnimatedBrand />
        <div className="about-intro-copy">
          <div className="eyebrow">Who we are</div>
          <h2 className="h2">A group shaped around places, experiences and possibilities.</h2>
          <p className="lede">Vesterra Group brings three distinct worlds together under one clear perspective. Each vertical has its own purpose, yet all are guided by the same commitment to thoughtful choices and lasting value.</p>
          <p className="lede">We believe people deserve relevant context, honest communication and personal attention when exploring an opportunity. That belief guides every conversation across the group.</p>
          <div className="about-signature"><span>One group</span><strong>Three connected perspectives</strong></div>
        </div>
      </div>
    </section>

    <section className="sec about-verticals bg-soft">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="eyebrow">What we bring together</div>
          <h2 className="h2">Distinct areas of focus.<br/>A consistent point of view.</h2>
          <p className="lede">Our verticals reflect different needs and ambitions, while sharing an emphasis on quality, clarity and the longer view.</p>
        </div>
        <div className="about-vertical-grid">
          {verticals.map((item) => <article className="about-vertical-card reveal" key={item.number}>
            <span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="sec about-story">
      <div className="wrap about-story-grid reveal">
        <div className="about-story-image">
          <img src="/assets/properties/vesterra-hero-courtyard.webp" alt="Illustrative architecture with a landscaped courtyard" />
          <span>Building legacies · Creating futures</span>
        </div>
        <div>
          <div className="eyebrow">Our story</div>
          <h2 className="h2">A vision that continues to take shape.</h2>
          <p className="lede">Vesterra is being built around a long-term ambition: to create a group recognised for clarity, considered choices and relationships that endure.</p>
          <p className="lede">Rather than viewing real estate, hospitality and investments as isolated conversations, we see them as connected parts of how people live, experience places and plan for what comes next.</p>
          <p className="lede">Our story is still being written, and we intend to shape it with patience, purpose and close attention to every detail.</p>
        </div>
      </div>
    </section>

    <section className="sec about-method bg-soft">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="eyebrow">How we work</div>
          <h2 className="h2">Thoughtful from the first conversation.</h2>
        </div>
        <div className="about-steps">
          {approach.map((item) => <article className="about-step reveal" key={item.number}>
            <span>{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="sec principles">
      <div className="wrap principles-grid reveal">
        <div><div className="eyebrow">What guides us</div><h2 className="h2">Principles that stay consistent.</h2></div>
        <ul className="principle-list">
          <li><h3>Clarity</h3><p>We communicate directly and usefully, making the next step easier to understand.</p></li>
          <li><h3>Perspective</h3><p>We look beyond the immediate opportunity to consider the wider context.</p></li>
          <li><h3>Quality</h3><p>We bring care to the details, the experience and every visible expression of the group.</p></li>
          <li><h3>Continuity</h3><p>We approach relationships with consistency, personal attention and a long-term outlook.</p></li>
        </ul>
      </div>
    </section>

    <section className="sec about-cta">
      <div className="wrap reveal">
        <div><div className="eyebrow">Start a conversation</div><h2>What are you looking to explore?</h2></div>
        <p>Tell us what matters to you, and our team will help take the conversation forward.</p>
        <a className="btn btn-primary" href="/contact">Talk to Vesterra <span aria-hidden="true">→</span></a>
      </div>
    </section>
  </PublicLayout>;
}
