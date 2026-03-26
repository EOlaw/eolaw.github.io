// js/charts.js — Chart.js rendering for the Sales Dashboard

const ChartManager = (() => {

  const charts = {};

  const colors = {
    primary:   '#ffc451',
    green:     '#34d399',
    blue:      '#60a5fa',
    purple:    '#a78bfa',
    red:       '#f87171',
    orange:    '#fb923c',
    teal:      '#2dd4bf',
    cardBg:    '#1a1d27',
    border:    '#2a2d3e',
    gridLine:  'rgba(42,45,62,0.5)',
    textMuted: '#9ca3af'
  };

  const trafficColors = [
    colors.primary, colors.green, colors.blue, colors.purple, colors.red
  ];

  // ── Set Chart.js defaults ─────────────────────────────────────────────────
  function applyDefaults() {
    Chart.defaults.color          = colors.textMuted;
    Chart.defaults.borderColor    = colors.border;
    Chart.defaults.font.family    = "'Inter', sans-serif";
  }

  // ── Revenue Line Chart ────────────────────────────────────────────────────
  function initRevenue(period) {
    destroy('revenue');

    const d   = DashboardData.monthly[period];
    const ctx = document.getElementById('revenueChart').getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, 'rgba(255,196,81,0.28)');
    gradient.addColorStop(1, 'rgba(255,196,81,0)');

    charts['revenue'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [{
          label: 'Revenue',
          data: d.revenue,
          borderColor: colors.primary,
          backgroundColor: gradient,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.primary,
          pointBorderColor: colors.cardBg,
          pointBorderWidth: 2,
          pointRadius: d.labels.length > 15 ? 2 : 4,
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive: true,
        animation: { duration: 600, easing: 'easeInOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
            borderWidth: 1,
            titleColor: '#f1f1f1',
            bodyColor: colors.textMuted,
            callbacks: {
              label: ctx => ' $' + ctx.parsed.y.toLocaleString()
            }
          }
        },
        scales: {
          x: {
            grid: { color: colors.gridLine },
            ticks: {
              maxRotation: 45,
              autoSkip: true,
              maxTicksLimit: 10
            }
          },
          y: {
            grid: { color: colors.gridLine },
            ticks: { callback: v => '$' + (v / 1000).toFixed(0) + 'k' }
          }
        }
      }
    });
  }

  // ── Traffic Donut ─────────────────────────────────────────────────────────
  function initTraffic() {
    destroy('traffic');

    const d   = DashboardData.traffic;
    const ctx = document.getElementById('trafficChart').getContext('2d');

    charts['traffic'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: d.labels,
        datasets: [{
          data: d.data,
          backgroundColor: trafficColors,
          borderColor: colors.cardBg,
          borderWidth: 3,
          hoverBorderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        cutout: '68%',
        animation: { duration: 700, easing: 'easeInOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
            borderWidth: 1,
            callbacks: {
              label: ctx => ' ' + ctx.label + ': ' + ctx.parsed + '%'
            }
          }
        }
      }
    });

    // Render HTML legend
    const legend = document.getElementById('trafficLegend');
    if (legend) {
      legend.innerHTML = d.labels.map((l, i) =>
        `<div class="legend-item">
          <div class="legend-dot" style="background:${trafficColors[i]}"></div>
          ${l} (${d.data[i]}%)
        </div>`
      ).join('');
    }
  }

  // ── Category Bar Chart ────────────────────────────────────────────────────
  function initCategory() {
    destroy('category');

    const d   = DashboardData.categories;
    const ctx = document.getElementById('categoryChart').getContext('2d');

    charts['category'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: d.labels,
        datasets: [{
          label: 'Revenue',
          data: d.data,
          backgroundColor: 'rgba(255,196,81,0.82)',
          borderColor: colors.primary,
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        animation: { duration: 700, easing: 'easeInOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
            borderWidth: 1,
            callbacks: {
              label: ctx => ' $' + ctx.parsed.y.toLocaleString()
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: colors.gridLine },
            ticks: { callback: v => '$' + (v / 1000).toFixed(0) + 'k' }
          }
        }
      }
    });
  }

  // ── Update revenue chart for a new period ─────────────────────────────────
  function update(period) {
    initRevenue(period);
  }

  // ── Destroy a chart by key ─────────────────────────────────────────────────
  function destroy(id) {
    if (charts[id]) {
      charts[id].destroy();
      delete charts[id];
    }
  }

  return { charts, colors, initRevenue, initTraffic, initCategory, update, destroy, applyDefaults };
})();
