<template>
  <canvas id="monthlyChart">
  </canvas>
</template>

<script>
export default {
  name: "MonthTransactionChart",
  props: {
    monthTransactionAmounts: {
      type: Array,
      default: () => []
    },
    chartColor1: String,
    chartColor2: String,
    solidColor: String,
  },
  watch: {
    monthTransactionAmounts(newValue) {
      this.chart.data.datasets[0].data = newValue;
      this.chart.data.datasets[0].borderColor = this.solidColor;
      const ctx = document.getElementById('monthlyChart').getContext('2d');
      var gradient = ctx.createLinearGradient(0, 0, 0, 118);
      gradient.addColorStop(0, this.chartColor1);
      gradient.addColorStop(1, this.chartColor2);
      this.chart.data.datasets[0].backgroundColor = gradient;
      this.chart.update();
    },

  },
  data: () => {
    return {
      chart: null,
    }
  },
  methods: {
    initializeChart() {
      const ctx = document.getElementById('monthlyChart').getContext('2d');
      var gradient = ctx.createLinearGradient(0, 0, 0, 118);
      gradient.addColorStop(0, this.chartColor1);
      gradient.addColorStop(1, this.chartColor2);
      this.chart = new this.$chartjs(ctx, {
        type: 'line',
        responsive: true,
        interaction: {
          intersect: false,
        },
        data: {
          labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'],
          datasets: [{
            data: [...this.monthTransactionAmounts],
            backgroundColor: gradient,
            fill: true,
            borderWidth: 2,
            borderColor: this.solidColor,
            tension: 0.4,
          }],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },

          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                display: false,
              },
              grid: {
                display: false,
                drawBorder: false,
              },
            },
            x: {
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                display: false,
              }
            }
          }
        }
      });
      this.chart.update();
    }
  },
  mounted() {
    this.initializeChart();
  },

}

</script>
