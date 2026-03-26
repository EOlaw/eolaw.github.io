// js/products.js — Products page

const ProductsApp = (() => {

  const products = DashboardData.products;
  let filtered = [...products];
  let sortKey = null;
  let sortDir = 1;

  // ── Theme ─────────────────────────────────────────────────────────────────
  function applyTheme() {
    if (localStorage.getItem('sdTheme') === 'light') document.body.classList.add('light-mode');
  }
  function bindTheme() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      localStorage.setItem('sdTheme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });
  }

  // ── Clock ──────────────────────────────────────────────────────────────────
  function startClock() {
    const el = document.getElementById('liveClock');
    if (!el) return;
    const tick = () => { el.textContent = new Date().toLocaleTimeString(); };
    tick();
    setInterval(tick, 1000);
  }

  // ── Status badge ──────────────────────────────────────────────────────────
  function statusBadge(s) {
    const map = { Active: 'badge-green', Paused: 'badge-red', Beta: 'badge-yellow' };
    return `<span class="badge ${map[s] || 'badge-yellow'}">${s}</span>`;
  }

  // ── Trend icon ────────────────────────────────────────────────────────────
  function trendIcon(t) {
    if (t === 'up')   return '<span style="color:#34d399;font-size:1.1rem">↑</span>';
    if (t === 'down') return '<span style="color:#f87171;font-size:1.1rem">↓</span>';
    return '<span style="color:#9ca3af;font-size:1.1rem">→</span>';
  }

  // ── Render table ──────────────────────────────────────────────────────────
  function renderTable() {
    const tbody = document.getElementById('productsBody');
    if (!tbody) return;
    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:2rem">No products match your search.</td></tr>';
      return;
    }
    tbody.innerHTML = filtered.map((p, i) => {
      const aov = (p.revenue / p.orders).toFixed(2);
      return `
        <tr>
          <td><div class="rank-num">${i + 1}</div></td>
          <td style="font-weight:600">${p.name}</td>
          <td style="font-weight:700">$${p.revenue.toLocaleString()}</td>
          <td>${p.orders.toLocaleString()}</td>
          <td>$${aov}</td>
          <td>${statusBadge(p.status)}</td>
          <td>${trendIcon(p.trend)}</td>
          <td>
            <div style="display:flex;gap:0.4rem">
              <button class="btn-action btn-edit" data-name="${p.name}">Edit</button>
              <button class="btn-action btn-archive" data-name="${p.name}">Archive</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Action button feedback
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => showToast(`Editing "${btn.dataset.name}"...`));
    });
    tbody.querySelectorAll('.btn-archive').forEach(btn => {
      btn.addEventListener('click', () => showToast(`"${btn.dataset.name}" archived.`));
    });
  }

  // ── Render top performer cards ────────────────────────────────────────────
  function renderTopCards() {
    const container = document.getElementById('topPerformers');
    if (!container) return;
    const top3 = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 3);
    const rankClasses = ['rank-1', 'rank-2', 'rank-3'];
    const rankLabels  = ['#1', '#2', '#3'];
    container.innerHTML = top3.map((p, i) => `
      <div class="performer-card">
        <div class="rank-badge ${rankClasses[i]}">${rankLabels[i]}</div>
        <div class="performer-name">${p.name}</div>
        <div class="performer-rev">$${p.revenue.toLocaleString()}</div>
        <div class="performer-orders">${p.orders} orders &nbsp;·&nbsp; ${statusBadge(p.status)}</div>
        <div class="sparkline-wrap">
          <svg viewBox="0 0 80 30" width="100%" height="36" fill="none">
            <polyline points="${sparkPoints(p)}" stroke="#ffc451" stroke-width="2" fill="none" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    `).join('');
  }

  // ── Fake sparkline based on trend ─────────────────────────────────────────
  function sparkPoints(p) {
    const base = [18, 14, 20, 16, 22, 18, 25, 19, 24, 20, 26, 22];
    const pts = p.trend === 'up'
      ? [22, 20, 18, 16, 14, 12, 10, 9, 8, 7, 6, 5]
      : p.trend === 'down'
        ? [5, 7, 9, 12, 14, 16, 18, 20, 22, 24, 25, 26]
        : [14, 16, 13, 15, 14, 16, 15, 17, 14, 16, 15, 14];
    return pts.map((y, x) => `${x * 7},${y}`).join(' ');
  }

  // ── Search + filter ───────────────────────────────────────────────────────
  function applyFilter() {
    const q = (document.getElementById('prodSearch')?.value || '').toLowerCase();
    const status = document.getElementById('statusFilter')?.value || 'all';
    filtered = products.filter(p => {
      const matchQ = p.name.toLowerCase().includes(q);
      const matchS = status === 'all' || p.status.toLowerCase() === status.toLowerCase();
      return matchQ && matchS;
    });
    if (sortKey) sortFiltered();
    renderTable();
  }

  // ── Sort ──────────────────────────────────────────────────────────────────
  function sortFiltered() {
    filtered.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') av = av.toLowerCase(), bv = bv.toLowerCase();
      return av < bv ? -sortDir : av > bv ? sortDir : 0;
    });
  }

  function bindSort() {
    document.querySelectorAll('th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const key = th.dataset.sort;
        if (sortKey === key) {
          sortDir *= -1;
        } else {
          sortKey = key;
          sortDir = 1;
        }
        document.querySelectorAll('th[data-sort]').forEach(t => t.classList.remove('sort-asc','sort-desc'));
        th.classList.add(sortDir === 1 ? 'sort-asc' : 'sort-desc');
        sortFiltered();
        renderTable();
      });
    });
  }

  // ── Toast ─────────────────────────────────────────────────────────────────
  function showToast(msg) {
    let t = document.getElementById('prodToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'prodToast';
      t.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;background:#1a1d27;border:1px solid #2a2d3e;color:#f1f1f1;padding:.625rem 1.1rem;border-radius:.5rem;font-size:.8rem;z-index:999;opacity:0;transition:opacity .2s;box-shadow:0 4px 20px rgba(0,0,0,.4)';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.style.opacity = '0'; }, 2500);
  }

  // ── Add product (visual) ──────────────────────────────────────────────────
  function bindAddBtn() {
    document.getElementById('addProductBtn')?.addEventListener('click', () => {
      showToast('Add Product — coming soon!');
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    applyTheme();
    bindTheme();
    startClock();
    renderTable();
    renderTopCards();
    bindSort();
    bindAddBtn();

    document.getElementById('prodSearch')?.addEventListener('input', applyFilter);
    document.getElementById('statusFilter')?.addEventListener('change', applyFilter);
  }

  document.addEventListener('DOMContentLoaded', init);

})();
