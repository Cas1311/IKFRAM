<template>
  <div class="chart-container">
    <Bar v-if="store.transactions.length > 0" :data="chartData" :options="chartOptions" />
    <div v-else class="no-data">
      <p>No transactions found</p>
    </div>
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { computed, onMounted } from 'vue'
import { useTransactionsStore } from '../../stores/transactions'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const store = useTransactionsStore()

onMounted(() => {
  store.initialize()
})

const chartData = computed(() => {
  if (!store.transactions || store.transactions.length === 0) {
    return {
      labels: [],
      datasets: []
    }
  }

  const monthlyData = store.transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date)
    const month = date.toLocaleString('default', { month: 'short' })
    const year = date.getFullYear()
    const key = `${month} ${year}`
    
    if (!acc.income[key]) acc.income[key] = 0
    if (!acc.expenses[key]) acc.expenses[key] = 0
    
    if (transaction.type === 'income') {
      acc.income[key] += parseFloat(transaction.amount)
    } else {
      acc.expenses[key] += parseFloat(transaction.amount)
    }
    
    return acc
  }, { income: {}, expenses: {} })

  const labels = Object.keys(monthlyData.income)
  const incomeData = labels.map(label => monthlyData.income[label])
  const expensesData = labels.map(label => monthlyData.expenses[label])

  return {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: '#4CAF50',
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: expensesData,
        backgroundColor: '#f44336',
        tension: 0.4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Monthly Income vs Expenses'
    }
  },
  scales: {
    y: {
      beginAtZero: true
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
