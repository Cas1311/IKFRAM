export default {
  deleteGoal(state, goalId) {
    const goalIndex = state.goals.findIndex(goal => goal.id === goalId);
    if (goalIndex !== -1) {
      state.goals.splice(goalIndex, 1);
    }
  },
  toggleStarGoal(state, goalId) {
    const goal = state.goals.find(goal => goal.id === goalId);
    if (goal) {
      if (goal.starred) {
        // If already starred, just unstar it
        goal.starred = false;
      } else {
        // If not starred, unstar all others and star this one
        state.goals.forEach(g => g.starred = false);
        goal.starred = true;
      }
    }
  },
  addGoal(state, newGoal) {
    state.goals.push(newGoal);
  },
  updateGoal(state, { id, updates }) {
    const goalIndex = state.goals.findIndex(goal => goal.id === id);
    if (goalIndex !== -1) {
      state.goals[goalIndex] = { ...state.goals[goalIndex], ...updates };
      // Auto-complete goal if current amount reaches or exceeds target
      const goal = state.goals[goalIndex];
      goal.isCompleted = goal.currentAmount >= goal.targetAmount;
    }
  },
  checkGoalCompletion(state, goalId) {
    const goal = state.goals.find(goal => goal.id === goalId);
    if (goal) {
      goal.isCompleted = goal.currentAmount >= goal.targetAmount;
    }
  }
};
