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

document.getElementById('contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get('name') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const interest = String(data.get('interest') || '').trim();
  const message = String(data.get('message') || '').trim();
  const text = [
    'Hello Vesterra Group,',
    '',
    `I’m ${name} and I’m interested in ${interest}.`,
    `My phone number is ${phone}.`,
    message ? `Message: ${message}` : ''
  ].filter(Boolean).join('\n');
  window.open(`https://wa.me/919878708190?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});

document.getElementById('year').textContent = new Date().getFullYear();
