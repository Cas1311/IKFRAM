import { createStore } from 'vuex';

import goalsModule from './modules/goals/index.js';
import transactionsModule from './modules/transactions/index.js';

const store = createStore({
  modules: {
    goals: goalsModule,
    transactions: transactionsModule,
  },
});

export default store;
