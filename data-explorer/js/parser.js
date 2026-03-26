/* data-explorer/js/parser.js */
const DataParser = {

  parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) throw new Error('CSV must have at least a header row and one data row.');

    // Detect delimiter: comma first, then semicolon, then tab
    const firstLine = lines[0];
    let delim = ',';
    if ((firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length) delim = ';';
    else if ((firstLine.match(/\t/g) || []).length > (firstLine.match(/,/g) || []).length) delim = '\t';

    const parseLine = (line) => {
      const fields = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
          else { inQuotes = !inQuotes; }
        } else if (ch === delim && !inQuotes) {
          fields.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
      fields.push(current.trim());
      return fields;
    };

    const headers = parseLine(lines[0]);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const vals = parseLine(lines[i]);
      const row = {};
      headers.forEach((h, j) => { row[h] = vals[j] !== undefined ? vals[j] : ''; });
      rows.push(row);
    }
    return { headers, rows };
  },

  parseJSON(text) {
    const arr = JSON.parse(text);
    if (!Array.isArray(arr) || arr.length === 0) throw new Error('JSON must be a non-empty array of objects.');
    const headers = Object.keys(arr[0]);
    const rows = arr.map(obj => {
      const row = {};
      headers.forEach(h => { row[h] = obj[h] !== undefined && obj[h] !== null ? String(obj[h]) : ''; });
      return row;
    });
    return { headers, rows };
  },

  detectTypes(headers, rows) {
    const types = {};
    headers.forEach(col => {
      const vals = rows.map(r => r[col]).filter(v => v !== '' && v !== undefined && v !== null);
      if (vals.length === 0) { types[col] = 'string'; return; }
      const numericCount = vals.filter(v => !isNaN(parseFloat(v)) && isFinite(v)).length;
      types[col] = (numericCount / vals.length) > 0.8 ? 'numeric' : 'string';
    });
    return types;
  },

  toCSV(headers, rows, visibleCols) {
    const cols = headers.filter(h => visibleCols.has(h));
    const escape = (v) => {
      const s = String(v === undefined || v === null ? '' : v);
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [cols.map(escape).join(',')];
    rows.forEach(row => { lines.push(cols.map(h => escape(row[h])).join(',')); });
    return lines.join('\n');
  },

  toJSON(headers, rows, visibleCols) {
    const cols = headers.filter(h => visibleCols.has(h));
    const arr = rows.map(row => {
      const obj = {};
      cols.forEach(h => { obj[h] = row[h]; });
      return obj;
    });
    return JSON.stringify(arr, null, 2);
  },

  validate(parsed) {
    if (!parsed) return { valid: false, error: 'No data parsed.' };
    if (!parsed.headers || parsed.headers.length === 0) return { valid: false, error: 'No columns found.' };
    if (!parsed.rows || parsed.rows.length === 0) return { valid: false, error: 'No data rows found.' };
    return { valid: true, error: null };
  }

};
