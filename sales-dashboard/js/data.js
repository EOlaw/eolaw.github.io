// js/data.js — Static data and seed values for the Sales Dashboard

const DashboardData = (() => {

  // ── Helpers ──────────────────────────────────────────────────────────────
  function labelLast7() {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const out = [];
    const base = new Date('2026-03-25');
    for (let i = 6; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      out.push(months[d.getMonth()] + ' ' + d.getDate());
    }
    return out; // e.g. ["Mar 19", "Mar 20", ..., "Mar 25"]
  }

  function labelLast30() {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const out = [];
    const base = new Date('2026-03-25');
    for (let i = 29; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      if (i % 3 === 0 || i === 0) {
        out.push(months[d.getMonth()] + ' ' + d.getDate());
      } else {
        out.push('');
      }
    }
    return out;
  }

  // ── Period Data ───────────────────────────────────────────────────────────
  const monthly = {
    '7d': {
      labels: labelLast7(),
      revenue: [4200, 3850, 5100, 4700, 6200, 5500, 7100],
      orders:  [28,   24,   34,   31,   41,   37,   47],
      kpis: {
        revenue: 36650,      revenueChange: +8.2,
        orders: 242,         ordersChange:  +6.1,
        conversion: 3.21,    conversionChange: +0.18,
        aov: 151.45,         aovChange: +2.0
      }
    },
    '30d': {
      labels: labelLast30(),
      revenue: [
        3100,3400,2900,3700,4200,3800,4600,4100,5000,4500,
        5300,4900,5800,5200,6100,5700,6600,6200,7000,6500,
        7400,6900,7800,7200,8100,7600,8500,8000,8900,9200
      ],
      orders: [
        21,23,19,25,28,26,31,28,34,30,
        36,33,39,35,41,38,44,41,47,43,
        49,46,52,48,54,51,57,53,59,62
      ],
      kpis: {
        revenue: 156800,     revenueChange: +12.4,
        orders: 1104,        ordersChange:  +8.1,
        conversion: 3.42,    conversionChange: +0.3,
        aov: 142.03,         aovChange: +4.6
      }
    },
    '90d': {
      labels: ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7',
               'Week 8','Week 9','Week 10','Week 11','Week 12','Week 13'],
      revenue: [28400,31200,29800,33500,31900,36200,34800,38500,36900,41200,39800,43500,47100],
      orders:  [189,   208,   198,   223,   212,   241,   231,   256,   245,   274,   264,   289,   313],
      kpis: {
        revenue: 472800,     revenueChange: +18.7,
        orders: 2943,        ordersChange:  +14.3,
        conversion: 3.58,    conversionChange: +0.52,
        aov: 160.79,         aovChange: +5.9
      }
    },
    '1y': {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      revenue: [112400,118200,125600,121800,131400,138700,134200,144800,140100,151500,147900,158600],
      orders:  [748,   787,   836,   811,   875,   923,   893,   964,   932,  1008,   984,  1055],
      kpis: {
        revenue: 1625200,    revenueChange: +22.1,
        orders: 10816,       ordersChange:  +19.4,
        conversion: 3.74,    conversionChange: +0.67,
        aov: 150.26,         aovChange: +7.2
      }
    }
  };

  // ── Traffic Sources ───────────────────────────────────────────────────────
  const traffic = {
    labels: ['Organic','Direct','Referral','Social','Paid'],
    data:   [38, 24, 18, 12, 8]
  };

  // ── Sales Categories ──────────────────────────────────────────────────────
  const categories = {
    labels: ['Data Science','Full-Stack','AI/ML','Coaching','eCommerce'],
    data:   [92400, 78200, 64800, 31200, 18350]
  };

  // ── Products ──────────────────────────────────────────────────────────────
  const products = [
    { name: 'Analytics Pro',         revenue: 48200, orders: 312, status: 'Active',   trend: 'up'   },
    { name: 'Data Pipeline Kit',     revenue: 41800, orders: 287, status: 'Active',   trend: 'up'   },
    { name: 'ML Starter Pack',       revenue: 39100, orders: 256, status: 'Active',   trend: 'up'   },
    { name: 'Dashboard Builder',     revenue: 35400, orders: 231, status: 'Active',   trend: 'up'   },
    { name: 'Coach Platform',        revenue: 28900, orders: 198, status: 'Active',   trend: 'flat' },
    { name: 'AI Writing Suite',      revenue: 24700, orders: 173, status: 'Active',   trend: 'up'   },
    { name: 'eCommerce Booster',     revenue: 19500, orders: 142, status: 'Active',   trend: 'down' },
    { name: 'SQL Masterclass',       revenue: 16200, orders: 118, status: 'Active',   trend: 'up'   },
    { name: 'React Bootcamp',        revenue: 13800, orders: 97,  status: 'Paused',   trend: 'down' },
    { name: 'Cloud Deploy Kit',      revenue:  9400, orders: 68,  status: 'Beta',     trend: 'up'   },
  ];

  // ── Notifications ─────────────────────────────────────────────────────────
  const notifications = [
    {
      title: 'Revenue Milestone',
      message: 'Monthly revenue just exceeded $150k for the first time.',
      time: '2 min ago',
      type: 'success'
    },
    {
      title: 'New Cohort Enrolled',
      message: '48 new students enrolled in AI/ML Starter Pack today.',
      time: '1 hr ago',
      type: 'info'
    },
    {
      title: 'Conversion Dip Alert',
      message: 'eCommerce Booster conversion dropped 4.2% this week.',
      time: '3 hrs ago',
      type: 'warning'
    }
  ];

  return { monthly, traffic, categories, products, notifications };
})();
