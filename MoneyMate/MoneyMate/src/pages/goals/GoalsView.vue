<template>
  <!-- <section>
    <base-card>
      <h1>Goals</h1>
      <p>Track and manage your savings goals. Set targets, monitor progress, and achieve your financial objectives.</p>
    </base-card>
  </section> -->

  <section>
    <base-card>
      <div class="controls">
        <h2>All Goals</h2>
        <div class="control-actions">
          <base-button mode="outline" @click="toggleFilters">
            {{ showFilters ? 'Hide' : 'Show' }} Filters
          </base-button>
          <base-button link to="/goals/add">Add a Goal</base-button>
        </div>
      </div>

      <!-- Filters -->
      <goal-filter v-if="showFilters" @filter-changed="updateFilters" :result-count="filteredGoals.length" />

      <!-- Goal Stats -->
      <div v-if="hasGoals" class="goal-stats">
        <div class="stat-item">
          <span class="stat-label">Showing:</span>
          <span class="stat-value">{{ filteredGoals.length }} of {{ totalGoals }} goals</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Completed:</span>
          <span class="stat-value completed">{{ completedGoalsCount }} goals</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Progress:</span>
          <span class="stat-value">{{ averageProgress.toFixed(1) }}% average</span>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <p>Loading goals...</p>
      </div>
      <div v-else-if="error" class="error">
        <p>Error loading goals: {{ error }}</p>
        <base-button @click="refreshGoals">Retry</base-button>
      </div>
      <div v-else-if="hasFilteredGoals" class="goals-list">
        <goal-item class="goal-item" v-for="goal in paginatedGoals" :key="goal.id" :id="goal.id || ''"
          :name="goal.name || 'Untitled Goal'" :target="goal.targetAmount || 0" :current="goal.currentAmount || 0"
          :date="goal.dueDate || ''" :complete="goal.isCompleted || false" :starred="goal.starred || false" />

        <!-- Pagination -->
        <base-pagination :current-page="currentPage" :total-items="filteredGoals.length" :page-size="pageSize"
          @page-changed="onPageChanged" @page-size-changed="onPageSizeChanged" />
      </div>
      <div v-else-if="allGoals.length > 0" class="no-filtered-goals">
        <h3>No goals match your filters</h3>
        <p>Try adjusting your search criteria or clear filters to see all goals.</p>
        <base-button mode="outline" @click="clearFilters">Clear Filters</base-button>
      </div>
      <div v-else class="no-goals">
        <h3>No goals yet</h3>
        <p>Start by creating your first savings goal!</p>
        <base-button link to="/goals/add">Add Goal</base-button>
      </div>
    </base-card>
  </section>
</template>

<script>
import GoalItem from '@/components/goals/GoalItem.vue';
import GoalFilter from '@/components/goals/GoalFilter.vue';
import BasePagination from '@/components/ui/Pagination.vue';

export default {
  components: {
    GoalItem,
    GoalFilter,
    BasePagination,
  },
  name: 'GoalsView',
  data() {
    return {
      showFilters: false,
      currentPage: 1,
      pageSize: 10,
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
    loading() {
      return this.$store.getters['goals/loading'];
    },
    error() {
      return this.$store.getters['goals/error'];
    },
    totalGoals() {
      return this.allGoals ? this.allGoals.length : 0;
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
          if (!goal.targetAmount || goal.targetAmount === 0) return false;
          const percentage = (goal.currentAmount / goal.targetAmount) * 100;
          return percentage >= this.activeFilters.minPercentage;
        });
      }

      if (this.activeFilters.maxPercentage !== null) {
        goals = goals.filter(goal => {
          if (!goal.targetAmount || goal.targetAmount === 0) return true; // Include goals with 0 target when filtering by max
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
          if (!goal.targetAmount || goal.targetAmount === 0) {
            return this.activeFilters.status === 'in-progress'; // Goals with 0 target are considered in-progress
          }

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
              if (!a.targetAmount || a.targetAmount === 0) {
                valueA = 0;
              } else {
                valueA = (a.currentAmount / a.targetAmount) * 100;
              }
              if (!b.targetAmount || b.targetAmount === 0) {
                valueB = 0;
              } else {
                valueB = (b.currentAmount / b.targetAmount) * 100;
              }
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
    paginatedGoals() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredGoals.slice(startIndex, endIndex);
    },
    hasGoals() {
      return this.allGoals && this.allGoals.length > 0;
    },
    hasFilteredGoals() {
      return this.filteredGoals && this.filteredGoals.length > 0;
    },
    completedGoalsCount() {
      if (!this.hasFilteredGoals) return 0;
      return this.filteredGoals.filter(goal => {
        if (!goal.targetAmount || goal.targetAmount === 0) return goal.isCompleted;
        return goal.isCompleted || (goal.currentAmount >= goal.targetAmount);
      }).length;
    },
    averageProgress() {
      if (!this.hasFilteredGoals) return 0;

      const validGoals = this.filteredGoals.filter(goal => goal.targetAmount && goal.targetAmount > 0);
      if (validGoals.length === 0) return 0;

      const totalProgress = validGoals.reduce((sum, goal) => {
        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
        return sum + progress;
      }, 0);

      return totalProgress / validGoals.length;
    }
  },
  methods: {
    updateFilters(filters) {
      this.activeFilters = { ...filters };
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    clearFilters() {
      this.activeFilters = {
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
      };
      this.currentPage = 1; // Reset to first page when clearing filters
    },
    refreshGoals() {
      this.$store.dispatch('goals/fetchGoals');
    },
    onPageChanged(page) {
      this.currentPage = page;
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onPageSizeChanged(newPageSize) {
      this.pageSize = newPageSize;
      this.currentPage = 1; // Reset to first page when changing page size
    }
  },
  watch: {
    // Reset to first page when filters change
    activeFilters: {
      handler() {
        this.currentPage = 1;
      },
      deep: true
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
  color: #333;
}

.control-actions {
  display: flex;
  gap: 0.5rem;
}

.goal-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border: 1px solid #e9ecef;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.stat-value.completed {
  color: #28a745;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no-goals,
.no-filtered-goals {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.no-goals h3,
.no-filtered-goals h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.no-goals p,
.no-filtered-goals p {
  margin: 0 0 1.5rem 0;
}

.loading {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.loading p {
  font-size: 1.1rem;
  margin: 0;
}

.error {
  text-align: center;
  padding: 3rem 1rem;
  color: #dc3545;
}

.error p {
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .control-actions {
    justify-content: space-between;
  }

  .goal-stats {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .stat-item {
    align-items: center;
  }
}

@media (max-width: 480px) {
  .control-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
