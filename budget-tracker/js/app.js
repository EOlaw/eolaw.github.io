// js/app.js — Application logic for Budget Tracker

const BudgetApp = (() => {

  // ── State ─────────────────────────────────────────────────────────────────
  let transactions = [];
  let goals        = {};
  let currentMonth = '2026-03';
  let searchQuery  = '';
  let sortBy       = 'date-desc';
  let currentType  = 'income';

  // ── Sample data (seeded if localStorage is empty) ─────────────────────────
  const SAMPLE = [
    { id: 1, type: 'income',  description: 'Consulting Project', category: 'Freelance',  amount: 2500,  date: '2026-03-01' },
    { id: 2, type: 'expense', description: 'Rent',               category: 'Housing',    amount: 1200,  date: '2026-03-01' },
    { id: 3, type: 'expense', description: 'Groceries',          category: 'Food',       amount: 185,   date: '2026-03-05' },
    { id: 4, type: 'income',  description: 'Tutoring Session',   category: 'Freelance',  amount: 225,   date: '2026-03-10' },
    { id: 5, type: 'expense', description: 'Transportation',     category: 'Transport',  amount: 95,    date: '2026-03-12' },
    { id: 6, type: 'expense', description: 'Netflix + Spotify',  category: 'Entertainment', amount: 28, date: '2026-03-13' },
    { id: 7, type: 'income',  description: 'Monthly Salary',     category: 'Salary',     amount: 4800,  date: '2026-03-15' },
    { id: 8, type: 'expense', description: 'Doctor Visit',       category: 'Healthcare', amount: 150,   date: '2026-03-18' },
  ];

  const INCOME_CATS  = ['Salary','Freelance','Investment','Gift','Other'];
  const EXPENSE_CATS = ['Food','Housing','Transport','Entertainment','Healthcare','Education','Shopping','Utilities','Other'];

  // ── Helpers ───────────────────────────────────────────────────────────────
  function fmt(n) {
    return '$' + Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function formatDate(d) {
    const [y, m, day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[parseInt(m) - 1] + ' ' + parseInt(day) + ', ' + y;
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function showToast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2200);
  }

  // ── Filtering & Sorting ───────────────────────────────────────────────────
  function getFilteredTransactions() {
    let rows = transactions.slice();

    if (currentMonth !== 'all') {
      rows = rows.filter(t => t.date.startsWith(currentMonth));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'date-desc':  rows.sort((a, b) => b.date.localeCompare(a.date)); break;
      case 'date-asc':   rows.sort((a, b) => a.date.localeCompare(b.date)); break;
      case 'amount-desc':rows.sort((a, b) => b.amount - a.amount);          break;
      case 'amount-asc': rows.sort((a, b) => a.amount - b.amount);          break;
      case 'name-asc':   rows.sort((a, b) => a.description.localeCompare(b.description)); break;
    }

    return rows;
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  function renderSummary(filtered) {
    const incomes  = filtered.filter(t => t.type === 'income');
    const expenses = filtered.filter(t => t.type === 'expense');

    const totalIn  = incomes.reduce((s, t) => s + t.amount, 0);
    const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
    const bal      = totalIn - totalExp;
    const savings  = totalIn > 0 ? ((bal / totalIn) * 100).toFixed(1) : '0.0';

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

    set('totalIncome',    fmt(totalIn));
    set('totalExpenses',  fmt(totalExp));
    set('balance',        fmt(bal));
    set('incomeCount',    incomes.length  + ' transaction' + (incomes.length  !== 1 ? 's' : ''));
    set('expenseCount',   expenses.length + ' transaction' + (expenses.length !== 1 ? 's' : ''));
    set('savingsRate',    'Savings rate: ' + savings + '%');

    const balEl = document.getElementById('balance');
    if (balEl) {
      balEl.style.color = bal >= 0 ? 'var(--primary-dark)' : 'var(--danger)';
    }

    updateInsights(filtered);
  }

  // ── Transactions List ─────────────────────────────────────────────────────
  function renderTransactions(filtered) {
    const list = document.getElementById('transactionList');
    const cnt  = document.getElementById('txCount');
    if (!list) return;
    if (cnt)  cnt.textContent = filtered.length;

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          No transactions found.
        </div>`;
      return;
    }

    list.innerHTML = filtered.map(t => `
      <div class="transaction-item" data-id="${t.id}">
        <div class="tx-icon ${t.type}">${t.type === 'income' ? '↑' : '↓'}</div>
        <div class="tx-info">
          <div class="tx-name">${escHtml(t.description)}</div>
          <div class="tx-meta">
            <span class="tx-category">${t.category}</span>
            <span class="tx-date">· ${formatDate(t.date)}</span>
          </div>
        </div>
        <div class="tx-right">
          <span class="tx-amount ${t.type}">${t.type === 'income' ? '+' : '-'}${fmt(t.amount)}</span>
          <button class="tx-delete" data-id="${t.id}" title="Delete">✕</button>
        </div>
      </div>
    `).join('');

    // Attach delete listeners (event delegation)
    list.querySelectorAll('.tx-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        transactions = StorageManager.remove(id);
        renderAll();
        showToast('Transaction removed.');
      });
    });
  }

  // ── Goals Section ─────────────────────────────────────────────────────────
  function renderGoals() {
    const container = document.getElementById('goalsList');
    if (!container) return;

    if (Object.keys(goals).length === 0) {
      container.innerHTML = '<p class="goals-empty">No goals set yet. Use the form above to add one.</p>';
      return;
    }

    // Calculate spending by category for current month
    const monthTxs = currentMonth === 'all'
      ? transactions.filter(t => t.type === 'expense')
      : transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth));

    const spentMap = {};
    monthTxs.forEach(t => {
      spentMap[t.category] = (spentMap[t.category] || 0) + t.amount;
    });

    container.innerHTML = Object.entries(goals).map(([cat, goal]) => {
      const spent   = spentMap[cat] || 0;
      const pct     = Math.min((spent / goal) * 100, 100);
      const over    = spent > goal;
      const barClr  = over ? '#f87171' : (pct > 75 ? '#fb923c' : '#34d399');

      return `
        <div class="goal-item">
          <div class="goal-info">
            <span class="goal-cat">${cat}</span>
            <span class="goal-meta">
              ${over ? '<span class="goal-over">Over budget!</span>' : ''}
              ${fmt(spent)} / ${fmt(goal)}
            </span>
          </div>
          <div class="goal-bar-track">
            <div class="goal-bar-fill" style="width:${pct}%;background:${barClr}"></div>
          </div>
          <button class="goal-remove" data-cat="${cat}" title="Remove goal">×</button>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.goal-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        delete goals[btn.dataset.cat];
        StorageManager.saveGoals(goals);
        renderGoals();
      });
    });
  }

  // ── Insights ──────────────────────────────────────────────────────────────
  function updateInsights(txs) {
    const totalIn  = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExp = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const rate     = totalIn > 0 ? ((totalIn - totalExp) / totalIn * 100).toFixed(1) : 0;

    const grouped = {};
    txs.filter(t => t.type === 'expense').forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });
    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

    if (sorted.length > 0) {
      set('tip1', `Your largest expense category is ${sorted[0][0]} (${fmt(sorted[0][1])}).`);
    } else {
      set('tip1', 'Add transactions to see personalized insights.');
    }

    if (totalIn > 0) {
      set('tip2', `Your current savings rate is ${rate}%. ${parseFloat(rate) >= 20 ? 'Great job!' : 'Try to reach 20%.'}`);
    } else {
      set('tip2', 'Track every expense, no matter how small.');
    }

    if (txs.length > 0) {
      const cnt = txs.filter(t => t.type === 'expense').length || 1;
      set('tip3', `Avg expense per transaction: ${fmt(totalExp / cnt)}.`);
    } else {
      set('tip3', 'Aim to save at least 20% of your income (50/30/20 rule).');
    }
  }

  // ── renderAll ─────────────────────────────────────────────────────────────
  function renderAll() {
    const filtered = getFilteredTransactions();
    renderSummary(filtered);
    renderTransactions(filtered);
    ChartManager.update(transactions, currentMonth);
    renderGoals();
  }

  // ── Form validation ───────────────────────────────────────────────────────
  function validateForm() {
    const desc   = document.getElementById('desc').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const date   = document.getElementById('txDate').value;

    if (!desc)                    return 'Please enter a description.';
    if (!amount || amount <= 0)   return 'Please enter a valid amount.';
    if (!date)                    return 'Please select a date.';
    return null;
  }

  // ── Set type + update category dropdown ───────────────────────────────────
  function setType(type) {
    currentType = type;
    const incBtn = document.getElementById('typeIncome');
    const expBtn = document.getElementById('typeExpense');
    if (incBtn) incBtn.classList.toggle('active', type === 'income');
    if (expBtn) expBtn.classList.toggle('active', type === 'expense');

    const catSel = document.getElementById('category');
    if (!catSel) return;
    const opts = type === 'income' ? INCOME_CATS : EXPENSE_CATS;
    catSel.innerHTML = opts.map(o => `<option value="${o}">${o}</option>`).join('');
  }

  // ── Event Listeners ───────────────────────────────────────────────────────
  function bindEvents() {
    // Type buttons
    const incBtn = document.getElementById('typeIncome');
    const expBtn = document.getElementById('typeExpense');
    if (incBtn) incBtn.addEventListener('click', () => setType('income'));
    if (expBtn) expBtn.addEventListener('click', () => setType('expense'));

    // Form submit
    const form = document.getElementById('txForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const err = validateForm();
        if (err) { showToast(err); return; }

        const tx = {
          id:          Date.now(),
          type:        currentType,
          description: document.getElementById('desc').value.trim(),
          amount:      parseFloat(document.getElementById('amount').value),
          category:    document.getElementById('category').value,
          date:        document.getElementById('txDate').value
        };

        transactions = StorageManager.add(tx);
        renderAll();

        // Reset form
        document.getElementById('desc').value   = '';
        document.getElementById('amount').value = '';
        document.getElementById('txDate').valueAsDate = new Date();
        showToast(currentType === 'income' ? 'Income added!' : 'Expense added!');
      });
    }

    // Month selector
    const monthSel = document.getElementById('monthFilter');
    if (monthSel) {
      monthSel.addEventListener('change', () => {
        currentMonth = monthSel.value;
        renderAll();
      });
    }

    // Search input
    const searchInput = document.getElementById('txSearch');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value;
        renderAll();
      });
    }

    // Sort select
    const sortSel = document.getElementById('sortSelect');
    if (sortSel) {
      sortSel.addEventListener('change', () => {
        sortBy = sortSel.value;
        renderAll();
      });
    }

    // Export CSV
    const exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const csv  = StorageManager.exportCSV(getFilteredTransactions());
        const blob = new Blob([csv], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = 'budget-transactions.csv';
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // Clear all
    const clearBtn = document.getElementById('clearAllBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (!confirm('Are you sure you want to clear all transactions? This cannot be undone.')) return;
        StorageManager.clear();
        transactions = [];
        renderAll();
        showToast('All transactions cleared.');
      });
    }

    // Goal form
    const goalForm = document.getElementById('goalForm');
    if (goalForm) {
      goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cat    = document.getElementById('goalCategory').value;
        const amount = parseFloat(document.getElementById('goalAmount').value);
        if (!cat || !amount || amount <= 0) { showToast('Enter a valid category and amount.'); return; }
        goals[cat] = amount;
        StorageManager.saveGoals(goals);
        document.getElementById('goalAmount').value = '';
        renderGoals();
        showToast(`Goal set: ${cat} — ${fmt(amount)}/mo`);
      });
    }
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    // Load data
    const stored = StorageManager.load();
    if (stored.length > 0) {
      transactions = stored;
    } else {
      transactions = SAMPLE;
      StorageManager.save(transactions);
    }

    goals = StorageManager.loadGoals();

    // Set default date
    const dateEl = document.getElementById('txDate');
    if (dateEl) dateEl.valueAsDate = new Date();

    // Init categories for income (default)
    setType('income');

    // Init chart
    ChartManager.init('spendingChart');

    // Bind events
    bindEvents();

    // Initial render
    renderAll();
  }

  return { init, getFilteredTransactions, renderSummary, renderTransactions, renderGoals, renderAll, validateForm };
})();

document.addEventListener('DOMContentLoaded', () => BudgetApp.init());
