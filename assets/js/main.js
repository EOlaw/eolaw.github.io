/* ================================================================
   InsightSerenity — Main JavaScript
   - Auto time-based dark mode (7pm–7am = dark)
   - Manual theme toggle (persists in localStorage, overrides time)
   - Scroll reveal animations
   - Navbar scroll behavior
   - Mobile menu
   - FAQ accordion
   - Counter animations
   - Active nav link
   ================================================================ */

(function () {
  'use strict';

  /* ── Theme ──────────────────────────────────────────────────────── */
  const html = document.documentElement;
  const THEME_KEY = 'is-theme';
  const OVERRIDE_KEY = 'is-theme-override';

  function isNightTime() {
    const h = new Date().getHours();
    return h >= 19 || h < 7; // 7pm–7am = dark
  }

  function applyTheme(dark, updateIcon) {
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    if (updateIcon) syncThemeIcon(dark);
  }

  function syncThemeIcon(dark) {
    const btns = document.querySelectorAll('.theme-toggle');
    btns.forEach(btn => {
      btn.innerHTML = dark
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function initTheme() {
    const override = localStorage.getItem(OVERRIDE_KEY);
    if (override !== null) {
      applyTheme(override === 'dark', true);
    } else {
      applyTheme(isNightTime(), true);
    }
  }

  function toggleTheme() {
    const isDark = html.classList.contains('dark');
    const next = !isDark;
    localStorage.setItem(OVERRIDE_KEY, next ? 'dark' : 'light');
    applyTheme(next, true);
  }

  // Auto re-check every minute (handles crossing 7pm/7am boundary)
  function scheduleAutoThemeCheck() {
    setInterval(() => {
      if (localStorage.getItem(OVERRIDE_KEY) === null) {
        applyTheme(isNightTime(), true);
      }
    }, 60000);
  }

  /* ── Navbar ─────────────────────────────────────────────────────── */
  function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile Menu ─────────────────────────────────────────────────── */
  function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu   = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.innerHTML = open
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    });
    // Close on link click
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    }));
  }

  /* ── Nav Dropdown (click + hover fallback) ───────────────────────── */
  function initNavDropdown() {
    const dropdown = document.querySelector('.nav-dropdown');
    if (!dropdown) return;
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    let closeTimer;

    // Click toggles open/closed
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    // Keep open while mouse is inside dropdown
    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      dropdown.classList.add('open');
    });

    dropdown.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => {
        dropdown.classList.remove('open');
      }, 120);
    });

    // Close when clicking outside
    document.addEventListener('click', () => dropdown.classList.remove('open'));
  }

  /* ── Active Nav Link ─────────────────────────────────────────────── */
  function initActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkPage = href.split('/').pop();
      if (linkPage === page || (page === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ── Scroll Reveal ───────────────────────────────────────────────── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const delay = parseInt(el.dataset.delay || 0, 10);
          setTimeout(() => el.classList.add('visible'), delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }

  /* ── Counter Animation ───────────────────────────────────────────── */
  function initCounters() {
    const els = document.querySelectorAll('.counter');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target  = parseFloat(el.dataset.target);
        const suffix  = el.dataset.suffix || '';
        const isFloat = target % 1 !== 0;
        const duration = 1600;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = target * eased;
          el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString()) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach(el => io.observe(el));
  }

  /* ── FAQ Accordion ───────────────────────────────────────────────── */
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const btn = item.querySelector('.faq-btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ── Smooth scroll for anchor links ─────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ── Typewriter effect ───────────────────────────────────────────── */
  function initRotatingText() {
    const el = document.getElementById('typewriter-word');
    if (!el) return;
    const words = [
      'Business Intelligence',
      'Your Career',
      'Your Purpose',
      'Measurable Growth',
      'Lasting Impact',
    ];
    let wordIndex = 0;
    let charIndex = words[0].length; // start full, then delete
    let deleting = true;
    const TYPE_SPEED   = 75;
    const DELETE_SPEED = 40;
    const PAUSE_FULL   = 2400;
    const PAUSE_EMPTY  = 380;

    function tick() {
      const current = words[wordIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, PAUSE_FULL);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, PAUSE_EMPTY);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }
    setTimeout(tick, PAUSE_FULL);
  }

  /* ── Booking helpers ─────────────────────────────────────────────── */
  window.openCalendly = function (url) {
    const target = '/consultation.html#booking-request';
    if (window.location.pathname.includes('consultation')) {
      const form = document.getElementById('booking-request');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = target;
    }
  };

  /* ── Toast ───────────────────────────────────────────────────────── */
  window.showToast = function (msg, type) {
    const t = document.createElement('div');
    t.style.cssText = `
      position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;
      background:${type === 'error' ? '#ef4444' : '#111'};
      color:#fff;padding:.75rem 1.25rem;border-radius:.75rem;
      font-size:.8rem;font-weight:500;
      box-shadow:0 8px 32px rgba(0,0,0,.35);
      transform:translateX(120%);transition:transform .35s cubic-bezier(.175,.885,.32,1.275);
      max-width:22rem;
    `;
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.transform = 'translateX(0)'; });
    setTimeout(() => {
      t.style.transform = 'translateX(120%)';
      setTimeout(() => t.remove(), 400);
    }, 3500);
  };

  /* ── Contact form ────────────────────────────────────────────────── */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      // Replace with your real form endpoint (Formspree, Netlify Forms, etc.)
      const formspreeId = form.dataset.formspree || 'YOUR_FORMSPREE_ID';
      fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(r => {
          if (r.ok) {
            window.showToast('Message sent! I\'ll respond within 24 hours.');
            form.reset();
          } else {
            window.showToast('Something went wrong. Please email me directly.', 'error');
          }
        })
        .catch(() => window.showToast('Network error. Please try again.', 'error'))
        .finally(() => { btn.textContent = original; btn.disabled = false; });
    });
  }

  /* ── Booking request form ───────────────────────────────────────── */
  function initBookingRequestForm() {
    const form = document.getElementById('booking-request-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const data = new FormData(form);
      const name = (data.get('name') || '').trim();
      const email = (data.get('email') || '').trim();
      const service = (data.get('service') || '').trim();
      const preferredTimes = (data.get('preferred_times') || '').trim();

      if (!name || !email || !service || !preferredTimes) {
        window.showToast('Please fill in your name, email, service, and preferred times.', 'error');
        return;
      }

      const body = [
        'Hi Emmanuel,',
        '',
        'I would like to book a free consultation.',
        '',
        'Name: ' + name,
        'Email: ' + email,
        'Phone: ' + ((data.get('phone') || '').trim() || 'Not provided'),
        'Timezone: ' + ((data.get('timezone') || '').trim() || 'Not provided'),
        'Service: ' + service,
        '',
        'Preferred days/times:',
        preferredTimes,
        '',
        'What I would like to discuss:',
        ((data.get('message') || '').trim() || 'Not provided'),
        '',
        'Sent from the InsightSerenity consultation page.'
      ].join('\n');

      const mailto = 'mailto:emmanuel.ao@outlook.com'
        + '?subject=' + encodeURIComponent('Consultation request from ' + name)
        + '&body=' + encodeURIComponent(body);

      window.location.href = mailto;
      window.showToast('Your email app should open with the consultation request ready to send.');
    });
  }

  /* ── Floating Action Button ──────────────────────────────────────── */
  function initFab() {
    const btn = document.getElementById('fab-btn');
    const actions = document.getElementById('fab-actions');
    const container = document.getElementById('fab-container');
    if (!btn || !actions) return;
    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      actions.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (container && !container.contains(e.target)) {
        btn.classList.remove('open');
        actions.classList.remove('open');
      }
    });
  }

  /* ── Init ────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    scheduleAutoThemeCheck();
    initNavbar();
    initMobileMenu();
    initNavDropdown();
    initActiveNav();
    initReveal();
    initCounters();
    initFaq();
    initSmoothScroll();
    initRotatingText();
    initContactForm();
    initBookingRequestForm();
    initFab();

    // Attach theme toggle buttons
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    // Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });

})();
