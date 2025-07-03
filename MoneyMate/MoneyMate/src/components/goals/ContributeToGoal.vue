<template>
  <div class="contribute-modal" v-if="show" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Contribute to {{ goal.name }}</h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>

      <div class="modal-body">
        <div class="goal-info">
          <div class="progress-info">
            <p><strong>Current:</strong> ${{ goal.currentAmount.toLocaleString() }}</p>
            <p><strong>Target:</strong> ${{ goal.targetAmount.toLocaleString() }}</p>
            <p><strong>Remaining:</strong> ${{ remainingAmount.toLocaleString() }}</p>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>

        <div class="balance-info">
          <p><strong>Available Balance:</strong> ${{ availableBalance.toLocaleString() }}</p>
        </div>

        <form @submit.prevent="contribute">
          <div class="form-group">
            <label for="amount">Contribution Amount</label>
            <div class="amount-input">
              <!-- <span class="currency">$</span> -->
              <input type="number" id="amount" v-model="amount" :max="maxContribution" min="1" step="0.01" required
                placeholder="0.00" />
            </div>
            <small v-if="maxContribution < availableBalance" class="help-text">
              Maximum: ${{ maxContribution.toLocaleString() }} (to complete goal)
            </small>
            <small v-else class="help-text">
              Maximum: ${{ availableBalance.toLocaleString() }} (available balance)
            </small>
          </div>

          <div class="form-group">
            <label for="description">Description (optional)</label>
            <input type="text" id="description" v-model="description"
              placeholder="e.g., Monthly savings contribution" />
          </div>

          <div class="form-actions">
            <base-button type="button" mode="outline" @click="$emit('close')">Cancel</base-button>
            <base-button type="submit" :disabled="!canContribute || loading">
              {{ loading ? 'Contributing...' : 'Contribute' }}
            </base-button>
          </div>
        </form>

        <div v-if="error" class="error">
          <p>{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContributeToGoal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    goal: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'contributed'],
  data() {
    return {
      amount: null,
      description: '',
      loading: false,
      error: null
    };
  },
  computed: {
    availableBalance() {
      return this.$store.getters['transactions/accountBalance'];
    },
    progressPercentage() {
      return Math.round((this.goal.currentAmount / this.goal.targetAmount) * 100);
    },
    remainingAmount() {
      return Math.max(0, this.goal.targetAmount - this.goal.currentAmount);
    },
    maxContribution() {
      return Math.min(this.availableBalance, this.remainingAmount);
    },
    canContribute() {
      return this.amount > 0 &&
        this.amount <= this.maxContribution &&
        this.availableBalance >= this.amount;
    }
  },
  methods: {
    async contribute() {
      if (!this.canContribute) return;

      this.loading = true;
      this.error = null;

      try {
        await this.$store.dispatch('goals/contributeToGoal', {
          goalId: this.goal.id,
          amount: Number(this.amount),
          description: this.description
        });

        this.$emit('contributed');
        this.$emit('close');
        this.resetForm();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.amount = null;
      this.description = '';
      this.error = null;
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.resetForm();
      }
    }
  }
};
</script>

<style scoped>
.contribute-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f0f0f0;
}

.modal-body {
  padding: 1.5rem;
}

.goal-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.progress-info {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.progress-info p {
  margin: 0;
  font-size: 0.9rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff 0%, #0056b3 100%);
  transition: width 0.3s ease;
}

.balance-info {
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #007bff;
}

.balance-info p {
  margin: 0;
  color: #1976d2;
  font-weight: 600;
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

.amount-input {
  position: relative;
  display: flex;
  align-items: center;
}

.currency {
  position: absolute;
  left: 1rem;
  color: #666;
  font-weight: 600;
  z-index: 1;
}

.amount-input input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.help-text {
  color: #666;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.error p {
  margin: 0;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .progress-info {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
