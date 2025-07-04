<template>
  <div class="bar-chart-container">
    <div class="chart-header">
      <h2>Income vs Expenses - Last 12 Months</h2>
    </div>

    <div class="chart-wrapper">
      <div v-if="isLoading" class="loading-state">
        <p>Loading chart data...</p>
      </div>
      <div v-else-if="!hasData" class="no-data-state">
        <p>No transaction data available</p>
      </div>
      <canvas ref="chartCanvas" class="chart-canvas" :style="{ display: isLoading ? 'none' : 'block' }"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'BarChart',
  data() {
    return {
      chart: null,
      isLoading: true,
      isDestroyed: false,
      isCreatingChart: false
    };
  },
  computed: {
    transactions() {
      return this.$store.getters['transactions/transactions'] || [];
    },
    chartData() {
      const months = this.generateMonthLabels();
      const data = this.processTransactionData(months);
      return data;
    },
    hasData() {
      const data = this.chartData;
      return data && data.length > 0 && data.some(month => month.income > 0 || month.expenses > 0);
    }
  },
  watch: {
    transactions: {
      handler() {
        if (!this.isLoading && !this.isDestroyed && !this.isCreatingChart) {
          console.log('Transactions changed, updating chart');
          this.$nextTick(() => {
            this.updateChart();
          });
        }
      },
      deep: false
    },
    hasData: {
      handler(newVal, oldVal) {
        if (!this.isLoading && !this.isDestroyed && !this.isCreatingChart && newVal !== oldVal) {
          console.log('Data availability changed:', oldVal, '->', newVal);
          this.$nextTick(() => {
            this.forceRecreateChart();
          });
        }
      },
      immediate: false
    }
  },
  mounted() {
    // Reset flags on mount to ensure clean state
    this.isDestroyed = false;
    this.isLoading = true;
    this.isCreatingChart = false;
    this.initializeComponent();
  },
  beforeUnmount() {
    // Set flags to prevent any new chart operations
    this.isDestroyed = true;
    this.isLoading = true;
    this.destroyChart();
  },
  methods: {
    async initializeComponent() {
      try {
        // Ensure we're in a clean state
        if (this.isDestroyed) {
          console.log('Component marked as destroyed, skipping initialization');
          return;
        }

        console.log('Initializing chart component...');

        // Load transactions if not already loaded
        if (this.transactions.length === 0) {
          console.log('No transactions found, fetching from store...');
          await this.$store.dispatch('transactions/fetchTransactions');
        }

        // Check again after async operation
        if (this.isDestroyed) {
          console.log('Component destroyed during initialization');
          return;
        }

        // console.log('Transactions loaded:', this.transactions.length, this.transactions);

        this.isLoading = false;

        // Wait for DOM to be ready and ensure canvas is rendered
        await this.$nextTick();

        // Final check before proceeding
        if (this.isDestroyed) {
          console.log('Component destroyed before chart creation');
          return;
        }

        // Additional delay to ensure canvas is fully initialized
        setTimeout(() => {
          if (!this.isDestroyed && this.$refs.chartCanvas) {
            this.createChart();
          } else {
            console.log('Canvas still not ready, retrying...');
            setTimeout(() => {
              if (!this.isDestroyed) {
                this.createChart();
              }
            }, 200);
          }
        }, 150);

      } catch (error) {
        console.error('Error initializing chart:', error);
        this.isLoading = false;
      }
    },

    generateMonthLabels() {
      const months = {};
      const currentDate = new Date();

      // Fixed to 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months[key] = {
          income: 0,
          expenses: 0,
          label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          date: date
        };
      }

      return months;
    },

    processTransactionData(months) {
      // console.log('Processing transaction data with months:', months);
      // console.log('Available transactions:', this.transactions);

      // Reset all values
      Object.keys(months).forEach(key => {
        months[key].income = 0;
        months[key].expenses = 0;
      });

      // Process transactions
      this.transactions.forEach(transaction => {
        // console.log('Processing transaction:', transaction);
        const transactionDate = new Date(transaction.date || transaction.timestamp);
        const key = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
        // console.log('Transaction date key:', key, 'Available month keys:', Object.keys(months));

        if (months[key]) {
          const amount = parseFloat(transaction.amount) || 0;
          // console.log('Adding amount:', amount, 'type:', transaction.type);
          if (transaction.type === 'income') {
            months[key].income += amount;
          } else if (transaction.type === 'expense') {
            months[key].expenses += amount;
          }
        }
      });

      // Return a plain object to avoid reactive issues
      const result = Object.values(months).map(month => ({
        label: month.label,
        income: month.income,
        expenses: month.expenses
      }));

      // console.log('Final processed data:', result);
      return result;
    },

    getChartDataSnapshot() {
      const months = this.generateMonthLabels();
      return this.processTransactionData(months);
    },

    createChart() {
      // Early exit checks
      if (this.isDestroyed || this.isCreatingChart) {
        console.log('Chart creation skipped - component destroyed or already creating');
        return;
      }

      // Set flag to prevent concurrent chart creation
      this.isCreatingChart = true;

      // Destroy existing chart
      this.destroyChart();

      // Check if still loading
      if (this.isLoading) {
        console.log('Still loading, skipping chart creation');
        this.isCreatingChart = false;
        return;
      }

      console.log('Creating chart...');

      // Check if canvas is available
      if (!this.$refs.chartCanvas) {
        console.log('Canvas not available, retrying...');
        this.isCreatingChart = false;
        setTimeout(() => {
          if (!this.isDestroyed) {
            this.createChart();
          }
        }, 100);
        return;
      }

      // Additional check to ensure the canvas element is still in DOM
      if (!this.$refs.chartCanvas.isConnected) {
        console.log('Canvas is not connected to DOM');
        this.isCreatingChart = false;
        return;
      }

      // Get canvas context with error handling
      let ctx;
      try {
        ctx = this.$refs.chartCanvas.getContext('2d');
      } catch (error) {
        console.error('Error getting canvas context:', error);
        this.isCreatingChart = false;
        setTimeout(() => {
          if (!this.isDestroyed) {
            this.createChart();
          }
        }, 100);
        return;
      }

      if (!ctx) {
        console.log('Canvas context not available, retrying...');
        this.isCreatingChart = false;
        setTimeout(() => {
          if (!this.isDestroyed) {
            this.createChart();
          }
        }, 100);
        return;
      }

      // Final check before creating chart
      if (this.isDestroyed) {
        console.log('Component destroyed before chart creation');
        this.isCreatingChart = false;
        return;
      }

      // Get a snapshot of the data to avoid reactive issues
      const chartDataSnapshot = this.getChartDataSnapshot();

      // Check if we have data after processing
      if (!chartDataSnapshot || chartDataSnapshot.length === 0) {
        console.log('No data available for chart after processing');
        this.isCreatingChart = false;
        return;
      }

      console.log('Chart data snapshot:', chartDataSnapshot.length, 'items');

      // Get resolved CSS variable colors
      const incomeColor = this.getCSSVariableValue('--color-success');
      const expenseColor = this.getCSSVariableValue('--color-error');

      try {
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: chartDataSnapshot.map(item => item.label),
            datasets: [
              {
                label: 'Income',
                data: chartDataSnapshot.map(item => item.income),
                backgroundColor: incomeColor,
                borderColor: incomeColor,
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
              },
              {
                label: 'Expenses',
                data: chartDataSnapshot.map(item => item.expenses),
                backgroundColor: expenseColor,
                borderColor: expenseColor,
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              // Disable animations to prevent timing issues
              duration: 0
            },
            interaction: {
              intersect: false,
              mode: 'index'
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  font: {
                    size: 12
                  }
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                  font: {
                    size: 12
                  },
                  callback: function (value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.label;
                    const value = context.parsed.y;
                    return `${label}: $${value.toLocaleString()}`;
                  }
                }
              },
              legend: {
                display: true,
                position: 'top',
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 14
                  }
                }
              }
            }
          }
        });
        console.log('Chart created successfully');
      } catch (error) {
        console.error('Error creating chart:', error);
      } finally {
        // Always reset the flag
        this.isCreatingChart = false;
      }
    },

    updateChart() {
      console.log('Update chart called - isLoading:', this.isLoading, 'isDestroyed:', this.isDestroyed, 'isCreatingChart:', this.isCreatingChart);

      if (this.isLoading || this.isDestroyed || this.isCreatingChart || !this.$refs.chartCanvas) {
        console.log('Update chart skipped due to state check');
        return;
      }

      if (!this.chart) {
        console.log('No existing chart, creating new one');
        this.createChart();
        return;
      }

      console.log('Recreating chart with new data');
      // Recreate chart with new data
      this.destroyChart();
      setTimeout(() => {
        // Double-check that canvas is still available and component not destroyed
        if (!this.isDestroyed && !this.isCreatingChart && this.$refs.chartCanvas && this.$refs.chartCanvas.isConnected) {
          this.createChart();
        } else {
          console.log('Chart recreation skipped - component state changed');
        }
      }, 50);
    },

    // Method to force chart recreation
    forceRecreateChart() {
      console.log('Force recreate chart called');
      if (this.isCreatingChart) {
        console.log('Chart creation already in progress, skipping force recreate');
        return;
      }
      this.destroyChart();
      this.$nextTick(() => {
        if (!this.isDestroyed && !this.isCreatingChart) {
          this.createChart();
        }
      });
    },

    destroyChart() {
      if (this.chart) {
        try {
          // Stop any ongoing animations before destroying
          if (typeof this.chart.stop === 'function') {
            this.chart.stop();
          }
          this.chart.destroy();
        } catch (error) {
          console.error('Error destroying chart:', error);
        }
        this.chart = null;
      }
    },

    // Helper method to get CSS variable values
    getCSSVariableValue(variableName) {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
    }
  }
};
</script>

<style scoped>
.bar-chart-container {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  padding: 24px;
  margin: 20px 0;
}

.chart-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
}

.chart-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
}

.chart-canvas {
  max-width: 100%;
  max-height: 100%;
}

.loading-state,
.no-data-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
  font-size: 16px;
}

.no-data-state {
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .bar-chart-container {
    padding: 16px;
    margin: 16px 0;
  }

  .chart-header h2 {
    font-size: 1.25rem;
  }

  .chart-wrapper {
    height: 300px;
  }
}
</style>
