import database from '@/firebase/config.js';
import { ref, push, set, get, remove } from 'firebase/database';

export default {
  namespaced: true,
  state() {
    return {
      transactions: [],
      loading: false,
      error: null
    };
  },
  mutations: {
    setTransactions(state, transactions) {
      state.transactions = transactions;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
    addTransactionToState(state, transaction) {
      state.transactions.unshift(transaction);
    },
    removeTransactionFromState(state, transactionId) {
      const transactionIndex = state.transactions.findIndex(t => t.id === transactionId);
      if (transactionIndex !== -1) {
        state.transactions.splice(transactionIndex, 1);
      }
    },
    updateTransactionInState(state, { id, updates }) {
      const transactionIndex = state.transactions.findIndex(t => t.id === id);
      if (transactionIndex !== -1) {
        const oldTransaction = state.transactions[transactionIndex];
        state.transactions[transactionIndex] = { ...oldTransaction, ...updates };
      }
    }
  },
  actions: {
    async fetchTransactions({ commit }) {
      commit('setLoading', true);
      commit('setError', null);

      try {
        const transactionsRef = ref(database, 'transactions');
        const snapshot = await get(transactionsRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const transactions = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          commit('setTransactions', transactions);

          // Calculate account balance from transactions
          let balance = 1000; // Starting balance
          transactions.forEach(transaction => {
            if (transaction.type === 'income') {
              balance += transaction.amount;
            } else if (transaction.type === 'expense') {
              balance -= transaction.amount;
            } else if (transaction.type === 'goal') {
              balance -= transaction.amount;
            }
          });
          commit('setAccountBalance', balance);
        } else {
          commit('setTransactions', []);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        commit('setError', error.message);
      } finally {
        commit('setLoading', false);
      }
    },

    async addTransaction({ commit }, transaction) {
      commit('setLoading', true);
      commit('setError', null);

      try {
        const transactionsRef = ref(database, 'transactions');
        const newTransactionRef = push(transactionsRef);

        await set(newTransactionRef, transaction);

        const transactionWithId = {
          ...transaction,
          id: newTransactionRef.key
        };

        commit('addTransactionToState', transactionWithId);

        // Also save updated balance to Firebase
        const balanceRef = ref(database, 'accountBalance');
        const currentBalance = await get(balanceRef);
        let newBalance = currentBalance.exists() ? currentBalance.val() : 1000;

        if (transaction.type === 'income') {
          newBalance += transaction.amount;
        } else if (transaction.type === 'expense') {
          newBalance -= transaction.amount;
        }

        await set(balanceRef, newBalance);

      } catch (error) {
        console.error('Error adding transaction:', error);
        commit('setError', error.message);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    async deleteTransaction({ commit }, transactionId) {
      commit('setLoading', true);
      commit('setError', null);

      try {
        const transactionRef = ref(database, `transactions/${transactionId}`);

        // Get transaction data before deleting
        const snapshot = await get(transactionRef);
        if (snapshot.exists()) {
          const transaction = snapshot.val();

          // Delete from Firebase
          await remove(transactionRef);

          // Update local state
          commit('removeTransactionFromState', transactionId);

          // Update balance in Firebase
          const balanceRef = ref(database, 'accountBalance');
          const currentBalance = await get(balanceRef);
          let newBalance = currentBalance.exists() ? currentBalance.val() : 1000;

          if (transaction.type === 'income') {
            newBalance -= transaction.amount;
          } else if (transaction.type === 'expense') {
            newBalance += transaction.amount;
          }

          await set(balanceRef, newBalance);
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
        commit('setError', error.message);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    async updateTransaction({ commit }, { id, updates }) {
      commit('setLoading', true);
      commit('setError', null);

      try {
        const transactionRef = ref(database, `transactions/${id}`);
        await set(transactionRef, updates);

        commit('updateTransactionInState', { id, updates });

        // Recalculate and update balance
        // This is a simplified approach - in a real app you might want to be more precise
        this.dispatch('transactions/fetchTransactions');

      } catch (error) {
        console.error('Error updating transaction:', error);
        commit('setError', error.message);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    }
  },
  getters: {
    transactions(state) {
      return state.transactions;
    },
    accountBalance(state) {
      // Calculate available balance: Income - Expenses - Savings (goal contributions)
      const totalIncome = state.transactions
        .filter(t => t.type === 'income')
        .reduce((total, t) => total + t.amount, 0);

      const totalExpenses = state.transactions
        .filter(t => t.type === 'expense')
        .reduce((total, t) => total + t.amount, 0);

      const totalSavings = state.transactions
        .filter(t => t.type === 'goal')
        .reduce((total, t) => total + t.amount, 0);

      return totalIncome - totalExpenses - totalSavings;
    },
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    },
    totalIncome(state) {
      return state.transactions
        .filter(t => t.type === 'income')
        .reduce((total, t) => total + t.amount, 0);
    },
    totalExpenses(state) {
      return state.transactions
        .filter(t => t.type === 'expense')
        .reduce((total, t) => total + t.amount, 0);
    },
    totalSavings(state) {
      return state.transactions
        .filter(t => t.type === 'goal')
        .reduce((total, t) => total + t.amount, 0);
    },
    goalContributions(state) {
      return state.transactions.filter(t => t.type === 'goal');
    },
    recentTransactions(state) {
      return state.transactions.slice(0, 5); // Last 5 transactions
    },
    transactionsByCategory(state) {
      const categories = {};
      state.transactions.forEach(transaction => {
        if (!categories[transaction.category]) {
          categories[transaction.category] = {
            total: 0,
            count: 0,
            type: transaction.type
          };
        }
        categories[transaction.category].total += transaction.amount;
        categories[transaction.category].count += 1;
      });
      return categories;
    },
    transactionsByType(state) {
      const types = {
        income: [],
        expense: [],
        goal: []
      };
      state.transactions.forEach(transaction => {
        if (types[transaction.type]) {
          types[transaction.type].push(transaction);
        }
      });
      return types;
    },
    uniqueCategories(state) {
      const categories = new Set();
      state.transactions.forEach(transaction => {
        if (transaction.category && transaction.category.trim()) {
          categories.add(transaction.category);
        }
      });
      return Array.from(categories).sort();
    },
    transactionDateRange(state) {
      if (!state.transactions || state.transactions.length === 0) {
        return { min: null, max: null };
      }

      const dates = state.transactions.map(t => new Date(t.date || t.timestamp));
      return {
        min: new Date(Math.min(...dates)),
        max: new Date(Math.max(...dates))
      };
    },
    monthlyTransactionSummary(state) {
      const summary = {};

      state.transactions.forEach(transaction => {
        const date = new Date(transaction.date || transaction.timestamp);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!summary[monthKey]) {
          summary[monthKey] = {
            income: 0,
            expenses: 0,
            savings: 0,
            count: 0
          };
        }

        summary[monthKey].count++;

        if (transaction.type === 'income') {
          summary[monthKey].income += transaction.amount;
        } else if (transaction.type === 'expense') {
          summary[monthKey].expenses += transaction.amount;
        } else if (transaction.type === 'goal') {
          summary[monthKey].savings += transaction.amount;
        }
      });

      return summary;
    }
  }
};
