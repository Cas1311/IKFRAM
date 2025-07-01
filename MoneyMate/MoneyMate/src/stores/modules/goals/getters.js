export default {
  goals(state) {
    return state.goals;
  },
  hasGoals(state) {
    return state.goals && state.goals.length > 0;
  },
};
