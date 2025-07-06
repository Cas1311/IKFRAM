<template>
  <div class="transaction-item" @click="navigateToDetail" :class="{ 'clickable': id }">
    <div class="transaction-header">
      <h3>{{ title || 'Sample Transaction' }}</h3>
      <span class="transaction-amount"
        :class="{ 'income': type === 'income', 'expense': type === 'expense', 'goal': type === 'goal' }">
        {{ type === 'expense' ? '-' : type === 'goal' ? '→' : '+' }}${{ amount || 100 }}
      </span>
    </div>
    <div class="transaction-details">
      <p class="transaction-date">{{ formattedDate }}</p>
      <p class="transaction-description">{{ description || '' }}</p>
      <p v-if="category" class="transaction-category">Category: {{ category }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransactionItem',
  props: {
    id: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: 'Sample Transaction'
    },
    amount: {
      type: Number,
      default: 100
    },
    type: {
      type: String,
      default: 'income', // 'income', 'expense', or 'goal'
      validator: value => ['income', 'expense', 'goal'].includes(value)
    },
    date: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: ''
    }
  },
  computed: {
    formattedDate() {
      if (!this.date) return 'July 2, 2025';

      try {
        const dateObj = new Date(this.date);
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return this.date;
      }
    }
  },
  methods: {
    navigateToDetail() {
      if (this.id) {
        this.$router.push(`/transactions/${this.id}`);
      }
    }
  }
}
</script>

<style scoped>
.transaction-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.transaction-item.clickable {
  cursor: pointer;
}

.transaction-item.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.transaction-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.2rem;
}

.transaction-amount {
  font-size: 1.25rem;
  font-weight: bold;
}

.transaction-amount.income {
  color: var(--color-income);
}

.transaction-amount.expense {
  color: var(--color-expense);
}

.transaction-amount.goal {
  color: var(--color-info);
}

.transaction-details {
  border-top: 1px solid var(--border-light);
  padding-top: 1rem;
}

.transaction-date {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
}

.transaction-description {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.transaction-category {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  font-style: italic;
}
</style>
