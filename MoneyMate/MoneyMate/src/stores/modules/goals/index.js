import mutations from './mutations.js'
import actions from './actions.js'
import getters from './getters.js'

export default {
  namespaced: true,
  state() {
    return {
      goals: [{
        id: '1',
        name: 'Emergency Fund',
        targetAmount: 5000,
        currentAmount: 2000,
        dueDate: '2025-08-31',
        isCompleted: false,
        starred: false,
      },
      {
        id: '2',
        name: 'Vacation Fund',
        targetAmount: 3000,
        currentAmount: 3000, // Completed goal for testing
        dueDate: '2025-12-31',
        isCompleted: true,
        starred: false,
      },
      {
        id: '3',
        name: 'New Car',
        targetAmount: 20000,
        currentAmount: 5000,
        dueDate: '2026-05-15',
        isCompleted: false,
        starred: false,
      }],
    }
  },
  mutations,
  actions,
  getters,
}
