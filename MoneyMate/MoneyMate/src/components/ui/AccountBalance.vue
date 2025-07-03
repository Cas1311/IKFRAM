<template>
  <base-card>
    <div class="account-balance">
      <div class="balance-header">
        <h1>Account Balance</h1>
        <span class="balance-date">As of {{ currentDate }}</span>
      </div>

      <div class="balance-amount-container">
        <h2>Total Amount of Money in Account</h2>
        <p class="balance-amount" :class="{ 'negative': totalMoney < 0 }">
          ${{ accountMoney.toFixed(2) }}
        </p>
      </div>

      <div class="balance-summary">
        <div class="summary-item income" @click="goToTransactions('income')">
          <div class="summary-icon">↗</div>
          <div class="summary-details">
            <span class="summary-label">This Month's Income</span>
            <span class="summary-amount">+${{ thisMonthIncome.toFixed(2) }}</span>
          </div>
        </div>

        <div class="summary-item expense" @click="goToTransactions('expense')">
          <div class="summary-icon">↙</div>
          <div class="summary-details">
            <span class="summary-label">This Month's Expenses</span>
            <span class="summary-amount">-${{ thisMonthExpenses.toFixed(2) }}</span>
          </div>
        </div>

        <div class="summary-item savings" @click="goToTransactions('goal')">
          <div class="summary-icon">💰</div>
          <div class="summary-details">
            <span class="summary-label">Total Savings</span>
            <span class="summary-amount">${{ totalSavings.toFixed(2) }}</span>
          </div>
        </div>

        <div class="summary-item available">
          <div class="summary-icon">💳</div>
          <div class="summary-details">
            <span class="summary-label">Available to Spend</span>
            <span class="summary-amount">${{ accountBalance.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="balance-actions">
        <base-button mode="outline" link to="/transactions">View All</base-button>
        <base-button link to="/transactions/add">Add Transaction</base-button>
      </div>
    </div>
  </base-card>
</template>

<script>
export default {
  name: 'AccountBalance',
  computed: {
    accountBalance() {
      return this.$store.getters['transactions/accountBalance'];
    },
    totalIncome() {
      return this.$store.getters['transactions/totalIncome'];
    },
    totalExpenses() {
      return this.$store.getters['transactions/totalExpenses'];
    },
    totalSavings() {
      return this.$store.getters['transactions/totalSavings'];
    },
    thisMonthIncome() {
      return this.$store.getters['transactions/thisMonthIncome'];
    },
    thisMonthExpenses() {
      return this.$store.getters['transactions/thisMonthExpenses'];
    },
    totalMoney() {
      return this.totalIncome;
    },
    accountMoney() {
      return this.accountBalance + this.totalSavings;
    },
    currentDate() {
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    netIncome() {
      return this.totalIncome - this.totalExpenses;
    },
    showBalanceChange() {
      return this.netIncome !== 0;
    },
    balanceChangeText() {
      const amount = Math.abs(this.netIncome);
      const sign = this.netIncome >= 0 ? '+' : '-';
      return `${sign}$${amount.toFixed(2)} this period`;
    },
    balanceChangeClass() {
      return {
        'positive': this.netIncome > 0,
        'negative': this.netIncome < 0
      };
    }
  },
  methods: {
    goToTransactions(type) {
      // Get current month in YYYY-MM format for filtering
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      // Navigate to transactions page with filter applied for current month
      this.$router.push({
        path: '/transactions',
        query: {
          type: type,
          month: currentMonth
        }
      });
    }
  }
};
</script>

<style scoped>
.account-balance {
  text-align: center;
}

.balance-header {
  margin-bottom: 1.5rem;
}

.balance-header h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.balance-date {
  color: #666;
  font-size: 0.9rem;
}

.balance-amount-container {
  margin-bottom: 2rem;
}

.balance-amount {
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
  color: #3a0061;
  transition: color 0.3s ease;
}

.balance-amount.negative {
  color: #dc3545;
}

.balance-change {
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  background: #f8f9fa;
}

.balance-change.positive {
  color: #28a745;
  background: #d4edda;
}

.balance-change.negative {
  color: #dc3545;
  background: #f8d7da;
}

.balance-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.summary-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.summary-item.income {
  border-left: 4px solid #28a745;
}

.summary-item.expense {
  border-left: 4px solid #dc3545;
}

.summary-item.savings {
  border-left: 4px solid #007bff;
}

.summary-item.available {
  border-left: 4px solid #6f42c1;
}

.summary-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.summary-item.income .summary-icon {
  background: #d4edda;
  color: #28a745;
}

.summary-item.expense .summary-icon {
  background: #f8d7da;
  color: #dc3545;
}

.summary-item.savings .summary-icon {
  background: #cce5ff;
  color: #007bff;
}

.summary-item.available .summary-icon {
  background: #e2d9f3;
  color: #6f42c1;
}

.summary-details {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.summary-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.summary-amount {
  font-size: 1.1rem;
  font-weight: bold;
}

.summary-item.income .summary-amount {
  color: #28a745;
}

.summary-item.expense .summary-amount {
  color: #dc3545;
}

.summary-item.savings .summary-amount {
  color: #007bff;
}

.summary-item.available .summary-amount {
  color: #6f42c1;
}

.balance-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .balance-amount {
    font-size: 2.5rem;
  }

  .balance-summary {
    grid-template-columns: 1fr 1fr;
  }

  .balance-actions {
    flex-direction: column;
  }

  .summary-item {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .balance-amount {
    font-size: 2rem;
  }

  .balance-header h2 {
    font-size: 1.25rem;
  }

  .balance-summary {
    grid-template-columns: 1fr;
  }
}
</style>
