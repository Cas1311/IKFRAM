<template>
  <section><goal-filter @filter-changed="updateFilters" :result-count="filteredGoals.length"></goal-filter></section>
  <section>
    <base-card>
    <div class="controls">
    <base-button mode="outline">Refresh</base-button>
    <base-button link to="/goals/add">Add a Goal</base-button>
    </div>
    <div v-if="hasGoals">
      <goal-item class="goal-item" v-for="goal in filteredGoals" :key="goal.id" :id="goal.id" :name="goal.name" :target="goal.targetAmount" :current="goal.currentAmount" :date="goal.dueDate" :complete="goal.isCompleted" :starred="goal.starred"></goal-item>
    </div>
    <h3 v-else>No goals available. Please add a goal.</h3>
    </base-card>
  </section>
</template>

<script>
import GoalItem from '@/components/goals/GoalItem.vue';
import GoalFilter from '@/components/goals/GoalFilter.vue';

export default {
  components: {
    GoalItem,
    GoalFilter,
  },
  name: 'GoalsView',
  data() {
    return {
      activeFilters: {
        searchText: '',
        minAmount: null,
        maxAmount: null,
        minPercentage: null,
        maxPercentage: null,
        startDate: '',
        endDate: '',
        status: '',
        sortBy: '',
        sortOrder: 'asc'
      }
    };
  },
  computed: {
    allGoals() {
      return this.$store.getters['goals/goals'];
    },
    filteredGoals() {
      let goals = [...this.allGoals];

      // Apply filters
      if (this.activeFilters.searchText) {
        goals = goals.filter(goal =>
          goal.name.toLowerCase().includes(this.activeFilters.searchText.toLowerCase())
        );
      }

      if (this.activeFilters.minAmount !== null) {
        goals = goals.filter(goal => goal.targetAmount >= this.activeFilters.minAmount);
      }

      if (this.activeFilters.maxAmount !== null) {
        goals = goals.filter(goal => goal.targetAmount <= this.activeFilters.maxAmount);
      }

      if (this.activeFilters.minPercentage !== null) {
        goals = goals.filter(goal => {
          const percentage = (goal.currentAmount / goal.targetAmount) * 100;
          return percentage >= this.activeFilters.minPercentage;
        });
      }

      if (this.activeFilters.maxPercentage !== null) {
        goals = goals.filter(goal => {
          const percentage = (goal.currentAmount / goal.targetAmount) * 100;
          return percentage <= this.activeFilters.maxPercentage;
        });
      }

      if (this.activeFilters.startDate) {
        goals = goals.filter(goal => new Date(goal.dueDate) >= new Date(this.activeFilters.startDate));
      }

      if (this.activeFilters.endDate) {
        goals = goals.filter(goal => new Date(goal.dueDate) <= new Date(this.activeFilters.endDate));
      }

      if (this.activeFilters.status) {
        goals = goals.filter(goal => {
          const percentage = (goal.currentAmount / goal.targetAmount) * 100;
          const isOverdue = new Date(goal.dueDate) < new Date();

          switch (this.activeFilters.status) {
            case 'completed':
              return goal.isCompleted || percentage >= 100;
            case 'in-progress':
              return !goal.isCompleted && percentage < 100 && !isOverdue;
            case 'overdue':
              return !goal.isCompleted && percentage < 100 && isOverdue;
            default:
              return true;
          }
        });
      }

      // Apply sorting
      if (this.activeFilters.sortBy) {
        goals.sort((a, b) => {
          let valueA, valueB;

          switch (this.activeFilters.sortBy) {
            case 'name':
              valueA = a.name.toLowerCase();
              valueB = b.name.toLowerCase();
              break;
            case 'dueDate':
              valueA = new Date(a.dueDate);
              valueB = new Date(b.dueDate);
              break;
            case 'percentage':
              valueA = (a.currentAmount / a.targetAmount) * 100;
              valueB = (b.currentAmount / b.targetAmount) * 100;
              break;
            case 'targetAmount':
              valueA = a.targetAmount;
              valueB = b.targetAmount;
              break;
            case 'currentAmount':
              valueA = a.currentAmount;
              valueB = b.currentAmount;
              break;
            default:
              return 0;
          }

          if (valueA < valueB) {
            return this.activeFilters.sortOrder === 'asc' ? -1 : 1;
          }
          if (valueA > valueB) {
            return this.activeFilters.sortOrder === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      return goals;
    },
    hasGoals() {
      return this.filteredGoals.length > 0;
    },
  },
  methods: {
    updateFilters(filters) {
      this.activeFilters = { ...filters };
    }
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}

.goal-item:hover {
  cursor: pointer;
  background-color: #f0f0f0;
  transition: 0.3s;
}
</style>
