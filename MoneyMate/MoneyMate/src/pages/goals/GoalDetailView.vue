<template>
  <section v-if="goal">
    <base-card class="detail-card">
      <div class="goal-header">
        <h1>{{ goal.name }}</h1>
        <div class="actions">
          <base-button mode="outline" link :to="goalEditLink">Edit Goal</base-button>
          <base-button @click="deleteGoal">Delete Goal</base-button>
          <base-button mode="flat" @click="goBack">Back</base-button>
        </div>
      </div>

      <div class="goal-details">
        <div class="progress-section">
          <h3>Progress</h3>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <p class="progress-text">{{ goal.currentAmount }} / {{ goal.targetAmount }} ({{ progressPercentage }}%)</p>
        </div>

        <div class="details-grid">
          <div class="detail-item">
            <h4>Target Amount</h4>
            <p>${{ goal.targetAmount.toLocaleString() }}</p>
          </div>
          <div class="detail-item">
            <h4>Current Amount</h4>
            <p>${{ goal.currentAmount.toLocaleString() }}</p>
          </div>
          <div class="detail-item">
            <h4>Remaining</h4>
            <p>${{ remainingAmount.toLocaleString() }}</p>
          </div>
          <div class="detail-item">
            <h4>Due Date</h4>
            <p>{{ formattedDate }}</p>
          </div>
          <div class="detail-item">
            <h4>Status</h4>
            <p :class="statusClass">{{ statusText }}</p>
          </div>
        </div>
      </div>
    </base-card>
  </section>

  <section v-else>
    <base-card class="detail-card">
      <h1>Goal Not Found</h1>
      <p>The goal you're looking for doesn't exist.</p>
      <base-button @click="goBack">Back</base-button>
    </base-card>
  </section>
</template>

<script>
export default {
  name: 'GoalDetailView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    goal() {
      const goals = this.$store.getters['goals/goals'];
      return goals.find(goal => goal.id === this.id);
    },
    goalEditLink() {
      return `/goals/${this.id}/edit`;
    },
    progressPercentage() {
      if (!this.goal) return 0;
      return Math.round((this.goal.currentAmount / this.goal.targetAmount) * 100);
    },
    remainingAmount() {
      if (!this.goal) return 0;
      return this.goal.targetAmount - this.goal.currentAmount;
    },
    formattedDate() {
      if (!this.goal) return '';
      return new Date(this.goal.dueDate).toLocaleDateString();
    },
    statusText() {
      if (!this.goal) return '';
      if (this.goal.isCompleted) return 'Completed';
      if (this.progressPercentage >= 100) return 'Goal Reached';
      if (new Date(this.goal.dueDate) < new Date()) return 'Overdue';
      return 'In Progress';
    },
    statusClass() {
      if (!this.goal) return '';
      if (this.goal.isCompleted || this.progressPercentage >= 100) return 'status-completed';
      if (new Date(this.goal.dueDate) < new Date()) return 'status-overdue';
      return 'status-progress';
    }
  },
  methods: {
    deleteGoal() {
      if (confirm(`Are you sure you want to delete "${this.goal.name}"?`)) {
        this.$store.dispatch('goals/deleteGoal', this.id);
        this.$router.push('/goals');
      }
    },
    goBack() {
      // Check if there's history to go back to
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        // Fallback to goals page if no history
        this.$router.push('/goals');
      }
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

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.goal-header h1 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.goal-details {
  padding: 1rem;
}

.progress-section {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 1rem 0;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-weight: bold;
  margin: 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.detail-item h4 {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail-item p {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
}

.status-completed {
  color: #4caf50;
}

.status-overdue {
  color: #f44336;
}

.status-progress {
  color: #ff9800;
}
</style>
