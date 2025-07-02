<template>
  <section>
    <base-card>
    <h2>Add a New Goal</h2>
    <goal-form></goal-form>
    </base-card>
  </section>
</template>

<script>
import GoalForm from '@/components/goals/GoalForm.vue';

export default{
  components: {
    GoalForm
  },
}
</script>
