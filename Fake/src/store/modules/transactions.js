const state = {
  transactions: [],
  categories: [
    { id: 'income', name: 'Inkomen', type: 'income' },
    { id: 'housing', name: 'Huisvesting', type: 'expense' },
    { id: 'food', name: 'Eten & Drinken', type: 'expense' },
    { id: 'transport', name: 'Vervoer', type: 'expense' },
    { id: 'utilities', name: 'Nutsvoorzieningen', type: 'expense' },
    { id: 'entertainment', name: 'Vrije Tijd', type: 'expense' },
    { id: 'shopping', name: 'Winkelen', type: 'expense' },
    { id: 'health', name: 'Gezondheid', type: 'expense' },
    { id: 'other', name: 'Overig', type: 'expense' }
  ]
};

const mutations = {
  ADD_TRANSACTION(state, transaction) {
    state.transactions.push({
      id: new Date().toISOString(),
      ...transaction
    });
    // Save to localStorage
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
  },
  SET_TRANSACTIONS(state, transactions) {
    state.transactions = transactions;
  },
  ADD_CATEGORY(state, category) {
    state.categories.push(category);
  }
};

const actions = {
  addTransaction({ commit }, transaction) {
    commit('ADD_TRANSACTION', transaction);
  },
  loadTransactions({ commit }) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    commit('SET_TRANSACTIONS', transactions);
  }
};

const getters = {
  transactions: state => state.transactions,
  categories: state => state.categories,
  incomeCategories: state => state.categories.filter(cat => cat.type === 'income'),
  expenseCategories: state => state.categories.filter(cat => cat.type === 'expense'),
  totalBalance: state => {
    return state.transactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
  },
  monthlySummary: (state) => (year, month) => {
    const filtered = state.transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getFullYear() === year && date.getMonth() === month - 1;
    });
    
    return {
      income: filtered
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      expenses: filtered
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
      byCategory: state.categories.reduce((acc, category) => {
        const amount = filtered
          .filter(t => t.category === category.id && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        if (amount > 0) {
          acc.push({ ...category, amount });
        }
        return acc;
      }, [])
    };
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
