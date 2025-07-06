<template>
  <div class="category-charts-container">
    <!-- Income by Category -->
    <base-card class="chart-card">
      <div class="chart-header">
        <h3>Income by Category ({{ timePeriodText }})</h3>
      </div>
      <div class="chart-wrapper">
        <div v-if="isLoading" class="loading-state">
          <p>Loading income data...</p>
        </div>
        <div v-else-if="!hasIncomeData" class="no-data-state">
          <p>No income data available</p>
        </div>
        <canvas ref="incomeChart" class="pie-chart"
          :style="{ display: isLoading || !hasIncomeData ? 'none' : 'block' }"></canvas>
      </div>
    </base-card>

    <!-- Expenses by Category -->
    <base-card class="chart-card">
      <div class="chart-header">
        <h3>Expenses by Category ({{ timePeriodText }})</h3>
      </div>
      <div class="chart-wrapper">
        <div v-if="isLoading" class="loading-state">
          <p>Loading expense data...</p>
        </div>
        <div v-else-if="!hasExpenseData" class="no-data-state">
          <p>No expense data available</p>
        </div>
        <canvas ref="expenseChart" class="pie-chart"
          :style="{ display: isLoading || !hasExpenseData ? 'none' : 'block' }"></canvas>
      </div>
    </base-card>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'CategoryPieCharts',
  props: {
    timePeriod: {
      type: Number,
      default: 12, // Default to 12 months
      validator: value => [1, 3, 6, 12].includes(value)
    }
  },
  data() {
    return {
      incomeChart: null,
      expenseChart: null,
      isLoading: true,
      isDestroyed: false
    };
  },
  computed: {
    transactions() {
      return this.$store.getters['transactions/transactions'] || [];
    },
    filteredTransactions() {
      const now = new Date();
      const cutoffDate = new Date();
      cutoffDate.setMonth(now.getMonth() - this.timePeriod);

      return this.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date || transaction.timestamp);
        return transactionDate >= cutoffDate;
      });
    },
    incomeByCategory() {
      const categories = {};

      this.filteredTransactions
        .filter(t => t.type === 'income')
        .forEach(transaction => {
          // Normalize category name - capitalize first letter, lowercase the rest
          const rawCategory = transaction.category || 'Uncategorized';
          const category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1).toLowerCase();
          categories[category] = (categories[category] || 0) + parseFloat(transaction.amount || 0);
        });

      return categories;
    },
    expensesByCategory() {
      const categories = {};

      this.filteredTransactions
        .filter(t => t.type === 'expense')
        .forEach(transaction => {
          // Normalize category name - capitalize first letter, lowercase the rest
          const rawCategory = transaction.category || 'Uncategorized';
          const category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1).toLowerCase();
          categories[category] = (categories[category] || 0) + parseFloat(transaction.amount || 0);
        });

      return categories;
    },
    hasIncomeData() {
      return Object.keys(this.incomeByCategory).length > 0;
    },
    hasExpenseData() {
      return Object.keys(this.expensesByCategory).length > 0;
    },
    timePeriodText() {
      switch (this.timePeriod) {
        case 1: return 'Last Month';
        case 3: return 'Last 3 Months';
        case 6: return 'Last 6 Months';
        case 12: return 'Last 12 Months';
        default: return `Last ${this.timePeriod} Months`;
      }
    }
  },
  watch: {
    transactions: {
      handler() {
        if (!this.isLoading && !this.isDestroyed) {
          this.$nextTick(() => {
            this.updateCharts();
          });
        }
      },
      deep: false
    },
    timePeriod: {
      handler() {
        if (!this.isLoading && !this.isDestroyed) {
          this.$nextTick(() => {
            this.updateCharts();
          });
        }
      }
    }
  },
  mounted() {
    // Reset flags on mount to ensure clean state
    this.isDestroyed = false;
    this.isLoading = true;
    this.initializeCharts();
  },
  beforeUnmount() {
    // Set flags to prevent any new chart operations
    this.isDestroyed = true;
    this.isLoading = true;
    this.destroyCharts();
  },
  methods: {
    async initializeCharts() {
      try {
        // Check if component is already destroyed
        if (this.isDestroyed) return;

        // Load transactions if not already loaded
        if (this.transactions.length === 0) {
          await this.$store.dispatch('transactions/fetchTransactions');
        }

        // Check again after async operation
        if (this.isDestroyed) return;

        this.isLoading = false;

        await this.$nextTick();

        // Final check before creating charts
        if (!this.isDestroyed) {
          setTimeout(() => {
            if (!this.isDestroyed) {
              this.createCharts();
            }
          }, 100);
        }

      } catch (error) {
        console.error('Error initializing pie charts:', error);
        this.isLoading = false;
      }
    },

    createCharts() {
      if (this.isDestroyed) return;
      this.createIncomeChart();
      this.createExpenseChart();
    },

    createIncomeChart() {
      // Early exit checks
      if (this.isDestroyed || this.isLoading) return;

      this.destroyIncomeChart();

      if (!this.$refs.incomeChart || !this.hasIncomeData) {
        return;
      }

      // Additional check to ensure the canvas element is still in DOM
      if (!this.$refs.incomeChart.isConnected) {
        console.log('Income chart canvas is not connected to DOM');
        return;
      }

      let ctx;
      try {
        ctx = this.$refs.incomeChart.getContext('2d');
      } catch (error) {
        console.error('Error getting income chart context:', error);
        return;
      }

      if (!ctx) {
        console.log('Income chart context not available');
        return;
      }

      // Final check before creating chart
      if (this.isDestroyed) return;

      const data = this.incomeByCategory;
      const labels = Object.keys(data);
      const values = Object.values(data);

      // Get resolved CSS variable colors
      const incomeColors = this.getIncomeColors();

      try {
        this.incomeChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: values,
              backgroundColor: incomeColors,
              borderWidth: 2,
              borderColor: this.getCSSVariableValue('--bg-primary')
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              // Reduce animation duration to minimize timing issues
              duration: 300
            },
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label;
                    const value = context.parsed;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Error creating income chart:', error);
      }
    },

    createExpenseChart() {
      // Early exit checks
      if (this.isDestroyed || this.isLoading) return;

      this.destroyExpenseChart();

      if (!this.$refs.expenseChart || !this.hasExpenseData) {
        return;
      }

      // Additional check to ensure the canvas element is still in DOM
      if (!this.$refs.expenseChart.isConnected) {
        console.log('Expense chart canvas is not connected to DOM');
        return;
      }

      let ctx;
      try {
        ctx = this.$refs.expenseChart.getContext('2d');
      } catch (error) {
        console.error('Error getting expense chart context:', error);
        return;
      }

      if (!ctx) {
        console.log('Expense chart context not available');
        return;
      }

      // Final check before creating chart
      if (this.isDestroyed) return;

      const data = this.expensesByCategory;
      const labels = Object.keys(data);
      const values = Object.values(data);

      // Get resolved CSS variable colors
      const expenseColors = this.getExpenseColors();

      try {
        this.expenseChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: values,
              backgroundColor: expenseColors,
              borderWidth: 2,
              borderColor: this.getCSSVariableValue('--bg-primary')
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              // Reduce animation duration to minimize timing issues
              duration: 300
            },
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label;
                    const value = context.parsed;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Error creating expense chart:', error);
      }
    },

    updateCharts() {
      // Prevent updates if component is being destroyed or is still loading
      if (this.isLoading || this.isDestroyed || !this.$refs.incomeChart || !this.$refs.expenseChart) {
        return;
      }

      this.destroyCharts();

      // Use a longer timeout to ensure DOM is stable
      setTimeout(() => {
        // Double-check that refs are still available and component not destroyed
        if (!this.isDestroyed && this.$refs.incomeChart && this.$refs.expenseChart) {
          this.createCharts();
        }
      }, 200);
    },

    destroyCharts() {
      this.destroyIncomeChart();
      this.destroyExpenseChart();
    },

    destroyIncomeChart() {
      if (this.incomeChart) {
        try {
          // Stop any ongoing animations before destroying
          if (typeof this.incomeChart.stop === 'function') {
            this.incomeChart.stop();
          }
          this.incomeChart.destroy();
        } catch (error) {
          console.error('Error destroying income chart:', error);
        }
        this.incomeChart = null;
      }
    },

    destroyExpenseChart() {
      if (this.expenseChart) {
        try {
          // Stop any ongoing animations before destroying
          if (typeof this.expenseChart.stop === 'function') {
            this.expenseChart.stop();
          }
          this.expenseChart.destroy();
        } catch (error) {
          console.error('Error destroying expense chart:', error);
        }
        this.expenseChart = null;
      }
    },

    // Helper methods to get CSS variable values
    getCSSVariableValue(variableName) {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
    },

    getIncomeColors() {
      return [
        this.getCSSVariableValue('--chart-income-1'),
        this.getCSSVariableValue('--chart-income-2'),
        this.getCSSVariableValue('--chart-income-3'),
        this.getCSSVariableValue('--chart-income-4'),
        this.getCSSVariableValue('--chart-income-5'),
        this.getCSSVariableValue('--chart-income-6'),
        this.getCSSVariableValue('--chart-income-7'),
        this.getCSSVariableValue('--chart-income-8')
      ];
    },

    getExpenseColors() {
      return [
        this.getCSSVariableValue('--chart-expense-1'),
        this.getCSSVariableValue('--chart-expense-2'),
        this.getCSSVariableValue('--chart-expense-3'),
        this.getCSSVariableValue('--chart-expense-4'),
        this.getCSSVariableValue('--chart-expense-5'),
        this.getCSSVariableValue('--chart-expense-6'),
        this.getCSSVariableValue('--chart-expense-7'),
        this.getCSSVariableValue('--chart-expense-8')
      ];
    }
  }
};
</script>

<style scoped>
.category-charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.chart-card {
  padding: 0;
  width: 100%;
}

.chart-header {
  padding: 20px 20px 0 20px;
  text-align: center;
}

.chart-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.chart-wrapper {
  position: relative;
  height: 350px;
  padding: 20px;
}

.pie-chart {
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
  font-size: 14px;
}

.no-data-state {
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .category-charts-container {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 16px;
  }

  .chart-wrapper {
    height: 300px;
    padding: 16px;
  }

  .chart-header {
    padding: 16px 16px 0 16px;
  }

  .chart-header h3 {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .chart-wrapper {
    height: 280px;
    padding: 12px;
  }
}
</style>
