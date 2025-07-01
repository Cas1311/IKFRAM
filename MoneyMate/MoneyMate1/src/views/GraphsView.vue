<template>
  <h1>Graphs & Statistics</h1>
  <div class="page-container">
    <h1>Graphs & Statistics</h1>
    <div class="graphs-container">
      <div class="graph-card">
        <h2>Monthly Overview</h2>
        <!-- <MonthlyChart /> -->
      </div>

      <div class="graph-card">
        <h2>Expense Distribution by Category</h2>
        <div class="chart-placeholder"><!-- <CategoryDistributionChart /> -->will be here</div>
      </div>
    </div>
    <RouterLink to="/" class="back-link">← Back to Dashboard</RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue'
// import MonthlyChart from '../components/charts/MonthlyChart.vue'
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

.graphs-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.graph-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] .graph-card {
  background: var(--bg-secondary);
}

h2 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.chart-placeholder {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 4px;
  text-align: center;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder-text {
  color: var(--text-secondary);
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
