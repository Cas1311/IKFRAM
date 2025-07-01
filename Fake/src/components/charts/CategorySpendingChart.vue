<template>
  <div class="chart-container">
    <h3 v-if="title">{{ title }}</h3>
    <div class="chart-wrapper">
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div v-if="showLegend" class="legend">
      <div v-for="(item, index) in chartData" :key="index" class="legend-item">
        <span 
          class="legend-color" 
          :style="{ backgroundColor: item.backgroundColor }"
        ></span>
        <span class="legend-label">{{ item.label }}</span>
        <span class="legend-amount">{{ formatCurrency(item.value) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Register chart components
Chart.register(ArcElement, Tooltip, Legend);

export default {
  name: 'CategorySpendingChart',
  props: {
    title: {
      type: String,
      default: 'Uitgaven per categorie'
    },
    categories: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(item => 
          typeof item === 'object' && 
          'id' in item && 
          'name' in item && 
          'amount' in item
        );
      }
    },
    showLegend: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: '300px'
    },
    maxItems: {
      type: Number,
      default: 7
    }
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chart = null;

    // Define a set of visually distinct colors
    const chartColors = [
      '#4a6fa5', '#4caf50', '#f44336', '#ff9800', '#9c27b0',
      '#00bcd4', '#ff5722', '#607d8b', '#8bc34a', '#e91e63',
      '#3f51b5', '#009688', '#795548', '#673ab7', '#ffc107'
    ];

    const chartData = computed(() => {
      // Sort categories by amount (descending) and limit to maxItems
      const sorted = [...props.categories]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, props.maxItems);

      // Group remaining items into 'Overig' category if needed
      if (props.categories.length > props.maxItems) {
        const otherAmount = props.categories
          .slice(props.maxItems)
          .reduce((sum, cat) => sum + cat.amount, 0);
        
        if (otherAmount > 0) {
          sorted.push({
            id: 'other',
            name: 'Overig',
            amount: otherAmount
          });
        }
      }

      return sorted.map((category, index) => ({
        id: category.id,
        label: category.name,
        value: category.amount,
        backgroundColor: chartColors[index % chartColors.length],
        borderColor: '#fff',
        borderWidth: 2
      }));
    });

    const renderChart = () => {
      if (!chartCanvas.value) return;

      if (chart) {
        chart.destroy();
      }

      const ctx = chartCanvas.value.getContext('2d');
      
      chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: chartData.value.map(item => item.label),
          datasets: [{
            data: chartData.value.map(item => item.value),
            backgroundColor: chartData.value.map(item => item.backgroundColor),
            borderColor: chartData.value.map(item => item.borderColor),
            borderWidth: chartData.value.map(item => item.borderWidth)
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: {
              display: false // We'll use custom legend
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: €${value.toLocaleString('nl-NL')} (${percentage}%)`;
                }
              }
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    };

    onMounted(() => {
      renderChart();
    });

    onBeforeUnmount(() => {
      if (chart) {
        chart.destroy();
      }
    });

    watch(() => props.categories, () => {
      renderChart();
    }, { deep: true });

    return {
      chartCanvas,
      chartData,
      formatCurrency
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
  display: flex;
  flex-direction: column;
}

.chart-container h3 {
  margin: 0 0 1rem 0;
  color: #444;
  font-size: 1.1rem;
  font-weight: 500;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 250px;
  margin-bottom: 1rem;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 1rem;
  font-size: 0.85rem;
}

.legend-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.legend-label {
  margin-right: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.legend-amount {
  font-weight: 500;
  color: #333;
  margin-left: auto;
  padding-left: 0.5rem;
}

@media (max-width: 768px) {
  .legend {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .legend-item {
    margin-right: 0;
  }
  
  .legend-label {
    max-width: 100px;
  }
}
</style>
