<template>
  <div class="page-container">
    <h1>Insights & Analysis</h1>
    <div class="insights-grid">
      <div class="insight-card">
        <h2>Spending Trends</h2>
        <div class="insight-content">
          <div class="placeholder-text">
            <p>Monthly spending trends analysis will be added here</p>
            <p>Shows how your spending patterns change over time</p>
          </div>
        </div>
      </div>

      <div class="insight-card">
        <h2>Category Analysis</h2>
        <div class="insight-content">
          <div class="placeholder-text">
            <p>Detailed analysis of spending by category</p>
            <p>Identifies areas where you can potentially save</p>
          </div>
        </div>
      </div>

      <div class="insight-card">
        <h2>Income vs Expenses</h2>
        <div class="insight-content">
          <div class="placeholder-text">
            <p>Detailed breakdown of income vs expenses</p>
            <p>Shows your monthly balance and savings rate</p>
          </div>
        </div>
      </div>

      <div class="insight-card">
        <h2>Future Projections</h2>
        <div class="insight-content">
          <div class="placeholder-text">
            <p>Based on current trends, projects future finances</p>
            <p>Helps with long-term financial planning</p>
          </div>
        </div>
      </div>
    </div>
    <RouterLink to="/" class="back-link">← Back to Dashboard</RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useTransactionsStore } from '../stores/transactions'

const store = useTransactionsStore()

// TODO: Implement actual insights calculations and visualizations
</script>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.insight-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .insight-card {
  background: var(--bg-secondary);
}

h2 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.insight-content {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 4px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

[data-theme="dark"] .insight-content {
  background: var(--bg-primary);
}

.placeholder-text {
  color: var(--text-secondary);
  text-align: center;
  font-style: italic;
}

.back-link {
  display: inline-block;
  color: var(--primary-color);
  text-decoration: none;
  margin-top: 2rem;
  font-size: 0.9rem;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
