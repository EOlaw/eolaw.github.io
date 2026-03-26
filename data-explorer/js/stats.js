/* data-explorer/js/stats.js */
const StatsEngine = {

  analyze(headers, rows, types) {
    return headers.map(name => {
      const type = types[name] || 'string';
      const vals = rows.map(r => r[name]);
      const nonNullVals = vals.filter(v => v !== '' && v !== undefined && v !== null);
      const nullCount = vals.length - nonNullVals.length;

      if (type === 'numeric') {
        const nums = this.getNumericValues(name, rows, headers);
        const mean = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
        return {
          name,
          type: 'numeric',
          count: vals.length,
          nullCount,
          min: nums.length ? Math.min(...nums) : null,
          max: nums.length ? Math.max(...nums) : null,
          mean: nums.length ? mean : null,
          median: nums.length ? this.median(nums) : null,
          stdDev: nums.length ? this.stdDev(nums, mean) : null,
          sum: nums.length ? nums.reduce((a, b) => a + b, 0) : null
        };
      } else {
        const unique = new Set(nonNullVals);
        const freq = {};
        nonNullVals.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
        let topValue = '';
        let topCount = 0;
        Object.entries(freq).forEach(([k, v]) => { if (v > topCount) { topCount = v; topValue = k; } });
        return {
          name,
          type: 'string',
          count: vals.length,
          nullCount,
          unique: unique.size,
          topValue,
          topCount
        };
      }
    });
  },

  getNumericValues(col, rows, headers) {
    return rows
      .map(r => r[col])
      .filter(v => v !== '' && v !== undefined && v !== null)
      .map(v => parseFloat(v))
      .filter(v => !isNaN(v));
  },

  median(arr) {
    if (!arr.length) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  },

  stdDev(arr, mean) {
    if (!arr.length) return null;
    const variance = arr.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  },

  pearsonCorrelation(arr1, arr2) {
    const n = Math.min(arr1.length, arr2.length);
    if (n === 0) return null;
    const a = arr1.slice(0, n);
    const b = arr2.slice(0, n);
    const meanA = a.reduce((s, v) => s + v, 0) / n;
    const meanB = b.reduce((s, v) => s + v, 0) / n;
    let num = 0, denomA = 0, denomB = 0;
    for (let i = 0; i < n; i++) {
      const da = a[i] - meanA;
      const db = b[i] - meanB;
      num += da * db;
      denomA += da * da;
      denomB += db * db;
    }
    const denom = Math.sqrt(denomA * denomB);
    return denom === 0 ? 0 : num / denom;
  }

};
