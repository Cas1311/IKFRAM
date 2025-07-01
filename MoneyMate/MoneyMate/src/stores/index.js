import { createStore } from 'vuex';

import goalsModule from './modules/goals/index.js';

const store = createStore({
  modules: {
    goals: goalsModule,
  },
});

export default store;
