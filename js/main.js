// Component loader — injects nav and footer into every page
async function loadComponent(placeholderId, url) {
  const el = document.getElementById(placeholderId);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    el.outerHTML = await res.text();
  } catch (err) {
    console.warn('Component load failed:', err);
  }
}

function initNav() {
  const nav    = document.getElementById('main-nav');
  const burger = document.getElementById('nav-burger');
  const mobile = document.getElementById('nav-mobile');
  if (!nav || !burger || !mobile) return;

  // Toggle mobile menu
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    mobile.classList.toggle('open');
    mobile.setAttribute('aria-hidden', !open);
    burger.setAttribute('aria-expanded', open);
  });

  // Close mobile menu on link click
  mobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobile.classList.remove('open');
      mobile.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Scroll shadow
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function highlightActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });
}

function initFAQ() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    const btn    = item.querySelector('.faq__q');
    const answer = item.querySelector('.faq__a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Collapse all
      document.querySelectorAll('.faq__item').forEach(other => {
        other.querySelector('.faq__q')?.setAttribute('aria-expanded', 'false');
        other.querySelector('.faq__a')?.classList.remove('open');
      });

      // Expand clicked if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
}

async function init() {
  await Promise.all([
    loadComponent('nav-placeholder',    'components/nav.html'),
    loadComponent('footer-placeholder', 'components/footer.html'),
  ]);

  initNav();
  highlightActiveLink();
  initFAQ();
}

document.addEventListener('DOMContentLoaded', init);
