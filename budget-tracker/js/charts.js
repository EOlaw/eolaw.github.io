// js/charts.js — Chart.js rendering for Budget Tracker

const ChartManager = (() => {

  let chart = null;

  const COLORS = {
    Food:          '#ffc451',
    Housing:       '#34d399',
    Transport:     '#60a5fa',
    Entertainment: '#a78bfa',
    Healthcare:    '#f87171',
    Education:     '#fb923c',
    Shopping:      '#2dd4bf',
    Utilities:     '#e879f9',
    Other:         '#94a3b8',
    Salary:        '#34d399',
    Freelance:     '#60a5fa',
    Investment:    '#a78bfa',
    Gift:          '#fbbf24',
  };

  // Fallback color for unknown categories
  const FALLBACK_COLORS = [
    '#ffc451','#34d399','#60a5fa','#a78bfa','#f87171',
    '#fb923c','#2dd4bf','#e879f9','#94a3b8','#fbbf24'
  ];

  function colorFor(label, index) {
    return COLORS[label] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  }

  // ── Init chart with empty data ────────────────────────────────────────────
  function init(canvasId) {
    if (chart) { chart.destroy(); chart = null; }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    chart = new Chart(ctx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          borderColor: 'var(--bg-card)',
          borderWidth: 3,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => {
                const val = ctx.parsed;
                return ' ' + ctx.label + ': $' + val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }
            }
          }
        }
      }
    });
  }

  // ── Update chart for given transactions + optional month filter ───────────
  function update(transactions, month) {
    if (!chart) return;

    // Determine which transactions to consider
    let txs = transactions.filter(t => t.type === 'expense');
    if (month && month !== 'all') {
      txs = txs.filter(t => t.date.startsWith(month));
    }

    // Group by category
    const grouped = {};
    txs.forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });

    const labels = Object.keys(grouped);
    const data   = Object.values(grouped);
    const bgs    = labels.map((l, i) => colorFor(l, i));

    chart.data.labels                      = labels;
    chart.data.datasets[0].data           = data;
    chart.data.datasets[0].backgroundColor = bgs;
    chart.update('active');

    renderLegend({ labels, data, bgs });
  }

  // ── Render HTML legend ────────────────────────────────────────────────────
  function renderLegend({ labels, data, bgs }) {
    const el = document.getElementById('chartLegend');
    if (!el) return;

    if (labels.length === 0) {
      el.innerHTML = '<div style="font-size:0.75rem;color:var(--text-muted);text-align:center;padding:1rem">No expense data yet</div>';
      return;
    }

    const total = data.reduce((s, v) => s + v, 0);
    el.innerHTML = labels.map((l, i) => {
      const pct = total > 0 ? ((data[i] / total) * 100).toFixed(1) : '0.0';
      return `
        <div class="legend-row">
          <div class="legend-left">
            <div class="legend-dot" style="background:${bgs[i]}"></div>
            ${l}
            <span class="legend-pct">${pct}%</span>
          </div>
          <span class="legend-amount">$${data[i].toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
        </div>`;
    }).join('');
  }

  return { chart: () => chart, COLORS, colorFor, init, update, renderLegend };
})();
