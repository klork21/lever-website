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

  // Close mobile menu when a link is tapped
  mobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobile.classList.remove('open');
      mobile.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

function initDropdowns() {
  // Desktop: CSS handles hover; JS click provides keyboard/touch fallback
  document.querySelectorAll('.nav__item--drop').forEach(parent => {
    const btn = parent.querySelector('.nav__drop-btn');
    if (!btn) return;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = parent.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
      // Close sibling dropdowns
      document.querySelectorAll('.nav__item--drop').forEach(other => {
        if (other !== parent) {
          other.classList.remove('open');
          other.querySelector('.nav__drop-btn')?.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Clicks inside the panel don't bubble up to the outside-click handler
    parent.querySelector('.nav__drop-panel')?.addEventListener('click', e => {
      e.stopPropagation();
    });
  });

  // Close all dropdowns on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav__item--drop.open').forEach(parent => {
      parent.classList.remove('open');
      parent.querySelector('.nav__drop-btn')?.setAttribute('aria-expanded', 'false');
    });
  });

  // Mobile accordions
  [
    { toggleId: 'mob-agents-toggle',  subId: 'mob-agents-sub'  },
    { toggleId: 'mob-company-toggle', subId: 'mob-company-sub' },
  ].forEach(({ toggleId, subId }) => {
    const toggle = document.getElementById(toggleId);
    const sub    = document.getElementById(subId);
    if (!toggle || !sub) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      sub.classList.toggle('open');
      sub.setAttribute('aria-hidden', !isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });
  });
}

function highlightActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll(
    '.nav__link, .nav__mob-link, .nav__drop-link, .nav__mob-sub-link'
  ).forEach(link => {
    const href = (link.getAttribute('href') || '').replace(/^\//, '');
    if (href === page) {
      link.classList.add('active');
      // Also highlight the parent dropdown button
      const dropParent = link.closest('.nav__item--drop');
      if (dropParent) {
        dropParent.querySelector('.nav__drop-btn')?.classList.add('active');
      }
    }
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
  initDropdowns();
  highlightActiveLink();
  initFAQ();
}

document.addEventListener('DOMContentLoaded', init);
