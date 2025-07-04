<template>
  <section class="insights-view">
    <div class="insights-header">
      <h1>Financial Insights</h1>
      <p>Track your income and expenses over time</p>
    </div>
    <bar-chart />
    <category-pie-charts />
  </section>
</template>

<script>
import BarChart from '@/components/insights/BarChart.vue';
import CategoryPieCharts from '@/components/insights/CategoryPieCharts.vue';

export default {
  name: 'InsightsView',
  components: {
    BarChart,
    CategoryPieCharts
  }
};
</script>

<style scoped>
.insights-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.insights-header {
  text-align: center;
  margin-bottom: 32px;
}

.insights-header h1 {
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.insights-header p {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

.insights-actions {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

@media (max-width: 768px) {
  .insights-view {
    padding: 16px;
  }

  .insights-header h1 {
    font-size: 1.75rem;
  }

  .insights-header p {
    font-size: 1rem;
  }
}
</style>
