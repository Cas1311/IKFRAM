const state = {
  goals: []
};

const mutations = {
  ADD_GOAL(state, goal) {
    state.goals.push({
      id: new Date().toISOString(),
      ...goal,
      currentAmount: goal.currentAmount || 0,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('savingsGoals', JSON.stringify(state.goals));
  },
  UPDATE_GOAL(state, { id, ...updates }) {
    const goalIndex = state.goals.findIndex(g => g.id === id);
    if (goalIndex !== -1) {
      state.goals[goalIndex] = { ...state.goals[goalIndex], ...updates };
      localStorage.setItem('savingsGoals', JSON.stringify(state.goals));
    }
  },
  DELETE_GOAL(state, goalId) {
    state.goals = state.goals.filter(goal => goal.id !== goalId);
    localStorage.setItem('savingsGoals', JSON.stringify(state.goals));
  },
  SET_GOALS(state, goals) {
    state.goals = goals;
  }
};

const actions = {
  addGoal({ commit }, goal) {
    commit('ADD_GOAL', goal);
  },
  updateGoal({ commit }, { id, ...updates }) {
    commit('UPDATE_GOAL', { id, ...updates });
  },
  deleteGoal({ commit }, goalId) {
    commit('DELETE_GOAL', goalId);
  },
  loadGoals({ commit }) {
    const goals = JSON.parse(localStorage.getItem('savingsGoals') || '[]');
    commit('SET_GOALS', goals);
  }
};

const getters = {
  goals: state => state.goals,
  activeGoals: state => state.goals.filter(goal => !goal.completed),
  completedGoals: state => state.goals.filter(goal => goal.completed),
  goalProgress: (state) => (goalId) => {
    const goal = state.goals.find(g => g.id === goalId);
    if (!goal) return 0;
    return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
