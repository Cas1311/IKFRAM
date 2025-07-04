<template>
  <!-- <section>
    <base-card>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <p>Here you can view your financial overview, recent transactions, and more.</p>
    </base-card>
  </section> -->

  <!-- Account Balance Section -->
  <section>
    <account-balance />
  </section>

  <!-- Starred Goal Section -->
  <section>
    <base-card>
      <div class="controls">
        <h2>Starred Goal</h2>
        <div class="goal-actions">
          <base-button mode="outline" link to="/goals">See all Goals</base-button>
          <base-button link to="/goals/add">Add a Goal</base-button>
        </div>
      </div>
      <goal-item class="goal-item" v-if="starredGoal" :id="starredGoal.id" :name="starredGoal.name"
        :target="starredGoal.targetAmount" :current="starredGoal.currentAmount" :date="starredGoal.dueDate"
        :complete="starredGoal.isCompleted" :starred="starredGoal.starred">
      </goal-item>
      <div v-else class="no-starred-goal">
        <p>No starred goal yet.</p>
        <base-button mode="outline" link to="/goals">Star a goal</base-button>
        <span>to display it here.</span>
      </div>
    </base-card>
  </section>

  <!-- Recent Transactions Section -->
  <section>
    <base-card>
      <div class="controls">
        <h2>Recent Transactions</h2>
        <base-button mode="outline" link to="/transactions">See all Transactions</base-button>
      </div>


      <div v-if="transactionsLoading" class="loading-transactions">
        <p>Loading recent transactions...</p>
      </div>
      <div v-else-if="hasRecentTransactions" class="recent-transactions">
        <transaction-item v-for="transaction in recentTransactions" :key="transaction.id" :id="transaction.id"
          :title="transaction.title" :amount="transaction.amount" :type="transaction.type" :date="transaction.date"
          :description="transaction.description" :category="transaction.category" />
      </div>
      <div v-else class="no-transactions">
        <p>No transactions yet.</p>
        <base-button mode="outline" link to="/transactions/add">Add your first transaction</base-button>
      </div>
    </base-card>
  </section>
</template>

<script>
import GoalItem from '@/components/goals/GoalItem.vue';
import AccountBalance from '@/components/ui/AccountBalance.vue';
import TransactionItem from '@/components/transactions/TransactionItem.vue';

export default {
  name: 'DashboardView',
  components: {
    GoalItem,
    AccountBalance,
    TransactionItem,
  },
  computed: {
    starredGoal() {
      return this.$store.getters['goals/starredGoal'];
    },
    recentTransactions() {
      return this.$store.getters['transactions/recentTransactions'];
    },
    hasRecentTransactions() {
      return this.recentTransactions && this.recentTransactions.length > 0;
    },
    transactionsLoading() {
      return this.$store.getters['transactions/loading'];
    }
  }
};
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.controls h2 {
  margin: 0;
  color: var(--text-primary);
}

.goal-actions {
  display: flex;
  gap: 0.5rem;
}

.goal-item {
  transition: all 0.3s ease;
}

.goal-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.no-starred-goal {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.no-starred-goal p {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.no-starred-goal span {
  margin-left: 0.5rem;
  color: var(--text-secondary);
}

.recent-transactions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no-transactions {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.no-transactions p {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.loading-transactions {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.loading-transactions p {
  margin: 0;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .goal-actions {
    flex-direction: column;
  }

  .no-starred-goal {
    padding: 1.5rem 1rem;
  }

  .no-transactions {
    padding: 1.5rem 1rem;
  }
}
</style>
