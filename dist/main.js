const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.main-nav');

function setHeaderState() {
  header.classList.toggle('scrolled', window.scrollY > 28);
}

function closeMenu() {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menu.classList.toggle('open', !isOpen);
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  document.body.classList.toggle('menu-open', !isOpen);
});

menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', setHeaderState, { passive: true });
setHeaderState();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

document.getElementById('contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get('name') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const interest = String(data.get('interest') || '').trim();
  const message = String(data.get('message') || '').trim();

  const lines = [
    'Hello Vesterra Group,',
    '',
    `I’m ${name}. I’m interested in: ${interest}.`,
    phone ? `My phone number is ${phone}.` : '',
    message ? `Message: ${message}` : '',
  ].filter(Boolean);

  window.open(`https://wa.me/919878708190?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
});

document.getElementById('year').textContent = new Date().getFullYear();
