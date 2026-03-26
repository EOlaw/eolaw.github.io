/* data-explorer/js/app.js */
const DataExplorer = {
  data: { headers: [], rows: [], types: {} },
  visibleCols: new Set(),
  sortCol: null,
  sortDir: 'asc',
  rowLimit: 50,
  format: 'csv',

  SAMPLE_CSV: `Month,Revenue,Orders,Customers,Avg_Order_Value
Jan,18200,145,89,125.52
Feb,21500,178,112,120.79
Mar,24800,203,134,122.17
Apr,22100,187,118,118.18
May,26700,219,145,121.92
Jun,29300,241,158,121.58
Jul,31200,258,167,120.93
Aug,28900,232,151,124.57
Sep,33400,275,180,121.45
Oct,35100,289,188,121.45
Nov,42800,351,225,121.94
Dec,38500,312,198,123.40`,

  init() {
    Visualizer.init('my-chart');
    this._bindEvents();
    this._loadSample();
  },

  _loadSample() {
    document.getElementById('csv-input').value = this.SAMPLE_CSV;
    this.parseInput();
  },

  _bindEvents() {
    // Format toggle
    document.querySelectorAll('.fmt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.fmt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.format = btn.dataset.fmt;
        const ta = document.getElementById('csv-input');
        ta.placeholder = this.format === 'csv'
          ? 'Month,Revenue,Orders\nJan,18200,145\nFeb,21500,178\n...'
          : '[{"Month":"Jan","Revenue":18200},{"Month":"Feb","Revenue":21500}]';
      });
    });

    // Row limit
    document.querySelectorAll('.limit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.limit-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.rowLimit = btn.dataset.limit === 'all' ? Infinity : parseInt(btn.dataset.limit);
        if (this.data.rows.length) this.renderTable();
      });
    });

    // Parse button
    document.getElementById('parse-btn').addEventListener('click', () => this.parseInput());
    document.getElementById('parse-btn-top').addEventListener('click', () => this.parseInput());

    // Clear
    document.getElementById('clear-btn').addEventListener('click', () => {
      document.getElementById('csv-input').value = '';
      document.getElementById('data-section').style.display = 'none';
      this._showError('');
      this.data = { headers: [], rows: [], types: {} };
      this.visibleCols = new Set();
    });

    // Load sample
    document.getElementById('load-sample-btn').addEventListener('click', () => this._loadSample());

    // File upload
    document.getElementById('file-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      // Auto-detect format from extension
      if (file.name.endsWith('.json')) {
        this.format = 'json';
        document.querySelectorAll('.fmt-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.fmt === 'json');
        });
      } else {
        this.format = 'csv';
        document.querySelectorAll('.fmt-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.fmt === 'csv');
        });
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        document.getElementById('csv-input').value = ev.target.result;
        this.parseInput();
      };
      reader.readAsText(file);
    });

    // Drag & drop
    const zone = document.getElementById('upload-zone');
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
        this._showError('Please drop a .csv or .json file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        document.getElementById('csv-input').value = ev.target.result;
        this.parseInput();
      };
      reader.readAsText(file);
    });

    // Column visibility toggle
    document.getElementById('col-vis-toggle').addEventListener('click', () => {
      const panel = document.getElementById('col-vis-panel');
      panel.classList.toggle('open');
    });

    // Export
    document.getElementById('export-csv-btn').addEventListener('click', () => this.exportData('csv'));
    document.getElementById('export-json-btn').addEventListener('click', () => this.exportData('json'));

    // Chart generate
    document.getElementById('gen-chart-btn').addEventListener('click', () => this._renderChart());

    // Correlation calculate
    document.getElementById('corr-calc-btn').addEventListener('click', () => this.calculateCorrelation());
  },

  parseInput() {
    this._showError('');
    const text = document.getElementById('csv-input').value.trim();
    if (!text) { this._showError('Please paste data or upload a file first.'); return; }

    try {
      let parsed;
      if (this.format === 'json') {
        parsed = DataParser.parseJSON(text);
      } else {
        parsed = DataParser.parseCSV(text);
      }

      const validation = DataParser.validate(parsed);
      if (!validation.valid) { this._showError(validation.error); return; }

      const types = DataParser.detectTypes(parsed.headers, parsed.rows);
      this.data = { headers: parsed.headers, rows: parsed.rows, types };
      this.visibleCols = new Set(parsed.headers);
      this.sortCol = null;
      this.sortDir = 'asc';

      this.renderAll();
      document.getElementById('data-section').style.display = 'block';
      document.getElementById('data-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {
      this._showError('Parse error: ' + e.message);
    }
  },

  renderAll() {
    this.renderStats();
    this.renderTable();
    this.renderColStats();
    this.updateColVisibilityPanel();
    this._populateChartControls();
    this._populateCorrSelects();
    this._renderChart();
  },

  renderStats() {
    const { headers, rows, types } = this.data;
    const numericCount = headers.filter(h => types[h] === 'numeric').length;
    const totalCells = rows.length * headers.length;
    const nonNullCells = headers.reduce((acc, h) => {
      return acc + rows.filter(r => r[h] !== '' && r[h] !== undefined && r[h] !== null).length;
    }, 0);
    const nonNullPct = totalCells > 0 ? Math.round((nonNullCells / totalCells) * 100) : 0;

    document.getElementById('stat-rows').textContent = rows.length.toLocaleString();
    document.getElementById('stat-cols').textContent = headers.length;
    document.getElementById('stat-numeric').textContent = numericCount;
    document.getElementById('stat-nonnull').textContent = nonNullPct + '%';
    document.getElementById('preview-badge').textContent = rows.length + ' rows';
  },

  renderTable() {
    const { headers, rows } = this.data;
    const visHeaders = headers.filter(h => this.visibleCols.has(h));
    let sorted = [...rows];

    if (this.sortCol && this.visibleCols.has(this.sortCol)) {
      sorted.sort((a, b) => {
        const av = a[this.sortCol], bv = b[this.sortCol];
        const an = parseFloat(av), bn = parseFloat(bv);
        if (!isNaN(an) && !isNaN(bn)) return this.sortDir === 'asc' ? an - bn : bn - an;
        return this.sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }

    const limit = this.rowLimit === Infinity ? sorted.length : this.rowLimit;
    const display = sorted.slice(0, limit);
    const container = document.getElementById('table-container');

    let html = '<table><thead><tr>';
    visHeaders.forEach(h => {
      const cls = this.sortCol === h ? this.sortDir : '';
      html += `<th class="${cls}" data-col="${h}"><span>${h}</span><span class="sort-icon"></span></th>`;
    });
    html += '</tr></thead><tbody>';
    display.forEach(row => {
      html += '<tr>';
      visHeaders.forEach(h => {
        const val = row[h] !== undefined ? row[h] : '';
        const num = parseFloat(val);
        const disp = !isNaN(num) && val !== '' ? parseFloat(num.toFixed(4)).toLocaleString() : val;
        html += `<td>${disp}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';

    const shown = display.length;
    const total = sorted.length;
    html += `<div class="table-footer">Showing ${shown.toLocaleString()} of ${total.toLocaleString()} rows</div>`;
    container.innerHTML = html;

    // Sort listeners
    container.querySelectorAll('th[data-col]').forEach(th => {
      th.addEventListener('click', () => this.handleSort(th.dataset.col));
    });
  },

  renderColStats() {
    const { headers, rows, types } = this.data;
    const stats = StatsEngine.analyze(headers, rows, types);
    const container = document.getElementById('col-stats');
    let html = '';

    stats.forEach(s => {
      html += `<div class="col-stat-card">
        <div class="col-stat-name" title="${s.name}">${s.name}</div>
        <div class="col-stat-type">${s.type === 'numeric' ? '# Numeric' : 'Abc Text'}</div>`;

      if (s.type === 'numeric') {
        html += `
          <div class="col-stat-row"><span class="label">Min</span><span class="value">${this._fmt(s.min)}</span></div>
          <div class="col-stat-row"><span class="label">Max</span><span class="value">${this._fmt(s.max)}</span></div>
          <div class="col-stat-row"><span class="label">Mean</span><span class="value">${this._fmt(s.mean)}</span></div>
          <div class="col-stat-row"><span class="label">Median</span><span class="value">${this._fmt(s.median)}</span></div>
          <div class="col-stat-row"><span class="label">Std Dev</span><span class="value">${this._fmt(s.stdDev)}</span></div>
          <div class="col-stat-row"><span class="label">Sum</span><span class="value">${this._fmt(s.sum)}</span></div>`;
      } else {
        const top = s.topValue && s.topValue.length > 12 ? s.topValue.slice(0, 12) + '…' : (s.topValue || '—');
        html += `
          <div class="col-stat-row"><span class="label">Unique</span><span class="value">${s.unique}</span></div>
          <div class="col-stat-row"><span class="label">Top Value</span><span class="value" title="${s.topValue}">${top}</span></div>
          <div class="col-stat-row"><span class="label">Top Count</span><span class="value">${s.topCount}</span></div>`;
      }

      html += `
          <div class="col-stat-row"><span class="label">Non-null</span><span class="value">${s.count - s.nullCount}</span></div>
          <div class="col-stat-row"><span class="label">Missing</span><span class="value" style="color:${s.nullCount > 0 ? 'var(--danger)' : 'var(--success)'}">${s.nullCount}</span></div>
        </div>`;
    });

    container.innerHTML = html;
  },

  updateColVisibilityPanel() {
    const { headers } = this.data;
    const container = document.getElementById('col-vis-checkboxes');
    let html = '';
    headers.forEach(h => {
      const checked = this.visibleCols.has(h) ? 'checked' : '';
      html += `<label class="col-vis-item">
        <input type="checkbox" data-col="${h}" ${checked} />
        <span>${h}</span>
      </label>`;
    });
    container.innerHTML = html;

    container.querySelectorAll('input[type=checkbox]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) this.visibleCols.add(cb.dataset.col);
        else this.visibleCols.delete(cb.dataset.col);
        this.renderTable();
      });
    });
  },

  exportData(format) {
    const { headers, rows } = this.data;
    let content, filename, mime;
    if (format === 'csv') {
      content = DataParser.toCSV(headers, rows, this.visibleCols);
      filename = 'export.csv';
      mime = 'text/csv';
    } else {
      content = DataParser.toJSON(headers, rows, this.visibleCols);
      filename = 'export.json';
      mime = 'application/json';
    }
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  },

  calculateCorrelation() {
    const col1 = document.getElementById('corr-col1').value;
    const col2 = document.getElementById('corr-col2').value;
    const result = document.getElementById('corr-result');

    if (!col1 || !col2) { result.textContent = 'Select two numeric columns.'; return; }
    if (col1 === col2) { result.innerHTML = '<strong>r = 1.0000</strong> — Perfect (same column)'; return; }

    const { headers, rows } = this.data;
    const arr1 = StatsEngine.getNumericValues(col1, rows, headers);
    const arr2 = StatsEngine.getNumericValues(col2, rows, headers);
    const r = StatsEngine.pearsonCorrelation(arr1, arr2);

    if (r === null) { result.textContent = 'Could not calculate — insufficient data.'; return; }

    const abs = Math.abs(r);
    let interp;
    if (abs >= 0.9) interp = r > 0 ? 'Very strong positive' : 'Very strong negative';
    else if (abs >= 0.7) interp = r > 0 ? 'Strong positive' : 'Strong negative';
    else if (abs >= 0.5) interp = r > 0 ? 'Moderate positive' : 'Moderate negative';
    else if (abs >= 0.3) interp = r > 0 ? 'Weak positive' : 'Weak negative';
    else interp = 'Little or no linear';

    result.innerHTML = `<strong>r = ${r.toFixed(4)}</strong> — ${interp} correlation`;

    // Render scatter
    const n = Math.min(arr1.length, arr2.length);
    Visualizer.renderScatter(arr1.slice(0, n), arr2.slice(0, n), col1, col2);
  },

  handleSort(col) {
    if (this.sortCol === col) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortCol = col;
      this.sortDir = 'asc';
    }
    this.renderTable();
  },

  _populateChartControls() {
    const { headers, types } = this.data;
    const xSel = document.getElementById('chart-x');
    const ySel = document.getElementById('chart-y');
    xSel.innerHTML = '';
    ySel.innerHTML = '';
    headers.forEach(h => {
      xSel.innerHTML += `<option value="${h}">${h}</option>`;
      if (types[h] === 'numeric') ySel.innerHTML += `<option value="${h}">${h}</option>`;
    });
    if (headers[0]) xSel.value = headers[0];
    const firstNum = headers.find(h => types[h] === 'numeric');
    if (firstNum) ySel.value = firstNum;
  },

  _populateCorrSelects() {
    const { headers, types } = this.data;
    const numericHeaders = headers.filter(h => types[h] === 'numeric');
    ['corr-col1', 'corr-col2'].forEach((id, idx) => {
      const sel = document.getElementById(id);
      sel.innerHTML = '<option value="">— Select column —</option>';
      numericHeaders.forEach(h => { sel.innerHTML += `<option value="${h}">${h}</option>`; });
      if (numericHeaders[idx]) sel.value = numericHeaders[idx];
    });
  },

  _renderChart() {
    if (!this.data.rows.length) return;
    const xCol = document.getElementById('chart-x').value;
    const yCol = document.getElementById('chart-y').value;
    const type = document.getElementById('chart-type').value;
    if (!xCol || !yCol) return;

    const labels = this.data.rows.map(r => r[xCol]);
    const values = this.data.rows.map(r => parseFloat(r[yCol]) || 0);
    Visualizer.render(type, labels, values, xCol, yCol);
  },

  _showError(msg) {
    const el = document.getElementById('error-msg');
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
  },

  _fmt(n) {
    if (n === undefined || n === null) return '—';
    if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return parseFloat(n.toFixed(4)).toString();
  }
};

window.addEventListener('DOMContentLoaded', () => DataExplorer.init());
