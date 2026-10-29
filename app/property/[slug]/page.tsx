import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { properties } from "@/db/schema";
import { PublicLayout } from "@/components/public-layout";
import { propertyImageFor } from "@/lib/property-images";
import { absoluteSiteUrl, getSiteSettings, normaliseSiteUrl } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

async function findProperty(slug:string) {
  const rows = await getDb().select().from(properties).where(and(eq(properties.slug, slug), eq(properties.published, true))).limit(1);
  return rows[0] || null;
}

export async function generateMetadata({ params }:{ params:Promise<{slug:string}> }):Promise<Metadata> {
  const { slug } = await params;
  const property = await findProperty(slug);
  const { seo } = await getSiteSettings();
  const siteUrl = normaliseSiteUrl(seo.siteUrl);
  const imageUrl = property ? absoluteSiteUrl(propertyImageFor(property), siteUrl) : undefined;
  const description = property?.description?.trim() || (property ? `Explore ${property.title} in ${property.location} with Vesterra Group.` : "Property details from Vesterra Group.");
  return property
    ? { title:property.title, description:description.slice(0, 160), alternates:{canonical:`/property/${property.slug}`}, openGraph:{type:"website",locale:"en_IN",siteName:"Vesterra Group",title:`${property.title} | Vesterra Group`,description:description.slice(0,160),url:`${siteUrl}/property/${property.slug}`,images:imageUrl?[{url:imageUrl,alt:property.title}]:undefined}, twitter:{card:"summary_large_image",title:`${property.title} | Vesterra Group`,description:description.slice(0,160),images:imageUrl?[imageUrl]:undefined} }
    : { title:"Property", robots:{index:false,follow:true} };
}

export default async function PropertyPage({ params }:{ params:Promise<{slug:string}> }) {
  const { slug } = await params;
  const property = await findProperty(slug);
  if (!property) notFound();
  const imageUrl = propertyImageFor(property);
  const settings = await getSiteSettings();
  const siteUrl = normaliseSiteUrl(settings.seo.siteUrl);
  const listingSchema = {"@context":"https://schema.org","@type":"RealEstateListing",name:property.title,description:property.description,url:`${siteUrl}/property/${property.slug}`,image:absoluteSiteUrl(imageUrl,siteUrl),datePosted:property.createdAt,address:{"@type":"PostalAddress",addressLocality:property.location,addressRegion:"Punjab",addressCountry:"IN"}};

  const facts = [
    property.bedrooms > 0 ? { value:String(property.bedrooms), label:"Bedrooms" } : null,
    property.bathrooms > 0 ? { value:String(property.bathrooms), label:"Bathrooms" } : null,
    property.area ? { value:property.area, label:"Area" } : null,
    { value:property.status, label:"Availability" },
  ].filter(Boolean) as Array<{value:string;label:string}>;

  return <PublicLayout current="/properties" pageClass="property-single-page property-showcase-page"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(listingSchema).replace(/</g,"\\u003c")}}/>
    <section className="property-showcase">
      <div className="property-showcase-media">
        {imageUrl
          ? <img src={imageUrl} alt={`${property.title} — representative architectural visual`}/>
          : <div className="property-cinematic-placeholder"><span>V</span></div>}
        <span className="property-photo-label">Representative visual · {property.location}</span>
      </div>
      <div className="property-showcase-shade"/>
      <div className="property-orbit property-orbit-one"/><div className="property-orbit property-orbit-two"/>
      <div className="wrap property-showcase-content">
        <div className="property-showcase-top">
          <a href="/properties" className="property-back">← All properties</a>
          <span className="property-showcase-status">{property.status}</span>
        </div>
        <div className="property-showcase-copy">
          <div className="property-kicker">{property.propertyType} · {property.location}</div>
          <h1>{property.title}</h1>
          <div className="property-showcase-bottom"><strong>{property.price}</strong><a href="#property-overview">Discover the property <span>↓</span></a></div>
        </div>
      </div>
    </section>

    <div className="property-fact-dock"><div className="wrap property-fact-row">{facts.map((fact,index)=><div className="property-fact" key={fact.label} style={{"--fact-delay":`${index * 90}ms`} as CSSProperties}><b>{fact.value}</b><span>{fact.label}</span></div>)}</div></div>

    <section className="sec property-story-section" id="property-overview">
      <div className="wrap property-story-grid">
        <div className="property-story-heading reveal"><span className="property-section-index">01</span><div className="eyebrow">The property</div><h2 className="h2">A closer<br/><span>perspective.</span></h2></div>
        <div className="property-story-copy reveal">
          <p className="property-intro">{property.description || "Contact the Vesterra team for complete details, availability and a personal discussion about this property."}</p>
          <div className="property-detail-list"><div><span>Property type</span><b>{property.propertyType}</b></div><div><span>Location</span><b>{property.location}</b></div><div><span>Price</span><b>{property.price}</b></div></div>
        </div>
      </div>
    </section>

    <section className="property-lens">
      <div className="property-lens-mark">V</div>
      <div className="wrap">
        <div className="property-lens-head reveal"><span className="property-section-index">02</span><div><div className="eyebrow">The Vesterra lens</div><h2>What we help you understand.</h2></div></div>
        <div className="property-lens-grid">
          <article className="reveal"><span>01</span><h3>The setting</h3><p>Understand the opportunity within {property.location} and how the address fits your plans.</p></article>
          <article className="reveal"><span>02</span><h3>The space</h3><p>Review the essential property details, layout considerations and current availability clearly.</p></article>
          <article className="reveal"><span>03</span><h3>The decision</h3><p>Move forward with a personal discussion, transparent information and considered guidance.</p></article>
        </div>
      </div>
    </section>

    <section className="property-enquiry">
      <div className="wrap property-enquiry-inner reveal">
        <div><div className="eyebrow">Interested in this property?</div><h2>Let’s explore<br/><span>{property.title}.</span></h2></div>
        <div className="property-enquiry-action"><p>Speak with Vesterra for availability, complete details and the next step.</p><a className="btn btn-primary" href={`/contact?property=${encodeURIComponent(property.title)}`}>Enquire now <span>↗</span></a></div>
      </div>
    </section>
  </PublicLayout>;
}
