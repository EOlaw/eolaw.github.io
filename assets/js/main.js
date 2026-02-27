/* ======================================================
   EOLAW Consulting — Main JavaScript
   ====================================================== */

// ---- Lucide Icons Init ----
function initIcons() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
document.addEventListener('DOMContentLoaded', initIcons);

// ---- Navbar scroll effect ----
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  function onScroll() {
    if (window.scrollY > 60) navbar.classList.add('nav-scrolled');
    else navbar.classList.remove('nav-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ---- Mobile menu toggle ----
(function () {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    if (isOpen) {
      menu.classList.add('hidden');
      if (menuIcon) { menuIcon.setAttribute('data-lucide', 'menu'); initIcons(); }
    } else {
      menu.classList.remove('hidden');
      if (menuIcon) { menuIcon.setAttribute('data-lucide', 'x'); initIcons(); }
    }
  });
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add('hidden');
      if (menuIcon) { menuIcon.setAttribute('data-lucide', 'menu'); initIcons(); }
    }
  });
})();

// ---- Active nav link ----
(function () {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (
      (path === '/' && href === '/') ||
      (href !== '/' && path !== '/' && path.includes(href.replace('.html', '')))
    ) {
      link.classList.add('nav-active');
    }
  });
})();

// ---- Scroll Reveal ----
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0, 10);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
})();

// ---- Counter Animation ----
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
(function () {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
})();

// ---- Typing Effect ----
function startTypingEffect(el, words, opts) {
  if (!el || !words.length) return;
  const { typeSpeed = 90, deleteSpeed = 50, pauseAfter = 2200, pauseBefore = 400 } = opts || {};
  let wIndex = 0, cIndex = 0, deleting = false;
  function tick() {
    const word = words[wIndex];
    if (deleting) { el.textContent = word.slice(0, cIndex - 1); cIndex--; }
    else { el.textContent = word.slice(0, cIndex + 1); cIndex++; }
    let delay = deleting ? deleteSpeed : typeSpeed;
    if (!deleting && cIndex === word.length) { delay = pauseAfter; deleting = true; }
    else if (deleting && cIndex === 0) { deleting = false; wIndex = (wIndex + 1) % words.length; delay = pauseBefore; }
    setTimeout(tick, delay);
  }
  tick();
}
(function () {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const words = (el.dataset.words || '').split(',').map(w => w.trim()).filter(Boolean);
  startTypingEffect(el, words);
})();

// ---- Toast Notification ----
function showToast(message, type) {
  type = type || 'success';
  const existing = document.getElementById('eolaw-toast');
  if (existing) existing.remove();
  const cfg = {
    success: { border: '#22c55e', color: '#4ade80', icon: 'check-circle' },
    error:   { border: '#ef4444', color: '#f87171', icon: 'x-circle' },
    info:    { border: '#ffc451', color: '#ffc451', icon: 'info' },
  }[type] || { border: '#ffc451', color: '#ffc451', icon: 'info' };
  const toast = document.createElement('div');
  toast.id = 'eolaw-toast';
  toast.className = 'toast';
  toast.innerHTML = `<div style="background:#111;border:1.5px solid ${cfg.border};border-radius:1rem;padding:1rem 1.25rem;display:flex;align-items:center;gap:.75rem;box-shadow:0 8px 32px rgba(0,0,0,.5);"><i data-lucide="${cfg.icon}" style="width:1.25rem;height:1.25rem;color:${cfg.color};flex-shrink:0;"></i><p style="color:#fff;font-size:.9rem;margin:0;font-family:Inter,sans-serif;">${message}</p><button onclick="this.closest('#eolaw-toast').remove()" style="background:none;border:none;color:#666;cursor:pointer;margin-left:auto;padding:.25rem;"><i data-lucide="x" style="width:1rem;height:1rem;"></i></button></div>`;
  document.body.appendChild(toast);
  if (typeof lucide !== 'undefined') lucide.createIcons();
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 5000);
}

// ---- FAQ Accordion ----
(function () {
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const chevron = btn.querySelector('.faq-chevron');
      const isOpen = answer.classList.contains('open');
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-chevron').forEach(c => c.classList.remove('rotated'));
      if (!isOpen) { answer.classList.add('open'); if (chevron) chevron.classList.add('rotated'); }
    });
  });
})();

// ---- Smooth anchor scroll ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

window.EOLAW = { showToast, animateCounter, startTypingEffect };
