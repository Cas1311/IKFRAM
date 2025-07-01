<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="date-navigation">
        <button @click="previousMonth" class="nav-btn" :disabled="isCurrentMonth">
          <font-awesome-icon icon="chevron-left" />
        </button>
        <h2>{{ currentMonthName }} {{ currentYear }}</h2>
        <button @click="nextMonth" class="nav-btn">
          <font-awesome-icon icon="chevron-right" />
        </button>
      </div>
    </header>

    <div class="summary-cards">
      <SummaryCard
        title="Saldo"
        :value="totalBalance"
        type="balance"
        icon="wallet"
      />
      <SummaryCard
        title="Inkomsten"
        :value="monthlySummary.income"
        type="income"
        icon="arrow-down"
      />
      <SummaryCard
        title="Uitgaven"
        :value="monthlySummary.expenses"
        type="expense"
        icon="arrow-up"
      />
      <SummaryCard
        title="Bespaard"
        :value="monthlySummary.income - monthlySummary.expenses"
        type="savings"
        icon="piggy-bank"
      />
    </div>

    <div class="dashboard-grid">
      <div class="recent-transactions">
        <div class="section-header">
          <h3>Recente transacties</h3>
          <router-link to="/transactions" class="btn-link">Bekijk alles</router-link>
        </div>
        <Card>
          <template v-if="recentTransactions.length > 0">
            <TransactionList :transactions="recentTransactions" />
          </template>
          <template v-else>
            <p class="empty-state">Nog geen transacties deze maand</p>
          </template>
        </Card>
      </div>

      <div class="spending-by-category">
        <h3>Uitgaven per categorie</h3>
        <Card>
          <CategorySpendingChart :transactions="monthlyTransactions" />
        </Card>
      </div>

      <div class="monthly-trends">
        <h3>Maandelijkse trend</h3>
        <Card>
          <MonthlyTrendsChart :transactions="yearlyTransactions" />
        </Card>
      </div>

      <div class="goals-preview">
        <div class="section-header">
          <h3>Actieve spaardoelen</h3>
          <router-link to="/goals" class="btn-link">Bekijk alles</router-link>
        </div>
        <Card>
          <template v-if="activeGoals.length > 0">
            <GoalList :goals="activeGoals" />
          </template>
          <template v-else>
            <p class="empty-state">Nog geen actieve spaardoelen</p>
            <router-link to="/goals/new" class="btn btn-primary">
              Spaardoel toevoegen
            </router-link>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { format, subMonths, addMonths } from 'date-fns';
import { nl } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import SummaryCard from '@/components/ui/SummaryCard.vue';
import Card from '@/components/ui/Card.vue';
import TransactionList from '@/components/transactions/TransactionList.vue';
import CategorySpendingChart from '@/components/charts/CategorySpendingChart.vue';
import MonthlyTrendsChart from '@/components/charts/MonthlyTrendsChart.vue';
import GoalList from '@/components/goals/GoalList.vue';

export default {
  name: 'DashboardView',
  components: {
    SummaryCard,
    Card,
    TransactionList,
    CategorySpendingChart,
    MonthlyTrendsChart,
    GoalList,
    FontAwesomeIcon
  },
  setup() {
    const store = useStore();
    const isLoading = ref(true);
    
    // Get current month and year from store
    const currentMonth = computed(() => store.state.currentMonth);
    const currentYear = computed(() => store.state.currentYear);
    
    // Format month name for display
    const currentMonthName = computed(() => {
      return format(new Date(currentYear.value, currentMonth.value - 1), 'MMMM', { locale: nl });
    });
    
    // Check if current month is the actual current month
    const isCurrentMonth = computed(() => {
      const now = new Date();
      return currentMonth.value === now.getMonth() + 1 && 
             currentYear.value === now.getFullYear();
    });
    
    // Get transactions and summaries from store
    const monthlyTransactions = computed(() => 
      store.getters['transactions/transactionsByMonth'](currentYear.value, currentMonth.value)
    );
    
    const yearlyTransactions = computed(() => 
      store.getters['transactions/transactionsByYear'](currentYear.value)
    );
    
    const recentTransactions = computed(() => 
      monthlyTransactions.value
        .slice(0, 5) // Show only the 5 most recent
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    );
    
    const monthlySummary = computed(() => 
      store.getters['transactions/monthlySummary'](currentYear.value, currentMonth.value)
    );
    
    const totalBalance = computed(() => store.getters['transactions/totalBalance']);
    const activeGoals = computed(() => store.getters['goals/activeGoals']);
    
    // Navigation methods
    const previousMonth = () => {
      const date = new Date(currentYear.value, currentMonth.value - 1, 1);
      const prevDate = subMonths(date, 1);
      
      store.commit('setCurrentMonth', prevDate.getMonth() + 1);
      store.commit('setCurrentYear', prevDate.getFullYear());
      fetchData();
    };
    
    const nextMonth = () => {
      const date = new Date(currentYear.value, currentMonth.value - 1, 1);
      const nextDate = addMonths(date, 1);
      
      // Don't go beyond current month
      const now = new Date();
      if (nextDate > now && isCurrentMonth.value) return;
      
      store.commit('setCurrentMonth', nextDate.getMonth() + 1);
      store.commit('setCurrentYear', nextDate.getFullYear());
      fetchData();
    };
    
    // Fetch data from store
    const fetchData = async () => {
      isLoading.value = true;
      try {
        await store.dispatch('transactions/fetchTransactions');
        await store.dispatch('goals/fetchGoals');
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        isLoading.value = false;
      }
    };
    
    onMounted(() => {
      fetchData();
    });
    
    return {
      currentMonthName,
      currentYear,
      isCurrentMonth,
      monthlyTransactions,
      yearlyTransactions,
      recentTransactions,
      monthlySummary,
      totalBalance,
      activeGoals,
      previousMonth,
      nextMonth
    };
  }
};
</script>

<style scoped>
.dashboard {
  padding: 1.5rem;
  max-width: 1440px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.date-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  background: var(--color-background-mute);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background: var(--color-border);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.recent-transactions,
.spending-by-category,
.monthly-trends,
.goals-preview {
  grid-column: span 12;
}

@media (min-width: 992px) {
  .recent-transactions,
  .goals-preview {
    grid-column: span 6;
  }
  
  .spending-by-category,
  .monthly-trends {
    grid-column: span 12;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.btn-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-link:hover {
  text-decoration: underline;
}

.empty-state {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 2rem 0;
  margin: 0;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}
</style>
