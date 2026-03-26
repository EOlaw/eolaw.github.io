// js/app.js — Application logic for the Sales Dashboard

const DashboardApp = (() => {

  let currentPeriod = '30d';
  let sortCol       = null;
  let sortDir       = 'asc';
  let searchQuery   = '';

  // ── Utilities ─────────────────────────────────────────────────────────────
  function fmt(n) {
    return '$' + Math.round(n).toLocaleString();
  }

  function fmtDec(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // ── Count-Up Animation ────────────────────────────────────────────────────
  function countUp(el, target, duration, prefix, suffix) {
    prefix = prefix || '';
    suffix = suffix || '';
    const start   = performance.now();
    const isFloat = target % 1 !== 0;

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease     = 1 - Math.pow(1 - progress, 3);
      const value    = target * ease;

      if (isFloat) {
        el.textContent = prefix + value.toFixed(2) + suffix;
      } else {
        el.textContent = prefix + Math.round(value).toLocaleString() + suffix;
      }

      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ── Render KPI Cards ──────────────────────────────────────────────────────
  function renderKPIs(period) {
    const k = DashboardData.monthly[period].kpis;

    const revenueEl    = document.getElementById('kpi-revenue');
    const ordersEl     = document.getElementById('kpi-orders');
    const convEl       = document.getElementById('kpi-conv');
    const aovEl        = document.getElementById('kpi-aov');
    const revChangeEl  = document.getElementById('kpi-revenue-change');
    const ordChangeEl  = document.getElementById('kpi-orders-change');
    const convChangeEl = document.getElementById('kpi-conv-change');
    const aovChangeEl  = document.getElementById('kpi-aov-change');

    if (revenueEl) countUp(revenueEl, k.revenue,    800, '$', '');
    if (ordersEl)  countUp(ordersEl,  k.orders,     800, '',  '');
    if (convEl)    countUp(convEl,    k.conversion, 800, '',  '%');
    if (aovEl)     countUp(aovEl,     k.aov,        800, '$', '');

    function setChange(el, val, label) {
      if (!el) return;
      const dir   = val >= 0 ? 'up' : 'down';
      const arrow = val >= 0
        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>'
        : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
      el.className     = 'kpi-change ' + dir;
      el.innerHTML     = arrow + ' ' + (val >= 0 ? '+' : '') + val + label + ' vs last period';
    }

    setChange(revChangeEl,  k.revenueChange,    '%');
    setChange(ordChangeEl,  k.ordersChange,     '%');
    setChange(convChangeEl, k.conversionChange, '%');
    setChange(aovChangeEl,  k.aovChange,        '%');
  }

  // ── Render Product Table ──────────────────────────────────────────────────
  function renderProducts(filter, col, dir) {
    const tbody = document.getElementById('productsBody');
    if (!tbody) return;

    let rows = DashboardData.products.slice();

    // Filter by search
    const q = (filter || '').toLowerCase();
    if (q) {
      rows = rows.filter(p => p.name.toLowerCase().includes(q));
    }

    // Sort
    if (col) {
      rows.sort((a, b) => {
        let av = a[col], bv = b[col];
        if (typeof av === 'string') av = av.toLowerCase();
        if (typeof bv === 'string') bv = bv.toLowerCase();
        if (av < bv) return dir === 'asc' ? -1 : 1;
        if (av > bv) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:2rem">No products match your search.</td></tr>`;
      return;
    }

    const trendIcon = t =>
      t === 'up'   ? '<span style="color:#34d399">▲</span>' :
      t === 'down' ? '<span style="color:#f87171">▼</span>' :
                     '<span style="color:#9ca3af">—</span>';

    const badge = s =>
      s === 'Active' ? '<span class="badge badge-green">Active</span>'  :
      s === 'Paused' ? '<span class="badge badge-red">Paused</span>'    :
                       '<span class="badge badge-yellow">Beta</span>';

    tbody.innerHTML = rows.map((p, i) => `
      <tr>
        <td><span class="rank-num">${i + 1}</span></td>
        <td>${p.name}</td>
        <td>${fmt(p.revenue)}</td>
        <td>${p.orders.toLocaleString()}</td>
        <td>${badge(p.status)}</td>
        <td>${trendIcon(p.trend)}</td>
      </tr>
    `).join('');
  }

  // ── Live Clock ────────────────────────────────────────────────────────────
  function startClock() {
    const el = document.getElementById('liveClock');
    if (!el) return;

    function tick() {
      const now    = new Date();
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const m      = months[now.getMonth()];
      const d      = now.getDate();
      const y      = now.getFullYear();
      let   h      = now.getHours();
      const min    = String(now.getMinutes()).padStart(2, '0');
      const sec    = String(now.getSeconds()).padStart(2, '0');
      const ampm   = h >= 12 ? 'PM' : 'AM';
      h            = h % 12 || 12;
      el.textContent = `${m} ${d}, ${y} · ${h}:${min}:${sec} ${ampm}`;
    }
    tick();
    setInterval(tick, 1000);
  }

  // ── Theme Toggle ──────────────────────────────────────────────────────────
  function initTheme() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    const saved = localStorage.getItem('dashboard_theme');
    if (saved === 'light') document.body.classList.add('light-mode');
    updateThemeIcon(btn);

    btn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('dashboard_theme', isLight ? 'light' : 'dark');
      updateThemeIcon(btn);
    });
  }

  function updateThemeIcon(btn) {
    const isLight = document.body.classList.contains('light-mode');
    btn.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    btn.innerHTML = isLight
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
         </svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <circle cx="12" cy="12" r="5"/>
           <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
           <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
           <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
           <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
         </svg>`;
  }

  // ── Notification Bell ─────────────────────────────────────────────────────
  function initNotifications() {
    const bell     = document.getElementById('notifBell');
    const dropdown = document.getElementById('notifDropdown');
    if (!bell || !dropdown) return;

    // Render notifications list
    const colors = { success: '#34d399', info: '#60a5fa', warning: '#ffc451' };
    dropdown.innerHTML = `
      <div class="notif-header">Notifications <span class="notif-badge">${DashboardData.notifications.length}</span></div>
      ${DashboardData.notifications.map(n => `
        <div class="notif-item">
          <div class="notif-dot" style="background:${colors[n.type] || '#9ca3af'}"></div>
          <div class="notif-content">
            <div class="notif-title">${n.title}</div>
            <div class="notif-msg">${n.message}</div>
            <div class="notif-time">${n.time}</div>
          </div>
        </div>
      `).join('')}
    `;

    bell.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle('open');
      if (open) {
        // Remove red dot once opened
        const dot = bell.querySelector('.notification-dot');
        if (dot) dot.style.display = 'none';
      }
    });

    document.addEventListener('click', (e) => {
      if (!bell.contains(e.target)) dropdown.classList.remove('open');
    });
  }

  // ── Export CSV ────────────────────────────────────────────────────────────
  function exportCSV() {
    const rows = [['#','Product','Revenue','Orders','Status','Trend']];
    DashboardData.products.forEach((p, i) => {
      rows.push([i + 1, p.name, p.revenue, p.orders, p.status, p.trend]);
    });
    const csv   = rows.map(r => r.join(',')).join('\n');
    const blob  = new Blob([csv], { type: 'text/csv' });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement('a');
    a.href      = url;
    a.download  = 'top-products.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Search Input ──────────────────────────────────────────────────────────
  function initSearch() {
    const input = document.getElementById('productSearch');
    if (!input) return;
    input.addEventListener('input', () => {
      searchQuery = input.value;
      renderProducts(searchQuery, sortCol, sortDir);
    });
  }

  // ── Column Sorting ────────────────────────────────────────────────────────
  function initTableSort() {
    document.querySelectorAll('th[data-sort]').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const col = th.dataset.sort;
        if (sortCol === col) {
          sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          sortCol = col;
          sortDir = 'asc';
        }
        // Update header indicators
        document.querySelectorAll('th[data-sort]').forEach(h => {
          h.classList.remove('sort-asc', 'sort-desc');
        });
        th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
        renderProducts(searchQuery, sortCol, sortDir);
      });
    });
  }

  // ── Period Buttons ────────────────────────────────────────────────────────
  function initPeriodBtns() {
    document.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPeriod = btn.dataset.period.toLowerCase();
        ChartManager.update(currentPeriod);
        renderKPIs(currentPeriod);
      });
    });
  }

  // ── Export button ─────────────────────────────────────────────────────────
  function initExportBtn() {
    const btn = document.getElementById('exportCsvBtn');
    if (btn) btn.addEventListener('click', exportCSV);
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    ChartManager.applyDefaults();
    ChartManager.initRevenue('30d');
    ChartManager.initTraffic();
    ChartManager.initCategory();

    renderKPIs('30d');
    renderProducts('', null, 'asc');

    initPeriodBtns();
    startClock();
    initTheme();
    initNotifications();
    initSearch();
    initTableSort();
    initExportBtn();
  }

  return { init, renderKPIs, renderProducts, countUp };
})();

// ── Boot when DOM ready ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => DashboardApp.init());
