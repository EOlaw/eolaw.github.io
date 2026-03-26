// js/customers.js — Customers page

const CustomersApp = (() => {

  const COLORS = ['#ffc451','#60a5fa','#34d399','#f87171'];

  const acqData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    values: [189, 212, 241, 268, 295, 318, 302, 341, 329, 368, 352, 391]
  };

  const segData = {
    labels: ['Enterprise','SMB','Individual','Trial'],
    values: [18, 34, 31, 17]
  };

  const customers = [
    { name: 'Marcus Williams',   email: 'marcus.w@acmecorp.io',    location: 'New York, NY',     spend: 4820, orders: 9,  status: 'Active',  since: 'Jan 2024' },
    { name: 'Priya Sharma',      email: 'priya.s@techflow.co',     location: 'San Jose, CA',     spend: 3910, orders: 7,  status: 'Active',  since: 'Mar 2024' },
    { name: 'Jordan Lee',        email: 'j.lee@brightmind.org',    location: 'Austin, TX',       spend: 3540, orders: 6,  status: 'Active',  since: 'Feb 2024' },
    { name: 'Sofia Reyes',       email: 'sofia.r@nexalab.com',     location: 'Miami, FL',        spend: 2980, orders: 5,  status: 'Active',  since: 'May 2024' },
    { name: 'Kevin O\'Brien',    email: 'kevin.o@devstudio.io',    location: 'Chicago, IL',      spend: 2640, orders: 5,  status: 'Active',  since: 'Jun 2024' },
    { name: 'Amara Okafor',      email: 'amara.o@datavault.net',   location: 'Houston, TX',      spend: 2310, orders: 4,  status: 'Active',  since: 'Apr 2024' },
    { name: 'Tyler Jackson',     email: 'tyler.j@cloudbit.dev',    location: 'Seattle, WA',      spend: 1890, orders: 4,  status: 'Active',  since: 'Jul 2024' },
    { name: 'Mei-Lin Chen',      email: 'meilin@sparkanalytics.io',location: 'Los Angeles, CA',  spend: 1650, orders: 3,  status: 'Trial',   since: 'Jan 2025' },
    { name: 'David Nwosu',       email: 'd.nwosu@innohub.co',      location: 'Atlanta, GA',      spend: 1420, orders: 3,  status: 'Active',  since: 'Aug 2024' },
    { name: 'Rachel Goldstein',  email: 'r.gold@metricflow.com',   location: 'Boston, MA',       spend:  980, orders: 2,  status: 'Churned', since: 'Sep 2024' },
    { name: 'Carlos Mendoza',    email: 'c.mendoza@growfast.io',   location: 'Phoenix, AZ',      spend:  740, orders: 2,  status: 'Trial',   since: 'Feb 2025' },
    { name: 'Nina Patel',        email: 'nina.p@insightco.ai',     location: 'Denver, CO',       spend:  610, orders: 1,  status: 'Active',  since: 'Mar 2025' },
  ];

  let acqChart = null;
  let segChart = null;

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

  // ── Acquisition line chart ────────────────────────────────────────────────
  function buildAcqChart() {
    const ctx = document.getElementById('custAcqChart');
    if (!ctx) return;
    const isDark = !document.body.classList.contains('light-mode');
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#9ca3af' : '#64748b';

    const grad = ctx.getContext('2d').createLinearGradient(0, 0, 0, 220);
    grad.addColorStop(0, 'rgba(255,196,81,0.25)');
    grad.addColorStop(1, 'rgba(255,196,81,0)');

    acqChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: acqData.labels,
        datasets: [{
          label: 'New Customers',
          data: acqData.values,
          borderColor: '#ffc451',
          backgroundColor: grad,
          pointBackgroundColor: '#ffc451',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
          borderWidth: 2.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 11 }, maxRotation: 0, autoSkip: true }
          },
          y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } }
        }
      }
    });
  }

  // ── Segment donut ──────────────────────────────────────────────────────────
  function buildSegChart() {
    const ctx = document.getElementById('custSegChart');
    if (!ctx) return;

    segChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: segData.labels,
        datasets: [{
          data: segData.values,
          backgroundColor: COLORS,
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        cutout: '68%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });

    const legend = document.getElementById('segLegend');
    if (!legend) return;
    legend.innerHTML = segData.labels.map((label, i) => `
      <div class="seg-legend-item">
        <div class="seg-legend-left">
          <div class="seg-legend-dot" style="background:${COLORS[i]}"></div>
          ${label}
        </div>
        <span class="seg-legend-val">${segData.values[i]}%</span>
      </div>
    `).join('');
  }

  // ── Customer table ─────────────────────────────────────────────────────────
  function buildTable() {
    const tbody = document.getElementById('customersBody');
    if (!tbody) return;

    tbody.innerHTML = customers.map(c => {
      const initials = c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      const statusMap = { Active: 'badge-green', Trial: 'badge-yellow', Churned: 'badge-red' };
      const badge = `<span class="badge ${statusMap[c.status] || 'badge-yellow'}">${c.status}</span>`;
      const hues = [210,180,150,120,270,30,330,60,240,300,90,0];
      const hue = hues[customers.indexOf(c) % hues.length];
      return `
        <tr>
          <td>
            <div class="cust-cell">
              <div class="avatar-circle" style="background:hsl(${hue},55%,25%);color:hsl(${hue},80%,70%)">${initials}</div>
              <span style="font-weight:600">${c.name}</span>
            </div>
          </td>
          <td style="color:var(--text-muted)">${c.email}</td>
          <td style="color:var(--text-muted)">${c.location}</td>
          <td style="font-weight:700">$${c.spend.toLocaleString()}</td>
          <td>${c.orders}</td>
          <td>${badge}</td>
          <td style="color:var(--text-muted)">${c.since}</td>
        </tr>
      `;
    }).join('');
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    applyTheme();
    bindTheme();
    startClock();
    buildAcqChart();
    buildSegChart();
    buildTable();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
