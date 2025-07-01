<template>
  <div class="dashboard">
    <div class="container">
      <div class="header">
        <h1 class="dashboard-title">MoneyMate Dashboard</h1>
        <div class="mobile-filters">
          <button @click="showFilters = !showFilters" class="filter-toggle">
            <span class="icon">▼</span>
            <span class="text">Filters</span>
          </button>
        </div>
      </div>

      <div class="main-content">
        <RouterLink to="/add">
          <BaseButton mode="primary">
            <span class="icon">➕</span>
            <span class="text">Add Transaction</span>
          </BaseButton>
        </RouterLink>

        <TransactionList
          :transactions="transactions"
          :categories="categories"
          @edit="handleEditTransaction"
          @delete="handleDeleteTransaction"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTransactionsStore } from '../stores/transactions'
import TransactionList from '../components/TransactionList.vue'
import BaseButton from '../components/BaseButton.vue'
import { RouterLink } from 'vue-router'

const transactionsStore = useTransactionsStore()

const transactions = ref(transactionsStore.transactions)
const categories = ref(transactionsStore.categories)
const showFilters = ref(false)

const handleEditTransaction = (transaction) => {
  transactionsStore.editTransaction(transaction.id, transaction)
  transactions.value = transactionsStore.transactions
}

const handleDeleteTransaction = (id) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    transactionsStore.deleteTransaction(id)
    transactions.value = transactionsStore.transactions
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: var(--bg-primary);
  overflow: hidden;
  display: flex;
}

.dashboard-title {
  color: var(--text-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.mobile-filters {
  display: none;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.add-transaction-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: var(--text-primary);
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.add-transaction-btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
}

.add-transaction-btn .icon {
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
  }

  .mobile-filters {
    display: block;
  }

  .filter-toggle {
    background: var(--primary-color);
    color: var(--text-primary);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .filter-toggle:hover {
    background: var(--primary-dark);
  }

  .main-content {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr 1.5fr;
  }
}

@media (min-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
  }
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }
}
</style>
