export default {
  goals(state) {
    return state.goals;
  },
  loading(state) {
    return state.loading;
  },
  error(state) {
    return state.error;
  },
  hasGoals(state) {
    return state.goals && state.goals.length > 0;
  },
  starredGoal(state) {
    return state.goals.find(goal => goal.starred);
  },
  hasStarredGoal(state) {
    return state.goals.some(goal => goal.starred);
  },
  completedGoals(state) {
    return state.goals.filter(goal => goal.isCompleted);
  },
  activeGoals(state) {
    return state.goals.filter(goal => !goal.isCompleted);
  },
  totalCurrentAmount(state) {
    return state.goals.reduce((total, goal) => total + (goal.currentAmount || 0), 0);
  },
  totalTargetAmount(state) {
    return state.goals.reduce((total, goal) => total + (goal.targetAmount || 0), 0);
  }
};
