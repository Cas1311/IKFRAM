<template>
  <section v-if="transaction">
    <base-card class="detail-card">
      <div class="transaction-header">
        <h1>{{ transaction.title }}</h1>
        <div class="actions">
          <base-button mode="outline" @click="toggleEdit">
            {{ isEditing ? 'Cancel' : 'Edit Transaction' }}
          </base-button>
          <base-button @click="deleteTransaction" mode="outline">Delete Transaction</base-button>
          <base-button mode="flat" @click="goBack">Back</base-button>
        </div>
      </div>

      <!-- View Mode -->
      <div v-if="!isEditing" class="transaction-details">
        <div class="detail-section">
          <h3>Transaction Information</h3>
          <div class="details-grid">
            <div class="detail-item">
              <h4>Amount</h4>
              <p class="amount" :class="transaction.type">
                {{ transaction.type === 'expense' ? '-' : '+' }}${{ transaction.amount.toLocaleString() }}
              </p>
            </div>
            <div class="detail-item">
              <h4>Type</h4>
              <p class="type-badge" :class="transaction.type">{{ formatType(transaction.type) }}</p>
            </div>
            <div class="detail-item">
              <h4>Date</h4>
              <p>{{ formattedDate }}</p>
            </div>
            <div class="detail-item">
              <h4>Category</h4>
              <p>{{ transaction.category || 'Uncategorized' }}</p>
            </div>
          </div>
        </div>

        <div v-if="transaction.description" class="detail-section">
          <h3>Description</h3>
          <p class="description">{{ transaction.description }}</p>
        </div>

        <div v-if="transaction.goalId && relatedGoal" class="detail-section">
          <h3>Related Goal</h3>
          <goal-item class="goal-item goal-preview" :id="relatedGoal.id" :name="relatedGoal.name"
            :target="relatedGoal.targetAmount" :current="relatedGoal.currentAmount" :date="relatedGoal.dueDate"
            :complete="relatedGoal.isCompleted" :starred="relatedGoal.starred">
          </goal-item>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-else class="edit-form">
        <h3>Edit Transaction</h3>
        <form @submit.prevent="saveChanges">
          <div class="form-group">
            <label for="title">Title</label>
            <input id="title" v-model="editedTransaction.title" type="text" required
              placeholder="Enter transaction title" />
          </div>

          <div class="form-group">
            <label for="amount">Amount</label>
            <input id="amount" v-model.number="editedTransaction.amount" type="number" required min="0" step="0.01"
              placeholder="Enter amount" />
          </div>

          <div class="form-group">
            <label for="type">Type</label>
            <select id="type" v-model="editedTransaction.type" required>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="goal">Goal Contribution</option>
            </select>
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <input id="category" v-model="editedTransaction.category" type="text"
              placeholder="Enter category (optional)" />
          </div>

          <div class="form-group">
            <label for="date">Date</label>
            <input id="date" v-model="editedTransaction.date" type="date" required />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="editedTransaction.description"
              placeholder="Enter description (optional)" rows="3"></textarea>
          </div>

          <div class="form-actions">
            <base-button type="button" mode="outline" @click="cancelEdit">Cancel</base-button>
            <base-button type="submit" :disabled="loading">
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </base-button>
          </div>
        </form>
      </div>
    </base-card>
  </section>

  <section v-else>
    <base-card class="detail-card">
      <h1>Transaction Not Found</h1>
      <p>The transaction you're looking for doesn't exist.</p>
      <base-button @click="goBack">Back</base-button>
    </base-card>
  </section>
</template>

<script>
import GoalItem from '@/components/goals/GoalItem.vue';
export default {
  components: {
    GoalItem
  },

  name: 'TransactionDetailView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isEditing: false,
      loading: false,
      editedTransaction: {
        title: '',
        amount: 0,
        type: 'expense',
        category: '',
        date: '',
        description: ''
      }
    };
  },
  computed: {
    transaction() {
      const transactions = this.$store.getters['transactions/transactions'];
      return transactions.find(transaction => transaction.id === this.id);
    },
    relatedGoal() {
      if (!this.transaction || !this.transaction.goalId) return null;
      const goals = this.$store.getters['goals/goals'];
      return goals.find(goal => goal.id === this.transaction.goalId);
    },
    formattedDate() {
      if (!this.transaction) return '';
      return new Date(this.transaction.date || this.transaction.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  methods: {
    formatType(type) {
      switch (type) {
        case 'income': return 'Income';
        case 'expense': return 'Expense';
        case 'goal': return 'Goal Contribution';
        default: return type;
      }
    },
    toggleEdit() {
      if (this.isEditing) {
        this.cancelEdit();
      } else {
        this.startEdit();
      }
    },
    startEdit() {
      this.editedTransaction = {
        title: this.transaction.title || '',
        amount: this.transaction.amount || 0,
        type: this.transaction.type || 'expense',
        category: this.transaction.category || '',
        date: this.transaction.date || this.transaction.timestamp?.split('T')[0] || '',
        description: this.transaction.description || ''
      };
      this.isEditing = true;
    },
    cancelEdit() {
      this.isEditing = false;
      this.editedTransaction = {
        title: '',
        amount: 0,
        type: 'expense',
        category: '',
        date: '',
        description: ''
      };
    },
    async saveChanges() {
      this.loading = true;
      try {
        await this.$store.dispatch('transactions/updateTransaction', {
          id: this.id,
          updates: this.editedTransaction
        });

        this.isEditing = false;
        // Show success message or notification here if you have one
      } catch (error) {
        console.error('Error updating transaction:', error);
        alert('Error saving changes. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    async deleteTransaction() {
      if (confirm(`Are you sure you want to delete "${this.transaction.title}"?`)) {
        this.loading = true;
        try {
          await this.$store.dispatch('transactions/deleteTransaction', this.id);
          this.goBack();
        } catch (error) {
          console.error('Error deleting transaction:', error);
          alert('Error deleting transaction. Please try again.');
        } finally {
          this.loading = false;
        }
      }
    },
    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
.detail-card {
  max-width: 60rem !important;
  width: 95%;
  margin: 2rem auto;
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-primary);
  padding-bottom: 1rem;
}

.transaction-header h1 {
  margin: 0;
  color: var(--text-primary);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  border-bottom: 2px solid var(--border-light);
  padding-bottom: 0.5rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.detail-item h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail-item p {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.amount {
  font-size: 1.5rem;
  font-weight: bold;
}

.amount.income {
  color: var(--color-income);
}

.amount.expense {
  color: var(--color-expense);
}

.amount.goal {
  color: var(--color-info);
}

.type-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.type-badge.income {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-income);
}

.type-badge.expense {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-expense);
}

.type-badge.goal {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-info);
}

.description {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
  margin: 0;
  line-height: 1.6;
}

.edit-form {
  max-width: 600px;
}

.edit-form h3 {
  color: #333;
  margin: 0 0 1.5rem 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

/* Hide interactive elements in goal preview */
.goal-preview .goal-actions,
.goal-preview .actions {
  display: none !important;
}

.goal-preview {
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}


@media (max-width: 768px) {
  .transaction-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .actions {
    justify-content: space-between;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .transaction-header h1 {
    font-size: 1.5rem;
  }

  .amount {
    font-size: 1.25rem;
  }
}
</style>
