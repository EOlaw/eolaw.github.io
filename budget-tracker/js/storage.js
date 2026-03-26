// js/storage.js — LocalStorage helpers for Budget Tracker

const StorageManager = (() => {

  const KEY       = 'budget_transactions';
  const GOALS_KEY = 'budget_goals';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function save(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  function add(transaction) {
    const arr = load();
    arr.unshift(transaction);
    save(arr);
    return arr;
  }

  function remove(id) {
    const arr = load().filter(t => t.id !== id);
    save(arr);
    return arr;
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  // ── Stats aggregation ─────────────────────────────────────────────────────
  function getStats(arr) {
    const totalIncome   = arr.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = arr.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance       = totalIncome - totalExpenses;

    const byCategory = {};
    arr.forEach(t => {
      if (!byCategory[t.category]) byCategory[t.category] = { income: 0, expense: 0 };
      byCategory[t.category][t.type] += t.amount;
    });

    const byMonth = {};
    arr.forEach(t => {
      const month = t.date.substring(0, 7); // "2026-03"
      if (!byMonth[month]) byMonth[month] = { income: 0, expense: 0 };
      byMonth[month][t.type] += t.amount;
    });

    return { totalIncome, totalExpenses, balance, byCategory, byMonth };
  }

  // ── CSV export ────────────────────────────────────────────────────────────
  function exportCSV(arr) {
    const esc = v => '"' + String(v).replace(/"/g, '""') + '"';
    const header = ['Date','Description','Category','Type','Amount'];
    const rows   = arr.map(t => [
      esc(t.date),
      esc(t.description),
      esc(t.category),
      esc(t.type),
      t.amount.toFixed(2)
    ]);
    return [header.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // ── Goals ─────────────────────────────────────────────────────────────────
  function loadGoals() {
    try {
      const raw = localStorage.getItem(GOALS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveGoals(goals) {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }

  return { KEY, GOALS_KEY, load, save, add, remove, clear, getStats, exportCSV, loadGoals, saveGoals };
})();
