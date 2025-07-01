<template>
  <div class="chart-container">
    <h3 v-if="title">{{ title }}</h3>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { Chart, registerables } from 'chart.js';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

Chart.register(...registerables);

export default {
  name: 'MonthlyTrendsChart',
  props: {
    title: {
      type: String,
      default: 'Maandelijkse Trends'
    },
    transactions: {
      type: Array,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      default: 'line',
      validator: (value) => ['line', 'bar'].includes(value)
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chart = null;

    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(props.year, i, 1);
      return format(date, 'MMM', { locale: nl });
    });

    const processData = () => {
      // Initialize monthly data
      const monthlyData = Array(12).fill(0);
      
      // Process transactions
      props.transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        if (date.getFullYear() === props.year) {
          const month = date.getMonth();
          monthlyData[month] += transaction.amount;
        }
      });
      
      return monthlyData;
    };

    const renderChart = () => {
      if (chart) {
        chart.destroy();
      }

      const ctx = chartCanvas.value.getContext('2d');
      const data = processData();
      
      chart = new Chart(ctx, {
        type: props.type,
        data: {
          labels: months,
          datasets: [{
            label: 'Bedrag (€)',
            data: data,
            backgroundColor: 'rgba(74, 111, 165, 0.2)',
            borderColor: 'rgba(74, 111, 165, 1)',
            borderWidth: 2,
            tension: 0.1,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `€${context.raw.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `€${value.toLocaleString('nl-NL')}`
              }
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          }
        }
      });
    };

    onMounted(() => {
      if (chartCanvas.value) {
        renderChart();
      }
    });

    onBeforeUnmount(() => {
      if (chart) {
        chart.destroy();
      }
    });

    watch([() => props.transactions, () => props.year], () => {
      if (chartCanvas.value) {
        renderChart();
      }
    }, { deep: true });

    return {
      chartCanvas
    };
  }
};
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-container h3 {
  margin: 0 0 1rem 0;
  color: #444;
  font-size: 1.1rem;
  font-weight: 500;
}

canvas {
  width: 100% !important;
  height: 100% !important;
  min-height: 250px;
}
</style>
