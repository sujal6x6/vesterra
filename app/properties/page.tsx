import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { properties } from "@/db/schema";
import { PropertyCard, PublicLayout } from "@/components/public-layout";

export const dynamic = "force-dynamic";
export const metadata:Metadata = {
  title:"Properties | Vesterra Group",
  description:"Explore property opportunities listed by Vesterra Group.",
};

export default async function PropertiesPage() {
  const rows = await getDb().select().from(properties).where(eq(properties.published, true)).orderBy(desc(properties.createdAt));

  return <PublicLayout current="/properties" pageClass="properties-index-page">
    <section className="page-hero">
      <div className="page-orb"/>
      <div className="wrap">
        <div className="eyebrow">Property portfolio</div>
        <h1>Places with potential.<br/><span>Opportunities with perspective.</span></h1>
        <p>Explore Vesterra’s current property listings. Every available opportunity is presented with the essential details you need to begin a considered conversation.</p>
      </div>
    </section>
    <section className="sec property-listing-section">
      <div className="wrap">
        <div className="listing-head">
          <div><div className="eyebrow">Available listings</div><h2 className="h2">Find your next property.</h2></div>
          <div className="listing-summary"><span>{rows.length} {rows.length === 1 ? "property" : "properties"}</span>{rows.length > 1 ? <span className="mobile-swipe">Swipe to explore <b>→</b></span> : null}</div>
        </div>
        {rows.length
          ? <div className="property-grid" aria-label="Available properties">{rows.map(property => <PropertyCard property={property} key={property.id}/>)}</div>
          : <div className="listing-empty"><span>V</span><h2>New listings are being prepared.</h2><p>Contact our team to discuss current opportunities before they appear here.</p><a className="btn btn-primary" href="/contact">Talk to Vesterra</a></div>}
      </div>
    </section>
  </PublicLayout>;
}
