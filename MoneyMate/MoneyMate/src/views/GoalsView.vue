<template>
  <section>Filter</section>
  <section>
    <base-card>
    <div class="controls">
    <base-button mode="outline">Refresh</base-button>
    <base-button link to="/goals/add">Add a Goal</base-button>
    </div>
    <ul v-if="hasGoals">
      <goal-item v-for="goal in filteredGoals" :key="goal.id" :id="goal.id" :name="goal.name" :target="goal.targetAmount" :current="goal.currentAmount" :date="goal.dueDate" :complete="goal.isCompleted"></goal-item>
    </ul>
    <h3 v-else>No goals available. Please add a goal.</h3>
    </base-card>
  </section>
</template>

<script>
import GoalItem from '@/components/goals/GoalItem.vue';

export default {
  components: {
    GoalItem,
  },
  name: 'GoalsView',
  computed: {
    filteredGoals() {
      return this.$store.getters['goals/goals'];
    },
    hasGoals() {
      return this.$store.getters['goals/hasGoals'];
    },
  },
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
</style>
