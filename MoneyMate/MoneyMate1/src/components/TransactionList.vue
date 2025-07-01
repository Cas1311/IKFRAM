<template>
  <div class="transaction-list">
    <div class="filters">
      <div class="filter-group">
        <label for="type-filter">Type:</label>
        <select id="type-filter" v-model="filters.type">
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="category-filter">Category:</label>
        <select id="category-filter" v-model="filters.category">
          <option value="">All</option>
          <option v-for="category in categories" :key="category.value" :value="category.value">
            {{ category.label }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="date-filter">Date:</label>
        <input
          type="date"
          id="date-filter"
          v-model="filters.date"
        />
      </div>

      <div class="filter-group">
        <label for="sort-by">Sort by:</label>
        <select id="sort-by" v-model="filters.sortBy">
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="description">Description</option>
          <option value="category">Category</option>
        </select>
      </div>

      <div class="filter-group">
        <button @click="toggleSortDirection">
          Sort: {{ filters.sortDirection === 'desc' ? '▼' : '▲' }}
        </button>
      </div>
    </div>

    <div class="balance-summary">
      <div class="balance-item">
        <span class="label">Total Income:</span>
        <span class="value income">{{ formatCurrency(totalIncome) }}</span>
      </div>
      <div class="balance-item">
        <span class="label">Total Expenses:</span>
        <span class="value expense">{{ formatCurrency(totalExpenses) }}</span>
      </div>
      <div class="balance-item">
        <span class="label">Balance:</span>
        <span class="value balance" :class="{ positive: balance >= 0, negative: balance < 0 }">
          {{ formatCurrency(balance) }}
        </span>
      </div>
      <div class="balance-item">
        <span class="label">Monthly Average:</span>
        <span class="value" :class="{ positive: monthlyAverage >= 0, negative: monthlyAverage < 0 }">
          {{ formatCurrency(monthlyAverage) }}
        </span>
      </div>
    </div>

    <div class="transactions">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in filteredTransactions" :key="transaction.id">
            <td>{{ formatDate(transaction.date) }}</td>
            <td>{{ transaction.description }}</td>
            <td>{{ getCategoryLabel(transaction.category) }}</td>
            <td>
              <span :class="transaction.type">{{ transaction.type }}</span>
            </td>
            <td>
              <span :class="transaction.type">
                {{ formatCurrency(transaction.amount) }}
              </span>
            </td>
            <td>
              <button @click="editTransaction(transaction)" class="action-btn edit">
                Edit
              </button>
              <button @click="deleteTransaction(transaction.id)" class="action-btn delete">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  },
  categories: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const filters = ref({
  type: '',
  category: '',
  date: '',
  sortBy: 'date',
  sortDirection: 'desc'
})

const filteredTransactions = computed(() => {
  let result = props.transactions.filter(transaction => {
    const matchesType = !filters.value.type || transaction.type === filters.value.type
    const matchesCategory = !filters.value.category || transaction.category === filters.value.category
    const matchesDate = !filters.value.date || transaction.date === filters.value.date
    return matchesType && matchesCategory && matchesDate
  })

  // Sort transactions
  result = [...result].sort((a, b) => {
    const aValue = a[filters.value.sortBy]
    const bValue = b[filters.value.sortBy]
    
    if (filters.value.sortBy === 'date') {
      return filters.value.sortDirection === 'desc' 
        ? new Date(bValue) - new Date(aValue)
        : new Date(aValue) - new Date(bValue)
    } else if (filters.value.sortBy === 'amount') {
      return filters.value.sortDirection === 'desc' 
        ? bValue - aValue
        : aValue - bValue
    } else {
      return filters.value.sortDirection === 'desc' 
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue)
    }
  })

  return result
})

const totalIncome = computed(() =>
  filteredTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
)

const totalExpenses = computed(() =>
  filteredTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
)

const balance = computed(() => totalIncome.value - totalExpenses.value)

const monthlyAverage = computed(() => {
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const transactionsThisMonth = filteredTransactions.value.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate >= firstDayOfMonth
  })
  
  const incomeThisMonth = transactionsThisMonth
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const expensesThisMonth = transactionsThisMonth
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  return incomeThisMonth - expensesThisMonth
})

const getCategoryLabel = (value) => {
  const category = props.categories.find(c => c.value === value)
  return category ? category.label : value
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const editTransaction = (transaction) => {
  emit('edit', transaction)
}

</script>

<style scoped>
.transaction-list {
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .transaction-list {
  background: var(--bg-secondary);
}

.filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  max-width: 150px;
}

.filter-group button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 100px;
}

.filter-group button:hover {
  opacity: 0.9;
}

.balance-summary {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  flex-wrap: wrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .balance-summary {
    flex-direction: column;
    gap: 1rem;
  }

  .balance-item {
    width: 100%;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .balance-summary {
    gap: 1rem;
  }
}

@media (min-width: 1024px) {
  .balance-summary {
    gap: 2rem;
  }
}

.balance-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  padding: 0.75rem;
  border-radius: 4px;
  background: var(--bg-primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.balance-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.balance-item label {
  color: var(--text-secondary);
  font-weight: 500;
}

.balance-item .value {
  font-weight: 600;
  font-size: 1.1rem;
}

.positive {
  color: var(--primary-color);
}

.negative {
  color: var(--error-color);
}

.transactions {
  margin-top: 1.5rem;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
}

th {
  background-color: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-secondary);
}

[data-theme="dark"] th {
  background-color: var(--bg-primary);
}

@media (max-width: 768px) {
  th, td {
    padding: 0.5rem;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  th, td {
    padding: 0.75rem;
  }
}

@media (min-width: 1024px) {
  th, td {
    padding: 1rem;
  }
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 80px;
}

.edit {
  background: var(--primary-color);
  color: white;
}

.delete {
  background: var(--error-color);
  color: white;
}

.action-btn:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .transaction-list {
    padding: 1rem;
  }
  
  .filters {
    gap: 0.5rem;
  }
}
</style>
