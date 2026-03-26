// js/revenue.js — Revenue Analytics page

const RevenueApp = (() => {

  const COLORS = ['#ffc451','#60a5fa','#34d399','#f87171','#a78bfa'];
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const revData  = DashboardData.monthly['1y'].revenue;
  const ordData  = DashboardData.monthly['1y'].orders;
  const catData  = DashboardData.categories;

  let barChart = null;
  let catChart = null;

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

  // ── Live clock ─────────────────────────────────────────────────────────────
  function startClock() {
    const el = document.getElementById('liveClock');
    if (!el) return;
    const tick = () => { el.textContent = new Date().toLocaleTimeString(); };
    tick();
    setInterval(tick, 1000);
  }

  // ── Bar chart (monthly revenue) ───────────────────────────────────────────
  function buildBarChart() {
    const ctx = document.getElementById('revBarChart');
    if (!ctx) return;
    const isDark = !document.body.classList.contains('light-mode');
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#9ca3af' : '#64748b';

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(255,196,81,0.35)');
    gradient.addColorStop(1, 'rgba(255,196,81,0.02)');

    barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: MONTHS,
        datasets: [{
          label: 'Revenue',
          data: revData,
          backgroundColor: COLORS[0],
          borderRadius: 5,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ' $' + ctx.parsed.y.toLocaleString()
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 11 }, maxRotation: 0, autoSkip: true }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { size: 11 },
              callback: v => '$' + (v / 1000).toFixed(0) + 'k'
            }
          }
        }
      }
    });
  }

  // ── Category donut ────────────────────────────────────────────────────────
  function buildCatChart() {
    const ctx = document.getElementById('revCatChart');
    if (!ctx) return;

    catChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: catData.labels,
        datasets: [{
          data: catData.data,
          backgroundColor: COLORS,
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        cutout: '68%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ' $' + ctx.parsed.toLocaleString()
            }
          }
        }
      }
    });

    // Legend
    const legend = document.getElementById('revCatLegend');
    if (!legend) return;
    const total = catData.data.reduce((a, b) => a + b, 0);
    legend.innerHTML = catData.labels.map((label, i) => `
      <div class="rev-cat-legend-item">
        <div class="rev-cat-legend-left">
          <div class="rev-cat-legend-dot" style="background:${COLORS[i]}"></div>
          ${label}
        </div>
        <span class="rev-cat-legend-val">$${catData.data[i].toLocaleString()}</span>
      </div>
    `).join('');
  }

  // ── Monthly breakdown table ───────────────────────────────────────────────
  function buildTable() {
    const tbody = document.getElementById('monthlyTableBody');
    if (!tbody) return;

    tbody.innerHTML = MONTHS.map((month, i) => {
      const rev  = revData[i];
      const ord  = ordData[i];
      const aov  = (rev / ord).toFixed(2);
      const prev = i > 0 ? revData[i - 1] : null;
      const pct  = prev ? (((rev - prev) / prev) * 100).toFixed(1) : null;
      const badge = pct === null
        ? '<span style="color:var(--text-muted);font-size:0.72rem">—</span>'
        : pct >= 0
          ? `<span class="pct-badge pct-up">+${pct}%</span>`
          : `<span class="pct-badge pct-down">${pct}%</span>`;

      return `
        <tr>
          <td>${month} 2026</td>
          <td style="font-weight:700">$${rev.toLocaleString()}</td>
          <td>${ord.toLocaleString()}</td>
          <td>$${aov}</td>
          <td>${badge}</td>
        </tr>
      `;
    }).join('');
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    applyTheme();
    bindTheme();
    startClock();
    buildBarChart();
    buildCatChart();
    buildTable();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
