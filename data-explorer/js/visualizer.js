/* data-explorer/js/visualizer.js */
const Visualizer = {
  chart: null,
  canvas: null,

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
  },

  render(type, xValues, yValues, xLabel, yLabel) {
    this.destroy();
    const ctx = this.canvas.getContext('2d');
    const gold = '#ffc451';
    const goldLight = 'rgba(255,196,81,0.15)';

    this.chart = new Chart(ctx, {
      type,
      data: {
        labels: xValues,
        datasets: [{
          label: yLabel,
          data: yValues,
          backgroundColor: type === 'bar' ? gold : goldLight,
          borderColor: gold,
          borderWidth: type === 'line' ? 2.5 : 1,
          borderRadius: type === 'bar' ? 6 : 0,
          tension: 0.4,
          pointBackgroundColor: gold,
          pointRadius: type === 'line' ? 4 : 0,
          fill: type === 'line'
        }]
      },
      options: this.getChartOptions(type)
    });
  },

  renderScatter(xVals, yVals, xLabel, yLabel) {
    this.destroy();
    const ctx = this.canvas.getContext('2d');
    const gold = '#ffc451';

    const data = xVals.map((x, i) => ({ x, y: yVals[i] }));

    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: `${xLabel} vs ${yLabel}`,
          data,
          backgroundColor: 'rgba(255,196,81,0.5)',
          borderColor: gold,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#9ca3af', font: { family: 'Inter', size: 12 } } },
          tooltip: {
            backgroundColor: '#1a1d27',
            borderColor: '#2a2d3e',
            borderWidth: 1,
            titleColor: '#ffc451',
            bodyColor: '#f1f1f1',
            padding: 10
          }
        },
        scales: {
          x: {
            title: { display: true, text: xLabel, color: '#9ca3af' },
            ticks: { color: '#9ca3af', font: { family: 'Inter', size: 11 } },
            grid: { color: 'rgba(42,45,62,0.8)' }
          },
          y: {
            title: { display: true, text: yLabel, color: '#9ca3af' },
            ticks: { color: '#9ca3af', font: { family: 'Inter', size: 11 } },
            grid: { color: 'rgba(42,45,62,0.8)' }
          }
        }
      }
    });
  },

  destroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  },

  getChartOptions(type) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#9ca3af', font: { family: 'Inter', size: 12 } }
        },
        tooltip: {
          backgroundColor: '#1a1d27',
          borderColor: '#2a2d3e',
          borderWidth: 1,
          titleColor: '#ffc451',
          bodyColor: '#f1f1f1',
          padding: 10
        }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af', font: { family: 'Inter', size: 11 } },
          grid: { color: 'rgba(42,45,62,0.8)' }
        },
        y: {
          ticks: { color: '#9ca3af', font: { family: 'Inter', size: 11 } },
          grid: { color: 'rgba(42,45,62,0.8)' }
        }
      }
    };
  }
};
