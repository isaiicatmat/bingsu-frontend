<template>
  <canvas id="myChart" style="max-height: 150px">
  </canvas>
</template>

<script>
export default {
  name: "YearTransactionChart",
  props: {
    yearTransactionAmounts: {
      type: Array,
    },
    yearAssignedAmounts: {
      type: Array,
    },
  },
  watch: {
    yearTransactionAmounts(newValue) {
      this.chart.data.datasets[1].data = newValue;
      this.chart.update();
    },
    yearAssignedAmounts(newValue) {
      this.chart.data.datasets[0].data = newValue;
      this.chart.update();
    }
  },
  data: () => {
    return {
      chart: null,
    }
  },
  methods: {
    initializeChart() {
      const ctx = document.getElementById('myChart');
      this.chart = new this.$chartjs(ctx, {
        type: 'line',
        responsive: true,
        interaction: {
          intersect: false,
        },
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
            'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          datasets: [{
            label: 'Ingresos',
            data: [...this.yearAssignedAmounts],
            backgroundColor: [
              'rgba(5, 30, 38, 1)',
              'rgba(5, 30, 38, 1)',
              'rgba(5, 30, 38, 1)',
              'rgba(5, 30, 38, 1)',
              'rgba(5, 30, 38, 1)',
              'rgba(5, 30, 38, 1)',
              'rgba(5, 30, 38, 1)',
              'rgba(5, 30, 38, 1)',
              'rgba(5, 30, 38, 1)',
              'rgba(5, 30, 38, 1)',
              'rgba(5, 30, 38, 1)',
            ],
            borderWidth: 2,
            borderColor: "#051E26",
            tension: 0.2,
          }, {
            label: 'Gastos',
            data: [...this.yearTransactionAmounts],
            backgroundColor: [
              'rgba(245, 34, 59, 1)',
              'rgba(245, 34, 59, 1)',
              'rgba(245, 34, 59, 1)',
              'rgba(245, 34, 59, 1)',
              'rgba(245, 34, 59, 1)',
              'rgba(245, 34, 59, 1)',
              'rgba(245, 34, 59, 1)',
              'rgba(245, 34, 59, 1)',
              'rgba(245, 34, 59, 1)',
              'rgba(245, 34, 59, 1)',
            ],
            borderWidth: 2,
            borderColor: "#F5223B",
            tension: .2,
          }]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                font: {
                  family: "'Lato', sans-serif"
                }
              }
            },

          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  family: "'Lato', sans-serif"
                }
              },
              grid: {
                offset: false
              },
            },
            x: {
              ticks: {
                font: {
                  family: "'Lato', sans-serif"
                }
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
  }
}
</script>

<style scoped>

</style>