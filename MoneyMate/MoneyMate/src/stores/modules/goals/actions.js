export default {
  deleteGoal(context, goalId) {
    context.commit('deleteGoal', goalId);
  },
  toggleStarGoal(context, goalId) {
    context.commit('toggleStarGoal', goalId);
  },
  addGoal(context, newGoal) {
    context.commit('addGoal', newGoal);
  },
  updateGoal(context, { id, updates }) {
    context.commit('updateGoal', { id, updates });
  }
};
