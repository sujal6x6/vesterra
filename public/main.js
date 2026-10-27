document.body.classList.remove('no-js');

const root = document.documentElement;
const header = document.getElementById('hdr');
const menuButton = document.querySelector('.menu-btn');
const themeButton = document.querySelector('.theme-toggle');
const navigation = document.getElementById('nav');

requestAnimationFrame(() => document.body.classList.add('loaded'));

function closeMenu() {
  if (!header || !menuButton) return;
  header.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}

menuButton?.addEventListener('click', () => {
  const open = header.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

function applyTheme(theme) {
  root.dataset.theme = theme;
  const dark = theme === 'dark';
  if (themeButton) {
    themeButton.classList.toggle('is-dark', dark);
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    const label = themeButton.querySelector('span');
    if (label) label.textContent = dark ? 'Light' : 'Dark';
  }
}

applyTheme(localStorage.getItem('vesterra-theme') || 'light');
themeButton?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('vesterra-theme', next);
  applyTheme(next);
});

window.addEventListener('scroll', () => header?.classList.toggle('scrolled', scrollY > 16), { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .14 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

function initAutoSwipeRails() {
  const mobile = window.matchMedia('(max-width: 620px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.exp-list, .why-grid, .public-gallery, .public-reviews, .process, .property-grid').forEach((rail) => {
    if (rail.dataset.autoSwipeReady) return;
    rail.dataset.autoSwipeReady = 'true';

    let visible = false;
    let pauseUntil = 0;
    let current = 0;

    const cards = () => [...rail.children].filter((card) => !card.classList.contains('proc-line') && !card.hidden);
    const pauseForInteraction = () => { pauseUntil = Date.now() + 9000; };
    ['pointerdown', 'touchstart', 'wheel'].forEach((eventName) => rail.addEventListener(eventName, pauseForInteraction, { passive: true }));

    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .45 }).observe(rail);

    window.setInterval(() => {
      const items = cards();
      if (!mobile.matches || reducedMotion.matches || !visible || document.hidden || items.length < 2 || Date.now() < pauseUntil) return;
      const nearest = items.reduce((best, card, index) => Math.abs(card.offsetLeft - rail.scrollLeft) < Math.abs(items[best].offsetLeft - rail.scrollLeft) ? index : best, 0);
      current = nearest >= items.length - 1 ? 0 : nearest + 1;
      rail.scrollTo({ left: items[current].offsetLeft - rail.offsetLeft, behavior: 'smooth' });
    }, 3400);
  });
}

initAutoSwipeRails();

document.getElementById('contact-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(event.currentTarget);
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('formStatus');
  button.disabled = true;
  button.textContent = 'Sending…';
  try {
    const response = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(data)),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not send your enquiry.');
    form.reset();
    status.textContent = 'Thank you. Your enquiry has been sent to Vesterra Group.';
    button.textContent = 'Enquiry Sent';
    if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: String(data.get('interest') || 'General enquiry') });
  } catch (error) {
    status.textContent = error.message || 'Could not send your enquiry. Please call or WhatsApp us.';
    button.textContent = 'Try Again';
    button.disabled = false;
  }
});

document.querySelectorAll('[id="year"]').forEach((element) => { element.textContent = new Date().getFullYear(); });

loadWebsiteSettings();

async function loadWebsiteSettings() {
  try {
    const response = await fetch('/api/public/settings', { cache: 'no-store' });
    if (!response.ok) return;
    const { settings } = await response.json();
    const hero = settings.hero || {};
    const contact = settings.contact || {};
    const social = settings.social || {};
    const integrations = settings.integrations || {};
    const setText = (id, value) => { const el = document.getElementById(id); if (el && value) el.textContent = value; };
    setText('heroEyebrow', hero.eyebrow);
    setText('heroLead', hero.lead);
    setText('heroCardTitle', hero.cardTitle);
    setText('heroCardText', hero.cardText);
    if (hero.title) {
      const lines = hero.title.split(/\n+/).map(line => line.trim()).filter(Boolean);
      const title = document.getElementById('heroTitle');
      if (title) {
        title.textContent = '';
        lines.forEach((line, index) => {
          const span = document.createElement('span');
          span.className = index ? 'ln hero-trust' : 'ln hero-values';
          if (index) { const accent = document.createElement('span'); accent.className = 'o'; accent.textContent = line; span.append(accent); }
          else {
            span.textContent = line;
            if (lines.length > 1) { const separator = document.createElement('span'); separator.className = 'sep'; separator.textContent = ' |'; span.append(separator); }
          }
          title.append(span);
        });
      }
    }
    if (contact.phone) {
      document.querySelectorAll('[data-phone-text]').forEach(el => { el.textContent = contact.phone; });
      document.querySelectorAll('[data-phone-link]').forEach(el => { el.href = `tel:${contact.phone.replace(/[^+\d]/g,'')}`; });
    }
    if (contact.address) {
      setText('addressText', contact.address);
      setText('footerAddress', contact.address);
      const addressLink = document.getElementById('addressLink');
      if (addressLink) addressLink.href = `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`;
    }
    const whatsappLink = document.getElementById('whatsappLink');
    if (contact.whatsapp && whatsappLink) whatsappLink.href = `https://wa.me/${contact.whatsapp.replace(/\D/g,'')}`;
    Object.entries(social).forEach(([key,value]) => { const link = document.querySelector(`[data-social="${key}"]`); if (link && value) link.href = value; });
    if (location.pathname === '/' && settings.seo?.title) document.title = settings.seo.title;
    const description = document.querySelector('meta[name="description"]');
    if (location.pathname === '/' && description && settings.seo?.description) description.content = settings.seo.description;
    if (integrations.metaPixelEnabled && /^\d{5,24}$/.test(String(integrations.metaPixelId || ''))) installMetaPixel(String(integrations.metaPixelId));
  } catch (_) {
    // The authored defaults remain visible if settings are temporarily unavailable.
  }
}

