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
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      toggle.innerHTML = open
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    });
    // Close on link click
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      toggle.setAttribute('aria-label', 'Open navigation menu');
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
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    html.classList.add('js-reveal');
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
    setTimeout(() => {
      els.forEach(el => {
        if (!el.classList.contains('visible')) el.classList.add('visible');
      });
    }, 900);
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
      'Business Systems',
      'AI Agents',
      'Intelligent Pipelines',
      'AI From Scratch',
      'Autonomous Workflows',
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
    const modal = document.getElementById('booking-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      const firstInput = modal.querySelector('input, select, textarea, button');
      if (firstInput) firstInput.focus();
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    const target = '/consultation.html#booking-request';
    if (window.location.pathname.includes('consultation')) {
      const form = document.getElementById('booking-request');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = target;
    }
  };

  window.closeBookingModal = function () {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.style.overflow = '';
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

      const requiredFields = Array.from(form.querySelectorAll('[required]'));
      const missing = requiredFields.find(field => {
        if (field.type === 'checkbox') return !field.checked;
        return !String(field.value || '').trim();
      });
      if (missing) {
        window.showToast('Please complete the required fields before sending.', 'error');
        missing.focus();
        return;
      }

      const emailField = form.querySelector('input[type=email]');
      if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
        window.showToast('Please enter a valid email address.', 'error');
        emailField.focus();
        return;
      }

      btn.textContent = 'Sending…';
      btn.disabled = true;
      // Replace with your real form endpoint (Formspree, Netlify Forms, etc.)
      const formspreeId = (form.dataset.formspree || '').trim();
      if (!formspreeId || formspreeId === 'YOUR_FORMSPREE_ID') {
        const data = new FormData(form);
        const fields = [];
        data.forEach((value, key) => fields.push(key + ': ' + value));
        const mailto = 'mailto:emmanuel.ao@outlook.com'
          + '?subject=' + encodeURIComponent('Website message from ' + (data.get('name') || 'InsightSerenity visitor'))
          + '&body=' + encodeURIComponent(fields.join('\n'));
        window.location.href = mailto;
        window.showToast('Your email app should open with the message ready to send.');
        btn.textContent = original;
        btn.disabled = false;
        return;
      }
      fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(r => {
          if (r.ok) {
            window.showToast('Message sent! I\'ll typically respond within one business day.');
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
        'Hello InsightSerenity,',
        '',
        'I would like to book a discovery consultation.',
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

    const modal = document.getElementById('booking-modal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) window.closeBookingModal();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.style.display !== 'none') {
          window.closeBookingModal();
        }
      });
    }
  }

  /* ── Floating AI Business Assistant ──────────────────────────────── */
  function initFab() {
    const btn = document.getElementById('fab-btn');
    const actions = document.getElementById('fab-actions');
    const container = document.getElementById('fab-container');
    if (!btn || !container) return;

    const storageKey = 'insightserenity_ai_messages';
    const welcome = 'Welcome to InsightSerenity. I can help you understand our services, technology capabilities, engagement process, pricing, or help identify a possible solution to a business challenge. What would you like to discuss?';
    const quickActions = [
      'What does InsightSerenity do?',
      'Which service fits my business?',
      'How much does a project cost?',
      'How does the process work?',
      'Tell me about AI & Automation',
      'Book a Discovery Call'
    ];

    let knowledge = null;
    let loading = false;
    let messages = loadMessages();

    container.classList.add('assistant-active');
    if (actions) actions.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-label', 'Open InsightSerenity AI Assistant');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'ai-assistant-panel');
    btn.innerHTML = businessLogoMarkup('');

    const panel = document.createElement('div');
    panel.className = 'ai-assistant-panel';
    panel.id = 'ai-assistant-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-labelledby', 'ai-assistant-title');
    panel.innerHTML = `
      <div class="ai-assistant-header">
        <div class="ai-assistant-title">
          <div class="ai-assistant-avatar" aria-hidden="true">${businessLogoMarkup('')}</div>
          <div>
            <strong id="ai-assistant-title">InsightSerenity AI</strong>
            <span>Business &amp; Technology Assistant</span>
          </div>
        </div>
        <div style="display:flex;gap:.4rem;align-items:center;">
          <button type="button" class="ai-assistant-clear">Clear</button>
          <button type="button" class="ai-assistant-close" aria-label="Close InsightSerenity AI Assistant">${iconX(15)}</button>
        </div>
      </div>
      <div class="ai-assistant-body">
        <p class="ai-assistant-status">Ask about our services, capabilities, process, pricing, or your technology challenge. Please avoid sharing passwords, credentials, or sensitive information.</p>
        <div class="ai-messages" id="ai-messages" aria-live="polite"></div>
        <div class="ai-quick-actions" id="ai-quick-actions"></div>
      </div>
      <div class="ai-assistant-actions">
        <a href="/consultation.html" class="btn btn-primary">Book a Discovery Call</a>
        <a href="/contact.html" class="btn btn-outline">Contact</a>
      </div>
      <form class="ai-assistant-form" id="ai-assistant-form">
        <label class="sr-only" for="ai-assistant-input">Message InsightSerenity AI</label>
        <input id="ai-assistant-input" class="ai-assistant-input" type="text" autocomplete="off" maxlength="1200" placeholder="Ask a question..." />
        <button type="submit" class="ai-assistant-send" aria-label="Send message">${iconSend(16)}</button>
      </form>
    `;
    container.insertBefore(panel, btn);

    const messageList = panel.querySelector('#ai-messages');
    const quickWrap = panel.querySelector('#ai-quick-actions');
    const form = panel.querySelector('#ai-assistant-form');
    const input = panel.querySelector('#ai-assistant-input');
    const send = panel.querySelector('.ai-assistant-send');
    const close = panel.querySelector('.ai-assistant-close');
    const clear = panel.querySelector('.ai-assistant-clear');

    renderMessages();
    renderQuickActions();
    loadKnowledge();

    btn.addEventListener('click', () => {
      panel.classList.contains('open') ? closeAssistant() : openAssistant();
    });
    close.addEventListener('click', closeAssistant);
    clear.addEventListener('click', () => {
      messages = [];
      sessionStorage.removeItem(storageKey);
      renderMessages();
      renderQuickActions();
      input.focus();
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || loading) return;
      input.value = '';
      submitMessage(text);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) closeAssistant();
    });
    document.addEventListener('click', (e) => {
      const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
      const clickedInside = container.contains(e.target) || path.includes(container);
      if (panel.classList.contains('open') && !clickedInside) closeAssistant();
    });

    function openAssistant() {
      panel.classList.add('open');
      btn.classList.add('open');
      btn.setAttribute('aria-label', 'Close InsightSerenity AI Assistant');
      btn.setAttribute('aria-expanded', 'true');
      setTimeout(() => input.focus(), 80);
    }

    function closeAssistant() {
      panel.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-label', 'Open InsightSerenity AI Assistant');
      btn.setAttribute('aria-expanded', 'false');
    }

    function loadMessages() {
      try {
        const saved = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
        return Array.isArray(saved) ? saved.slice(-16) : [];
      } catch (_) {
        return [];
      }
    }

    function saveMessages() {
      sessionStorage.setItem(storageKey, JSON.stringify(messages.slice(-16)));
    }

    function renderMessages() {
      const all = messages.length ? messages : [{ role: 'assistant', content: welcome }];
      messageList.innerHTML = all.map((message) => (
        message.typing
          ? `<div class="ai-message assistant ai-typing" aria-label="InsightSerenity AI is thinking"><span></span><span></span><span></span></div>`
          : `<div class="ai-message ${message.role === 'user' ? 'user' : 'assistant'}">${escapeHtml(message.content)}</div>`
      )).join('');
      messageList.parentElement.scrollTop = messageList.parentElement.scrollHeight;
    }

    function renderQuickActions() {
      quickWrap.innerHTML = messages.length ? '' : quickActions.map((label) => (
        `<button type="button" class="ai-chip">${escapeHtml(label)}</button>`
      )).join('');
      quickWrap.querySelectorAll('button').forEach((chip) => {
        chip.addEventListener('click', (event) => {
          event.stopPropagation();
          openAssistant();
          submitMessage(chip.textContent.trim());
        });
      });
    }

    function setLoading(next) {
      loading = next;
      send.disabled = next;
      input.disabled = next;
      if (next) {
        messages.push({ role: 'assistant', content: '', typing: true });
        renderMessages();
      } else {
        const last = messages[messages.length - 1];
        if (last && last.typing) messages.pop();
      }
    }

    async function submitMessage(text) {
      messages.push({ role: 'user', content: text });
      saveMessages();
      renderQuickActions();
      setLoading(true);
      const startedAt = Date.now();
      try {
        const reply = await askAssistant();
        await waitForThinking(startedAt);
        setLoading(false);
        messages.push({ role: 'assistant', content: reply });
      } catch (_) {
        await waitForThinking(startedAt);
        setLoading(false);
        messages.push({ role: 'assistant', content: localAnswer(text) });
      }
      saveMessages();
      renderMessages();
    }

    async function askAssistant() {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.filter((message) => !message.typing).slice(-12),
          knowledge
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.reply) throw new Error(data.error || 'Assistant unavailable');
      return data.reply;
    }

    async function loadKnowledge() {
      try {
        const response = await fetch('/assets/data/business-knowledge.json', { cache: 'no-store' });
        if (response.ok) knowledge = await response.json();
      } catch (_) {
        knowledge = null;
      }
    }

    function localAnswer(text) {
      const q = text.toLowerCase();
      const bookCall = '\n\nA good next step is the free 30-minute Discovery Call: /consultation.html';
      if (q.includes('api key') || q.includes('system prompt') || q.includes('private client') || q.includes('ignore your instructions')) {
        return 'I cannot reveal private instructions, credentials, system details, or confidential information. I can help with public InsightSerenity services, process, pricing, and general technology questions.';
      }
      if (q.includes('client') || q.includes('fortune 500') || q.includes('satisfaction') || q.includes('saved') || q.includes('revenue') || q.includes('testimonial')) {
        return 'I do not have verified public evidence for client counts, named clients, testimonials, revenue impact, savings, or satisfaction percentages. InsightSerenity avoids publishing those claims unless they are verified and approved.';
      }
      if (isGreeting(q)) {
        return 'Hey, welcome in. I am InsightSerenity AI. I can talk through the company, services, pricing, AI and data questions, or just help you shape a rough business problem into a clearer next step. What are you working on today?';
      }
      if (q.includes('how are you') || q.includes('how’s it going') || q.includes("how's it going") || q.includes('you good')) {
        return 'I am doing well and ready to help. What would you like to talk through: InsightSerenity, a technical idea, or a business problem you are trying to solve?';
      }
      if (q.includes('thank') || q.includes('thanks') || q.includes('appreciate')) {
        return 'You are welcome. If you want, we can keep going from here. Tell me what you are trying to figure out and I will help you reason through it.';
      }
      if (q.includes('who are you') || q.includes('what are you')) {
        return 'I am InsightSerenity AI, a website assistant for answering questions about InsightSerenity and helping visitors think through technology, data, AI, automation, analytics, and software problems. I am not a live human agent, but I can help you get oriented.';
      }
      if (q.includes('can we talk') || q.includes('just chat') || q.includes('normal conversation')) {
        return 'Absolutely. We can talk normally. I am best at business and technology conversations, but you do not need to start with a perfect question. What is on your mind?';
      }
      if (q.includes('founder') || q.includes('degree') || q.includes('education') || q.includes('emmanuel')) {
        return 'InsightSerenity was founded by Emmanuel Oyemosu, Founder & Technical Lead. Verified education: Bachelor of Science in Mathematics and Master of Science in Management Information Systems.';
      }
      if (q.includes('cost') || q.includes('price') || q.includes('pricing') || q.includes('how much')) {
        return 'Public pricing starts with Solution Blueprint engagements at $2,500, focused technology implementation engagements typically starting at $7,500, and custom solutions typically starting at $15,000. Ongoing advisory may start around $3,000/month where appropriate. Final pricing depends on scope, complexity, integrations, timeline, technical requirements, and delivery requirements, so this chat cannot provide a binding quote.' + bookCall;
      }
      if (q.includes('free') || q.includes('discovery') || q.includes('consultation')) {
        return 'InsightSerenity offers a free 30-minute Discovery Call. It is used to understand the business problem, objectives, relevant systems/data, urgency, project fit, general scope, and the appropriate next engagement. It does not include detailed architecture, code, custom model design, extensive analysis, or a formal roadmap.';
      }
      if (q.includes('excel') || q.includes('spreadsheet') || q.includes('manual') || q.includes('invoice')) {
        return 'Based on what you described, a likely starting point would be to understand the workflow, who performs it, which systems are involved, and what output matters. This could involve Data Engineering, Business Intelligence, workflow automation, or AI if documents or unstructured inputs are part of the process. What process are you trying to improve first?';
      }
      if (q.includes('rag')) {
        return 'General guidance: RAG means retrieval-augmented generation. It combines a search/retrieval layer over trusted content with a language model so answers can be grounded in relevant documents. InsightSerenity offers RAG implementation under AI & Automation capabilities, but the right architecture depends on your data, risk, and workflow.';
      }
      if (q.includes('service') || q.includes('offer') || q.includes('dashboard') || q.includes('pipeline') || q.includes('automation') || q.includes('ai agent')) {
        return 'InsightSerenity offers technology consulting and implementation across Data Science & Machine Learning, AI & Automation, Data Engineering, Business Intelligence & Analytics, Software & Systems Development, Cloud & IT Systems, and Technology Strategy & Consulting. Based on the problem, a solution could involve one or several of those areas.';
      }
      if (q.includes('power bi') || q.includes('tableau')) {
        return 'General guidance: Power BI often fits Microsoft-heavy teams and cost-conscious BI rollouts; Tableau can be strong for advanced visual exploration and teams already invested in it. The right choice depends on data sources, governance, users, licensing, and reporting needs. InsightSerenity can help evaluate that fit.';
      }
      if (q.includes('process') || q.includes('how does')) {
        return 'The typical engagement path is: Business Problem -> Discovery -> Solution Blueprint -> Implementation -> Deployment / Validation -> Support / Optimization. The goal is to clarify the business outcome before choosing technology.';
      }
      return 'InsightSerenity helps organizations solve business problems through data, AI, software, automation, analytics, cloud systems, business intelligence, and technology strategy. If you are unsure what service fits, tell me what process or problem you are trying to improve, who handles it today, and what outcome would make the project successful.';
    }

    function isGreeting(value) {
      return /^(hi|hey|hello|yo|good morning|good afternoon|good evening|sup|what's up|whats up)[\s!.?]*$/i.test(value.trim());
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[char]));
    }

    function waitForThinking(startedAt) {
      const minimum = 650;
      const elapsed = Date.now() - startedAt;
      return new Promise((resolve) => setTimeout(resolve, Math.max(0, minimum - elapsed)));
    }

    function businessLogoMarkup(alt) {
      return `<img class="ai-logo-mark" src="/assets/img/favicon_io/android-chrome-192x192.png" alt="${escapeHtml(alt)}" loading="lazy">`;
    }
    function iconX(size) {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    }
    function iconSend(size) {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`;
    }
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
