import { createStore } from 'vuex';

import transactionsModule from './modules/transactions';
import goalsModule from './modules/goals';

const store = createStore({
  modules: {
    transactions: transactionsModule,
    goals: goalsModule
  },
  state() {
    return {
      currentMonth: new Date().getMonth() + 1,
      currentYear: new Date().getFullYear()
    };
  },
  mutations: {
    setCurrentMonth(state, month) {
      state.currentMonth = month;
    },
    setCurrentYear(state, year) {
      state.currentYear = year;
    }
  },
  actions: {
    async initApp({ dispatch }) {
      await dispatch('transactions/loadTransactions');
      await dispatch('goals/loadGoals');
    }
  },
  getters: {
    currentMonth: state => state.currentMonth,
    currentYear: state => state.currentYear
  }
});

export default store;