<template>
  <div class="page-container">
    <h1>Add Transaction</h1>
    <div class="transaction-form-container">
      <TransactionForm @transaction-added="handleTransactionAdded" />
    </div>
    <RouterLink to="/" class="back-link">← Back to Dashboard</RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import TransactionForm from '../components/TransactionForm.vue'

const handleTransactionAdded = () => {
  // Redirect back to dashboard after adding transaction
  window.location.href = '/'
}
</script>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.transaction-form-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .transaction-form-container {
  background: var(--bg-secondary);
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
