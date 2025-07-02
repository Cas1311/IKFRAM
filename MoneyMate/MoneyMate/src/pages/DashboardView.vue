<template>
  <section>
    <base-card>
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard!</p>
    <p>Here you can view your financial overview, recent transactions, and more.</p>
    </base-card>
  </section>
  <section>
    <base-card>
    <div class="controls">
      <base-button link to="/goals">See all Goals</base-button>
      <base-button link to="/goals/add">Add a Goal</base-button>
      <!-- <base-button mode="flat">Refresh</base-button> -->
    </div>
    <goal-item class="goal-item"
      v-if="starredGoal"
      :id="starredGoal.id"
      :name="starredGoal.name"
      :target="starredGoal.targetAmount"
      :current="starredGoal.currentAmount"
      :date="starredGoal.dueDate"
      :complete="starredGoal.isCompleted"
      :starred="starredGoal.starred">
    </goal-item>
    <p v-else>No starred goal. <base-button mode="flat" link to="/goals">Star a goal</base-button> to display it here.</p>
    </base-card>
  </section>
  <section>
    <base-card>
      <div class="controls">
        <base-button link to="/transactions">Add a Transaction</base-button>
        <!-- <base-button mode="flat">Refresh</base-button> -->
      </div>
      <ul>Transactions Overview</ul>
    </base-card>
  </section>
</template>

<script>
import GoalItem from '@/components/goals/GoalItem.vue';

export default {
  name: 'DashboardView',
  components: {
    GoalItem,
  },
  computed: {
    starredGoal() {
      return this.$store.getters['goals/starredGoal'];
    }
  }
};
</script>

<style scoped>
.goal-item:hover {
  cursor: pointer;
  background-color: #f0f0f0;
  transition: 0.3s;
}
</style>
