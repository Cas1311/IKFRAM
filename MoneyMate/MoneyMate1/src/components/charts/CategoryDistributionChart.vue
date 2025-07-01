<template>
  <div class="chart-container">
    <Doughnut v-if="store.transactions.length > 0 && Object.keys(categoryData.value).length > 0" :data="chartData" :options="chartOptions" />
    <div v-else class="no-data">
      <p>No expenses found</p>
    </div>
  </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { computed, onMounted } from 'vue'
import { useTransactionsStore } from '../../stores/transactions'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const store = useTransactionsStore()

onMounted(() => {
  store.initialize()
})

const categoryData = computed(() => {
  const data = store.transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      if (!acc[transaction.category]) acc[transaction.category] = 0
      acc[transaction.category] += parseFloat(transaction.amount)
    }
    return acc
  }, {})
  return data
})

const chartData = computed(() => {
  const labels = Object.keys(categoryData.value)
  const data = labels.map(label => categoryData.value[label])

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          '#4CAF50',
          '#f44336',
          '#2196F3',
          '#FFC107',
          '#9C27B0',
          '#00BCD4',
          '#FF5722',
          '#795548',
          '#607D8B'
        ].slice(0, labels.length),
        hoverOffset: 4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Expense Distribution by Category'
    }
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  position: relative;
}

.no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--text-secondary);
  text-align: center;
}
</style>
