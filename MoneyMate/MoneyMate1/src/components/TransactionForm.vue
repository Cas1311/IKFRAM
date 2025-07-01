<template>
  <div class="transaction-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="amount">Amount</label>
        <input type="number" id="amount" v-model="transaction.amount" required />
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" v-model="transaction.category" required>
          <option value="">Select category</option>
          <option v-for="category in categories" :key="category.value" :value="category.value">
            {{ category.label }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="type">Type</label>
        <select id="type" v-model="transaction.type" required>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div class="form-group">
        <label for="date">Date</label>
        <input type="date" id="date" v-model="transaction.date" required />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <input type="text" id="description" v-model="transaction.description" />
      </div>

      <BaseButton type="submit" mode="primary">Add Transaction</BaseButton>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'

const emit = defineEmits(['submit'])

const transaction = ref({
  amount: '',
  category: '',
  type: 'expense',
  date: new Date().toISOString().split('T')[0],
  description: '',
})

const handleSubmit = () => {
  emit('submit', { ...transaction.value })
  transaction.value = {
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    description: '',
  }
}
</script>

<style scoped>
.transaction-form {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] .transaction-form {
  background: var(--bg-secondary);
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
}

input,
select {
  width: 100%;
  max-width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--bg-secondary);
  border-radius: 4px;
  font-size: 1rem;
  color: var(--text-primary);
  background: white;
  box-sizing: border-box;
}

[data-theme='dark'] input,
[data-theme='dark'] select {
  background: var(--bg-secondary);
  border-color: var(--bg-primary);
  color: var(--text-primary);
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

[data-theme='dark'] input:focus,
[data-theme='dark'] select:focus {
  box-shadow: 0 0 0 2px rgba(102, 187, 106, 0.2);
}

.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.button.primary {
  background: var(--primary-color);
  color: white;
}

.button.secondary {
  background: var(--secondary-color);
  color: white;
}

.button.danger {
  background: var(--error-color);
  color: white;
}

.button:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .transaction-form {
    padding: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }
}
</style>
