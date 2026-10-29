"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedBrand() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  return <div className="story-logo" id="brand-story" ref={container}>
    <div className={`brand-film ${visible ? "is-visible" : ""}`} role="img" aria-label="Animated Vesterra Group logo. Real Estate, Hospitality, Investments. Building legacies. Creating futures.">
      <img className="brand-film-still" src="/assets/vesterra-logo.jpeg" width="1254" height="1254" alt="" />
      <div className="brand-film-layers" aria-hidden="true">
        <div className="brand-film-layer brand-film-crest" />
        <div className="brand-film-layer brand-film-name" />
        <div className="brand-film-layer brand-film-group" />
        <div className="brand-film-layer brand-film-tagline" />
        <div className="brand-film-light" />
      </div>
    </div>
  </div>;
}
