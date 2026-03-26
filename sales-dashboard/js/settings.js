// js/settings.js — Settings page

const SettingsApp = (() => {

  const PREFS_KEY = 'sdPrefs';

  const defaults = {
    period:    '30d',
    theme:     'dark',
    animation: true,
    compact:   false,
    notifEmail:    true,
    notifRevenue:  true,
    notifDigest:   true,
    notifUpdates:  false,
  };

  function loadPrefs() {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') }; }
    catch { return { ...defaults }; }
  }

  function savePrefs(prefs) {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }

  // ── Theme ──────────────────────────────────────────────────────────────────
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else if (theme === 'dark') {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.toggle('light-mode', !window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }

  function bindThemeToggle() {
    document.getElementById('themeToggle')?.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const prefs = loadPrefs();
      prefs.theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
      savePrefs(prefs);
      const sel = document.getElementById('prefTheme');
      if (sel) sel.value = prefs.theme;
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

  // ── Toast ──────────────────────────────────────────────────────────────────
  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.add('hidden'), 2800);
  }

  // ── Populate saved prefs into form fields ──────────────────────────────────
  function populatePrefs() {
    const prefs = loadPrefs();

    // Notifications
    const tog = {
      'togEmailAlerts':   'notifEmail',
      'togRevMilestone':  'notifRevenue',
      'togWeeklyDigest':  'notifDigest',
      'togProductUpdates':'notifUpdates',
    };
    Object.entries(tog).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.checked = prefs[key];
    });

    // Dash prefs
    const period = document.getElementById('prefPeriod');
    if (period) period.value = prefs.period;

    const theme = document.getElementById('prefTheme');
    if (theme) theme.value = prefs.theme;

    const anim = document.getElementById('togChartAnim');
    if (anim) anim.checked = prefs.animation;

    const compact = document.getElementById('togCompact');
    if (compact) compact.checked = prefs.compact;
  }

  // ── Save profile ───────────────────────────────────────────────────────────
  function bindProfile() {
    document.getElementById('btnSaveProfile')?.addEventListener('click', () => {
      showToast('✓ Profile saved successfully.');
    });
  }

  // ── Notification toggles (persist) ────────────────────────────────────────
  function bindNotifications() {
    const tog = {
      'togEmailAlerts':   'notifEmail',
      'togRevMilestone':  'notifRevenue',
      'togWeeklyDigest':  'notifDigest',
      'togProductUpdates':'notifUpdates',
    };
    Object.entries(tog).forEach(([id, key]) => {
      document.getElementById(id)?.addEventListener('change', e => {
        const prefs = loadPrefs();
        prefs[key] = e.target.checked;
        savePrefs(prefs);
        showToast('Notification preference updated.');
      });
    });
  }

  // ── Dashboard pref toggles (persist) ──────────────────────────────────────
  function bindDashPrefs() {
    // Theme select
    document.getElementById('prefTheme')?.addEventListener('change', e => {
      const prefs = loadPrefs();
      prefs.theme = e.target.value;
      savePrefs(prefs);
      localStorage.setItem('sdTheme', prefs.theme === 'light' ? 'light' : prefs.theme === 'dark' ? 'dark' : '');
      applyTheme(prefs.theme);
      showToast('✓ Theme updated.');
    });

    // Period select
    document.getElementById('prefPeriod')?.addEventListener('change', e => {
      const prefs = loadPrefs();
      prefs.period = e.target.value;
      savePrefs(prefs);
      showToast('Default period saved.');
    });

    // Chart anim toggle
    document.getElementById('togChartAnim')?.addEventListener('change', e => {
      const prefs = loadPrefs();
      prefs.animation = e.target.checked;
      savePrefs(prefs);
      showToast(`Chart animations ${e.target.checked ? 'enabled' : 'disabled'}.`);
    });

    // Compact toggle
    document.getElementById('togCompact')?.addEventListener('change', e => {
      const prefs = loadPrefs();
      prefs.compact = e.target.checked;
      savePrefs(prefs);
      showToast(`Compact mode ${e.target.checked ? 'enabled' : 'disabled'}.`);
    });
  }

  // ── Export CSV ─────────────────────────────────────────────────────────────
  function bindExport() {
    document.getElementById('btnExportCSV')?.addEventListener('click', () => {
      const rows = [
        ['Product','Revenue','Orders','Status'],
        ...DashboardData.products.map(p => [p.name, p.revenue, p.orders, p.status])
      ];
      const csv  = rows.map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url;
      a.download = 'insightserenity_data.csv';
      a.click();
      URL.revokeObjectURL(url);
      showToast('⬇ Data exported as CSV.');
    });

    document.getElementById('btnExportPDF')?.addEventListener('click', () => {
      showToast('📄 Generating full PDF report...');
    });
  }

  // ── Danger zone ────────────────────────────────────────────────────────────
  function bindDangerZone() {
    document.getElementById('btnClearData')?.addEventListener('click', () => {
      if (confirm('Clear all dashboard data? This cannot be undone.')) {
        localStorage.removeItem(PREFS_KEY);
        showToast('Dashboard data cleared.');
      }
    });

    document.getElementById('btnReset')?.addEventListener('click', () => {
      savePrefs(defaults);
      populatePrefs();
      applyTheme(defaults.theme);
      localStorage.setItem('sdTheme', 'dark');
      showToast('✓ Settings reset to defaults.');
    });
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    const prefs = loadPrefs();
    applyTheme(prefs.theme);
    bindThemeToggle();
    startClock();
    populatePrefs();
    bindProfile();
    bindNotifications();
    bindDashPrefs();
    bindExport();
    bindDangerZone();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
