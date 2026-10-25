document.body.classList.remove('no-js');

const root = document.documentElement;
const header = document.getElementById('hdr');
const menuButton = document.querySelector('.menu-btn');
const themeButton = document.querySelector('.theme-toggle');
const navigation = document.getElementById('nav');

requestAnimationFrame(() => document.body.classList.add('loaded'));

function closeMenu() {
  header.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}

menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

function applyTheme(theme) {
  root.dataset.theme = theme;
  const dark = theme === 'dark';
  themeButton.classList.toggle('is-dark', dark);
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  themeButton.querySelector('span').textContent = dark ? 'Light' : 'Dark';
}

applyTheme(localStorage.getItem('vesterra-theme') || 'light');
themeButton.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('vesterra-theme', next);
  applyTheme(next);
});

window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 16), { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .14 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.getElementById('contact-form').addEventListener('submit', async (event) => {
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
  } catch (error) {
    status.textContent = error.message || 'Could not send your enquiry. Please call or WhatsApp us.';
    button.textContent = 'Try Again';
    button.disabled = false;
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

loadWebsiteSettings();

async function loadWebsiteSettings() {
  try {
    const response = await fetch('/api/public/settings', { cache: 'no-store' });
    if (!response.ok) return;
    const { settings } = await response.json();
    const hero = settings.hero || {};
    const contact = settings.contact || {};
    const social = settings.social || {};
    if (hero.eyebrow) document.getElementById('heroEyebrow').textContent = hero.eyebrow;
    if (hero.lead) document.getElementById('heroLead').textContent = hero.lead;
    if (hero.cardTitle) document.getElementById('heroCardTitle').textContent = hero.cardTitle;
    if (hero.cardText) document.getElementById('heroCardText').textContent = hero.cardText;
    if (hero.title) {
      const lines = hero.title.split(/\n+/).map(line => line.trim()).filter(Boolean);
      const title = document.getElementById('heroTitle');
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
    if (contact.phone) {
      document.querySelectorAll('[data-phone-text]').forEach(el => { el.textContent = contact.phone; });
      document.querySelectorAll('[data-phone-link]').forEach(el => { el.href = `tel:${contact.phone.replace(/[^+\d]/g,'')}`; });
    }
    if (contact.address) {
      document.getElementById('addressText').textContent = contact.address;
      document.getElementById('footerAddress').textContent = contact.address;
      document.getElementById('addressLink').href = `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`;
    }
    if (contact.whatsapp) document.getElementById('whatsappLink').href = `https://wa.me/${contact.whatsapp.replace(/\D/g,'')}`;
    Object.entries(social).forEach(([key,value]) => { const link = document.querySelector(`[data-social="${key}"]`); if (link && value) link.href = value; });
    if (settings.seo?.title) document.title = settings.seo.title;
    const description = document.querySelector('meta[name="description"]');
    if (description && settings.seo?.description) description.content = settings.seo.description;
  } catch (_) {
    // The authored defaults remain visible if settings are temporarily unavailable.
  }
}

loadPublicContent();

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