function installMetaPixel(pixelId) {
  if (typeof window.fbq === 'function') return;
  const fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
  fbq.queue = []; fbq.loaded = true; fbq.version = '2.0'; window.fbq = fbq;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.append(script);
  fbq('init', pixelId);
  fbq('track', 'PageView');
}

loadPublicContent().finally(initAutoSwipeRails);
loadFeaturedProperties();

const requestedProperty = new URLSearchParams(location.search).get('property');
const contactForm = document.getElementById('contact-form');
if (requestedProperty && contactForm) {
  const interest = contactForm.querySelector('[name="interest"]');
  const message = contactForm.querySelector('[name="message"]');
  if (interest) interest.value = 'Real Estate';
  if (message && !message.value) message.value = `I would like to know more about ${requestedProperty}.`;
}

async function loadFeaturedProperties() {
  const grid = document.getElementById('featuredProperties');
  const section = document.getElementById('featuredPropertiesSection');
  if (!grid || !section) return;
  try {
    const response = await fetch('/api/public/properties', { cache: 'no-store' });
    if (!response.ok) return;
    const { properties = [] } = await response.json();
    const homepageProperties = [...properties].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, 3);
    homepageProperties.forEach((property) => {
      const article = document.createElement('article');
      article.className = 'property-card reveal in';
      const imageLink = document.createElement('a');
      imageLink.className = 'property-image';
      imageLink.href = `/property/${encodeURIComponent(property.slug)}`;
      const imageUrl = propertyImageFor(property);
      if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `${property.title} — representative architectural visual`;
        img.loading = 'lazy';
        imageLink.append(img);
      } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'property-placeholder';
        const mark = document.createElement('span');
        mark.textContent = 'V';
        placeholder.append(mark);
        imageLink.append(placeholder);
      }
      const status = document.createElement('span');
      status.className = 'property-status';
      status.textContent = property.status;
      imageLink.append(status);
      if (imageUrl) {
        const visualNote = document.createElement('span');
        visualNote.className = 'property-visual-note';
        visualNote.textContent = 'Representative visual';
        imageLink.append(visualNote);
      }
      const body = document.createElement('div');
      body.className = 'property-body';
      const meta = document.createElement('div'); meta.className = 'property-meta';
      const type = document.createElement('span'); type.textContent = property.propertyType;
      const location = document.createElement('span'); location.textContent = property.location;
      meta.append(type, location);
      const title = document.createElement('h3'); title.textContent = property.title;
      const facts = document.createElement('div'); facts.className = 'property-facts';
      [property.bedrooms ? `${property.bedrooms} beds` : '', property.bathrooms ? `${property.bathrooms} baths` : '', property.area].filter(Boolean).forEach(value => { const span = document.createElement('span'); span.textContent = value; facts.append(span); });
      const foot = document.createElement('div'); foot.className = 'property-foot';
      const price = document.createElement('strong'); price.textContent = property.price;
      const link = document.createElement('a'); link.href = `/property/${encodeURIComponent(property.slug)}`; link.textContent = 'View property →';
      foot.append(price, link);
      body.append(meta, title, facts, foot);
      article.append(imageLink, body);
      grid.append(article);
    });
    section.hidden = homepageProperties.length === 0;
  } catch (_) {
    // The hand-authored home page remains complete without dynamic listings.
  }
}

function propertyImageFor(property) {
  const images = {
    'aerocity-courtyard-residence': '/assets/properties/aerocity-courtyard-residence.png',
    'canal-view-residences': '/assets/properties/canal-view-residences.png',
    'airport-district-offices': '/assets/properties/airport-district-offices.png',
  };
  return property.imageUrl || images[property.slug] || '';
}

async function loadPublicContent() {
  try {
    const response = await fetch('/api/public/content', { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    if (data.gallery?.length) {
      const section = document.getElementById('gallery');
      const grid = document.getElementById('publicGallery');
      data.gallery.forEach(item => {
        const article = document.createElement('article'); article.className = 'public-media';
        const media = document.createElement(item.type === 'video' ? 'video' : 'img'); media.src = item.url;
        if (item.type === 'video') { media.controls = true; media.preload = 'metadata'; } else { media.alt = item.title || ''; media.loading = 'lazy'; }
        const body = document.createElement('div'); const title = document.createElement('h3'); title.textContent = item.title || 'Vesterra'; body.append(title);
        if (item.caption) { const caption = document.createElement('p'); caption.textContent = item.caption; body.append(caption); }
        article.append(media, body); grid.append(article);
      });
      section.hidden = false;
    }
    if (data.reviews?.length) {
      const section = document.getElementById('reviews'); const grid = document.getElementById('publicReviews');
      data.reviews.forEach(item => {
        const article = document.createElement('article'); article.className = 'card public-review';
        const stars = document.createElement('div'); stars.className = 'review-stars'; stars.textContent = '★'.repeat(item.rating || 5);
        const quote = document.createElement('blockquote'); quote.textContent = item.message;
        const footer = document.createElement('footer'); footer.textContent = item.name;
        if (item.verified) { const badge = document.createElement('span'); badge.className = 'verified'; badge.textContent = 'Verified'; footer.append(badge); }
        article.append(stars, quote, footer); grid.append(article);
      });
      section.hidden = false;
    }
  } catch (_) {
    // Optional dynamic sections stay hidden if content is unavailable.
  }
}
