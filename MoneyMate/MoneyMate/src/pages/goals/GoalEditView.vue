<template>
  <section v-if="goal">
    <base-card class="detail-card">
      <div class="header">
        <h1>Edit Goal: {{ goal.name }}</h1>
        <!-- <base-button mode="flat" link :to="goalDetailLink">Cancel</base-button> -->
      </div>

      <form @submit.prevent="saveGoal">
        <div class="form-group">
          <label for="name">Goal Name</label>
          <input id="name" v-model="editedGoal.name" type="text" required placeholder="Enter goal name" />
        </div>

        <div class="form-group">
          <label for="target">Target Amount</label>
          <input id="target" v-model.number="editedGoal.targetAmount" type="number" required min="0" step="1"
            placeholder="Enter target amount" />
        </div>

        <!-- <div class="form-group">
          <label for="current">Current Amount</label>
          <input
            id="current"
            v-model.number="editedGoal.currentAmount"
            type="number"
            required
            min="0"
            step="1"
            placeholder="Enter current amount"
          />
        </div> -->

        <div class="form-group">
          <label for="date">Due Date</label>
          <input id="date" v-model="editedGoal.dueDate" type="date" required />
        </div>

        <div class="form-actions">
          <base-button mode="outline" @click="goBack()">Cancel</base-button>
          <base-button type="submit">Save Changes</base-button>
        </div>
      </form>
    </base-card>
  </section>

  <section v-else>
    <base-card class="detail-card">
      <h1>Goal Not Found</h1>
      <p>The goal you're trying to edit doesn't exist.</p>
      <base-button link to="/goals">Back to Goals</base-button>
    </base-card>
  </section>
</template>

<script>
export default {
  name: 'GoalEditView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      editedGoal: {
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        dueDate: '',
        isCompleted: false
      }
    };
  },
  computed: {
    goal() {
      const goals = this.$store.getters['goals/goals'];
      return goals.find(goal => goal.id === this.id);
    },
    goalDetailLink() {
      return `/goals/${this.id}`;
    }
  },
  mounted() {
    if (this.goal) {
      this.editedGoal = { ...this.goal };
    }
  },
  watch: {
    goal: {
      handler(newGoal) {
        if (newGoal) {
          this.editedGoal = { ...newGoal };
        }
      },
      immediate: true
    }
  },
  methods: {
    saveGoal() {
      try {
        // Dispatch the updateGoal action to save changes to the store
        this.$store.dispatch('goals/updateGoal', {
          id: this.id,
          updates: this.editedGoal
        });

        console.log('Goal updated successfully:', this.editedGoal);

        // Navigate back to detail view
        this.$router.push(this.goalDetailLink);
      } catch (error) {
        console.error('Error updating goal:', error);
        alert('Error saving changes. Please try again.');
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="date"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  background-color: var(--input-bg);
  color: var(--input-text);
}

.form-group input[type="text"]:focus,
.form-group input[type="number"]:focus,
.form-group input[type="date"]:focus {
  outline: none;
  border-color: var(--input-focus-border);
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.form-group input[type="checkbox"] {
  margin-right: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}
</style>
