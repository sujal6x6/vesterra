import type { ReactNode } from "react";
import Script from "next/script";

export function PublicLayout({ children, current, pageClass = "" }: { children:ReactNode; current?:string; pageClass?:string }) {
  const nav = [["/about","About"],["/services","Our Verticals"],["/properties","Properties"],["/contact","Contact"]];
  return <div className={`site-page ${pageClass}`.trim()}>
    <link rel="stylesheet" href="/styles.css" />
    <header className="hdr" id="hdr"><div className="wrap hdr-in">
      <a href="/" className="brand" aria-label="Vesterra Group home"><img src="/assets/vesterra-logo.jpeg" alt="Vesterra Group"/><span><strong>Vesterra</strong><small>Group</small></span></a>
      <nav className="nav" id="nav" aria-label="Main navigation">{nav.map(([href,label])=><a key={href} href={href} className={current===href?"active":""}>{label}</a>)}<a href="/contact" className="btn btn-primary mnav-cta">Talk to Us</a></nav>
      <a href="/contact" className="btn btn-primary hdr-cta">Talk to Us</a>
      <button className="theme-toggle" type="button" aria-label="Switch to dark mode" aria-pressed="false"><svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg><svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg><span>Dark</span></button>
      <button className="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav"><span/></button>
    </div></header>
    <main>{children}</main>
    <footer className="ftr"><div className="wrap ftr-grid">
      <div><a href="/" className="brand footer-brand"><img src="/assets/vesterra-logo.jpeg" alt=""/><span><strong>Vesterra</strong><small>Group</small></span></a><p>Building legacies. Creating futures.</p></div>
      <div><h4>Explore</h4><a href="/about">About</a><a href="/services">Our Verticals</a><a href="/properties">Properties</a><a href="/contact">Contact</a></div>
      <div><h4>Connect</h4><div className="social-links">
        <a className="social-link" data-social="instagram" href="https://www.instagram.com/vesterragroup" target="_blank" rel="noopener" aria-label="Vesterra on Instagram"><span className="social-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></span><span>Instagram</span></a>
        <a className="social-link" data-social="facebook" href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Vesterra on Facebook"><span className="social-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.2 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H8V13h2.8v8h3.4Z"/></svg></span><span>Facebook</span></a>
        <a className="social-link" data-social="whatsappChannel" href="https://whatsapp.com/channel/0029VbE8aLwAO7RLOf1tpO0K" target="_blank" rel="noopener" aria-label="Vesterra WhatsApp channel"><span className="social-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6Z"/><path d="M8.6 8.2c.3 3.3 2.1 5.1 5.4 5.8l1.2-1.2c.2-.2.5-.2.7-.1l2 .9M8.7 8.4 7.8 6.5c-.1-.3 0-.5.2-.7l1.1-1"/></svg></span><span>WhatsApp</span></a>
      </div></div>
      <div><h4>Contact</h4><a data-phone-link data-phone-text href="tel:+919878708190">+91 98787 08190</a><p id="footerAddress">SCO 254, 6th Floor, Mohali Citi Centre 2, Aerocity, F Block</p></div>
    </div><div className="wrap ftr-bot"><span>© {new Date().getFullYear()} Vesterra Group. All rights reserved.</span><a href="#top">Back to top ↑</a></div></footer>
    <a className="wa" id="whatsappLink" href="https://wa.me/919878708190" target="_blank" rel="noopener" aria-label="Chat with Vesterra Group on WhatsApp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6Z"/><path d="M8.6 8.2c.3 3.3 2.1 5.1 5.4 5.8l1.2-1.2c.2-.2.5-.2.7-.1l2 .9M8.7 8.4 7.8 6.5c-.1-.3 0-.5.2-.7l1.1-1"/></svg></a>
    <Script src="/main.js" strategy="afterInteractive" />
  </div>;
}

export function PropertyCard({ property }: { property:any }) {
  return <article className="property-card reveal in">
    <a className="property-image" href={`/property/${property.slug}`}>{property.imageUrl?<img src={property.imageUrl} alt={property.title}/>:<div className="property-placeholder"><span>V</span></div>}<span className="property-status">{property.status}</span>{property.featured?<span className="property-featured">Featured</span>:null}</a>
    <div className="property-body"><div className="property-meta"><span>{property.propertyType}</span><span>{property.location}</span></div><h3><a href={`/property/${property.slug}`}>{property.title}</a></h3><div className="property-facts">{property.bedrooms>0?<span>{property.bedrooms} Beds</span>:null}{property.bathrooms>0?<span>{property.bathrooms} Baths</span>:null}{property.area?<span>{property.area}</span>:null}</div><div className="property-foot"><strong>{property.price}</strong><a href={`/property/${property.slug}`}>View details →</a></div></div>
  </article>;
}
