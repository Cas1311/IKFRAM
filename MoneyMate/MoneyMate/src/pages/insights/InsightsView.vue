<template>
  <section class="insights-view">
    <div class="insights-header">
      <h1>Financial Insights</h1>
      <p>Track your income and expenses over time</p>


    </div>
    <bar-chart />
    <!-- Time Period Selector -->
    <div class="time-period-selector">
      <label for="timePeriod">Time Period:</label>
      <select id="timePeriod" v-model="selectedTimePeriod">
        <option :value="1">Last Month</option>
        <option :value="3">Last 3 Months</option>
        <option :value="6">Last 6 Months</option>
        <option :value="12">Last 12 Months</option>
      </select>
    </div>
    <category-pie-charts :time-period="selectedTimePeriod" />
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
  },
  data() {
    return {
      selectedTimePeriod: 12 // Default to 12 months
    };
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
  margin: 0 0 1.5rem 0;
}

.time-period-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.time-period-selector label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
}

.time-period-selector select {
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-period-selector select:focus {
  outline: none;
  border-color: var(--interactive-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.time-period-selector select:hover {
  border-color: var(--interactive-hover);
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

  .time-period-selector {
    flex-direction: column;
    gap: 0.5rem;
  }

  .time-period-selector select {
    width: 100%;
    max-width: 200px;
  }
}
</style>
