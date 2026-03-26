// js/reports.js — Reports page

const ReportsApp = (() => {

  const reports = [
    { id: 1, icon: '📊', title: 'Monthly Sales Summary',        desc: 'Full breakdown of March 2026 sales performance, revenue, and top products.',    date: 'Mar 25, 2026', size: '2.4 MB' },
    { id: 2, icon: '📈', title: 'Q1 2026 Quarterly Review',     desc: 'Comprehensive Jan–Mar 2026 review with YoY comparisons and forecasts.',          date: 'Mar 31, 2026', size: '5.1 MB' },
    { id: 3, icon: '🌐', title: 'Traffic & Conversion Analysis', desc: 'Visitor acquisition, conversion funnels, and channel ROI for the last 30 days.', date: 'Mar 24, 2026', size: '1.8 MB' },
    { id: 4, icon: '📦', title: 'Product Performance Report',    desc: 'Revenue, orders, AOV, and trend analysis for all 10 active products.',           date: 'Mar 22, 2026', size: '3.2 MB' },
    { id: 5, icon: '👥', title: 'Customer Cohort Analysis',      desc: 'Retention, LTV, and churn analysis segmented by acquisition cohort.',             date: 'Mar 20, 2026', size: '4.7 MB' },
    { id: 6, icon: '🔮', title: 'Revenue Forecast Model',        desc: 'ML-based revenue projections for April–June 2026 with confidence intervals.',    date: 'Mar 18, 2026', size: '2.9 MB' },
  ];

  const scheduled = [
    { name: 'Weekly Sales Digest',       freq: 'Weekly',    next: 'Apr 1, 2026',  recipients: 'team@insightserenity.com',      active: true  },
    { name: 'Monthly Executive Summary', freq: 'Monthly',   next: 'Apr 30, 2026', recipients: 'eo@insightserenity.com',        active: true  },
    { name: 'Daily Traffic Snapshot',    freq: 'Daily',     next: 'Mar 27, 2026', recipients: 'analytics@insightserenity.com', active: true  },
    { name: 'Quarterly Board Report',    freq: 'Quarterly', next: 'Jun 30, 2026', recipients: 'board@insightserenity.com',     active: false },
    { name: 'Product Health Check',      freq: 'Bi-weekly', next: 'Apr 8, 2026',  recipients: 'products@insightserenity.com', active: true  },
  ];

  // ── Theme ──────────────────────────────────────────────────────────────────
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

  // ── Toast (uses existing #toast div in HTML) ───────────────────────────────
  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.add('hidden'), 2800);
  }

  // ── Modal (uses existing #modalOverlay in HTML) ────────────────────────────
  function showModal(report) {
    const overlay = document.getElementById('modalOverlay');
    const title   = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');
    if (!overlay || !title || !content) return;

    title.textContent = `${report.icon} ${report.title}`;
    content.innerHTML = `
      <p style="font-size:.78rem;color:var(--text-muted);margin:0 0 1.25rem;line-height:1.6">${report.desc}</p>
      <table style="width:100%;font-size:.78rem;border-collapse:collapse">
        <tbody>
          <tr>
            <td style="padding:.5rem .75rem;border-bottom:1px solid var(--border);color:var(--text-muted)">Generated</td>
            <td style="padding:.5rem .75rem;border-bottom:1px solid var(--border);color:var(--text);text-align:right;font-weight:600">${report.date}</td>
          </tr>
          <tr>
            <td style="padding:.5rem .75rem;border-bottom:1px solid var(--border);color:var(--text-muted)">File Size</td>
            <td style="padding:.5rem .75rem;border-bottom:1px solid var(--border);color:var(--text);text-align:right;font-weight:600">${report.size}</td>
          </tr>
          <tr>
            <td style="padding:.5rem .75rem;border-bottom:1px solid var(--border);color:var(--text-muted)">Format</td>
            <td style="padding:.5rem .75rem;border-bottom:1px solid var(--border);color:var(--text);text-align:right;font-weight:600">PDF</td>
          </tr>
          <tr>
            <td style="padding:.5rem .75rem;color:var(--text-muted)">Status</td>
            <td style="padding:.5rem .75rem;text-align:right">
              <span style="background:rgba(52,211,153,.15);color:#34d399;padding:.15rem .55rem;border-radius:999px;font-size:.65rem;font-weight:700">Ready</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top:1.25rem;display:flex;justify-content:flex-end">
        <button id="modalDlBtn" style="padding:.4rem 1rem;background:rgba(255,196,81,.1);border:1px solid rgba(255,196,81,.35);color:#ffc451;border-radius:.4rem;font-size:.78rem;font-weight:600;cursor:pointer;font-family:Inter,sans-serif">⬇ Download PDF</button>
      </div>`;

    overlay.classList.remove('hidden');

    document.getElementById('modalDlBtn')?.addEventListener('click', () => {
      overlay.classList.add('hidden');
      showToast(`⬇ Downloading "${report.title}"...`);
    });
  }

  function bindModal() {
    document.getElementById('modalClose')?.addEventListener('click', () => {
      document.getElementById('modalOverlay')?.classList.add('hidden');
    });
    document.getElementById('modalOverlay')?.addEventListener('click', e => {
      if (e.target === document.getElementById('modalOverlay')) {
        document.getElementById('modalOverlay').classList.add('hidden');
      }
    });
  }

  // ── Render report cards ────────────────────────────────────────────────────
  function renderCards() {
    const grid = document.getElementById('reportsGrid');
    if (!grid) return;
    grid.innerHTML = reports.map(r => `
      <div class="report-card">
        <div class="report-card-header">
          <div class="report-icon">${r.icon}</div>
          <div>
            <div class="report-title">${r.title}</div>
            <div class="report-desc">${r.desc}</div>
          </div>
        </div>
        <div class="report-meta">
          <span>📅 ${r.date}</span>
          <span>💾 ${r.size}</span>
        </div>
        <div class="report-actions">
          <button class="btn-view" data-id="${r.id}">View Report</button>
          <button class="btn-download" data-id="${r.id}">↓ Download PDF</button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = reports.find(x => x.id === +btn.dataset.id);
        if (r) showModal(r);
      });
    });

    grid.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = reports.find(x => x.id === +btn.dataset.id);
        if (r) showToast(`⬇ Downloading "${r.title}"...`);
      });
    });
  }

  // ── Render scheduled table ─────────────────────────────────────────────────
  function renderScheduled() {
    const tbody = document.getElementById('scheduledBody');
    if (!tbody) return;
    tbody.innerHTML = scheduled.map((s, i) => `
      <tr>
        <td style="font-weight:600">${s.name}</td>
        <td><span class="badge badge-yellow">${s.freq}</span></td>
        <td style="color:var(--text-muted)">${s.next}</td>
        <td style="color:var(--text-muted);font-size:.72rem">${s.recipients}</td>
        <td>
          <label class="sched-toggle">
            <input type="checkbox" ${s.active ? 'checked' : ''} data-idx="${i}" />
            <span class="sched-toggle-track"></span>
            <span class="sched-toggle-thumb"></span>
          </label>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('input[type=checkbox]').forEach(cb => {
      cb.addEventListener('change', () => {
        const idx = +cb.dataset.idx;
        scheduled[idx].active = cb.checked;
        showToast(`"${scheduled[idx].name}" ${cb.checked ? 'enabled' : 'paused'}.`);
      });
    });
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    applyTheme();
    bindTheme();
    startClock();
    bindModal();
    renderCards();
    renderScheduled();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
