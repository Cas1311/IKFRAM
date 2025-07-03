<template>
  <div class="goal-item" :class="{ 'completed': complete }">
    <div class="goal-header">
      <h3 class="goal-title" @click="navigateToDetail">
        {{ name }}
        <span v-if="complete" class="completed-badge">✓ Completed</span>
      </h3>
      <div class="goal-actions">
        <button class="star-button" @click="toggleStar" :class="{ starred: starred }">
          {{ starred ? '★' : '☆' }}
        </button>
        <button class="delete-button" @click="deleteGoal" title="Delete goal">
          🗑️
        </button>
      </div>
    </div>
    <div class="goal-content" @click="navigateToDetail">
      <h4>${{ current }} / ${{ target }}</h4>
      <p>{{ date }}</p>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <p class="progress-text">{{ progressPercentage }}% complete</p>
    </div>
    <div class="actions">
      <base-button mode="outline" link :to="goalEditLink">Edit</base-button>
      <base-button @click="openContributeModal" v-if="!complete">Contribute</base-button>
    </div>

    <!-- Contribute Modal -->
    <contribute-to-goal :show="showContributeModal" :goal="goalData" @close="showContributeModal = false"
      @contributed="onContributed" />
  </div>
</template>

<script>
import ContributeToGoal from './ContributeToGoal.vue';

export default {
  name: 'GoalItem',
  components: {
    ContributeToGoal
  },
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    current: {
      type: Number,
      required: true
    },
    target: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    complete: {
      type: Boolean,
      required: false,
      default: false
    },
    starred: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      showContributeModal: false
    };
  },
  computed: {
    goalEditLink() {
      return `/goals/${this.id}/edit`;
    },
    goalDetailLink() {
      return `/goals/${this.id}`;
    },
    progressPercentage() {
      if (this.target === 0) return 0;
      const percentage = Math.round((this.current / this.target) * 100);
      return Math.min(percentage, 100); // Cap at 100%
    },
    goalData() {
      return {
        id: this.id,
        name: this.name,
        currentAmount: this.current,
        targetAmount: this.target,
        dueDate: this.date,
        isCompleted: this.complete,
        starred: this.starred
      };
    }
  },
  methods: {
    deleteGoal() {
      if (confirm(`Are you sure you want to delete "${this.name}"?`)) {
        this.$store.dispatch('goals/deleteGoal', this.id);
      }
    },
    toggleStar() {
      this.$store.dispatch('goals/toggleStarGoal', this.id);
    },
    navigateToDetail() {
      this.$router.push(this.goalDetailLink);
    },
    openContributeModal() {
      this.showContributeModal = true;
    },
    onContributed() {
      // Refresh goals data after contribution
      this.$store.dispatch('goals/fetchGoals');
      this.$store.dispatch('transactions/fetchTransactions');
    }
  }
};
</script>

<style scoped>
.goal-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.goal-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.goal-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.goal-title {
  margin: 0;
  flex: 1;
  cursor: pointer;
  transition: color 0.2s ease;
}

.goal-title:hover {
  color: #3a0061;
}

.goal-content {
  cursor: pointer;
  margin-bottom: 1rem;
}

.goal-content:hover {
  opacity: 0.8;
}

.star-button,
.delete-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  color: #ccc;
  transition: color 0.2s ease;
}

.star-button:hover {
  color: #ffd700;
}

.star-button.starred {
  color: #ffd700;
}

.delete-button:hover {
  color: #dc3545;
}

h3 {
  font-size: 1.5rem;
}

h3,
h4 {
  margin: 0.5rem 0;
}

.completed-badge {
  display: inline-block;
  background: #28a745;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: normal;
  margin-left: 0.5rem;
}

.completed {
  border-left: 4px solid #28a745;
  background: linear-gradient(135deg, #f8fff8 0%, #ffffff 100%);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3a0061 0%, #6c5ce7 100%);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.completed .progress-fill {
  background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
}

.progress-text {
  font-size: 0.875rem;
  color: #666;
  margin: 0.25rem 0 0 0;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}
</style>
