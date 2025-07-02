import database from '@/firebase/config.js';
import { ref, push, set, get, remove, update } from 'firebase/database';

export default {
  async fetchGoals({ commit }) {
    commit('setLoading', true);
    commit('setError', null);

    try {
      const goalsRef = ref(database, 'goals');
      const snapshot = await get(goalsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const goals = Object.keys(data).map(key => ({
          id: key,
          starred: false, // Default value for backward compatibility
          ...data[key]
        }));

        commit('setGoals', goals);
      } else {
        commit('setGoals', []);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      commit('setError', error.message);
    } finally {
      commit('setLoading', false);
    }
  },

  async addGoal({ commit }, goal) {
    commit('setLoading', true);
    commit('setError', null);

    try {
      const goalsRef = ref(database, 'goals');
      const newGoalRef = push(goalsRef);

      await set(newGoalRef, goal);

      const goalWithId = {
        ...goal,
        id: newGoalRef.key
      };

      commit('addGoalToState', goalWithId);
    } catch (error) {
      console.error('Error adding goal:', error);
      commit('setError', error.message);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async deleteGoal({ commit, dispatch }, goalId) {
    commit('setLoading', true);
    commit('setError', null);

    try {
      // First, remove all transactions associated with this goal
      const transactionsRef = ref(database, 'transactions');
      const transactionsSnapshot = await get(transactionsRef);

      if (transactionsSnapshot.exists()) {
        const transactions = transactionsSnapshot.val();
        const transactionsToDelete = [];

        // Find all transactions related to this goal
        Object.keys(transactions).forEach(transactionId => {
          const transaction = transactions[transactionId];
          if (transaction.type === 'goal' && transaction.goalId === goalId) {
            transactionsToDelete.push(transactionId);
          }
        });

        // Remove each transaction
        for (const transactionId of transactionsToDelete) {
          const transactionRef = ref(database, `transactions/${transactionId}`);
          await remove(transactionRef);
        }
      }

      // Then remove the goal
      const goalRef = ref(database, `goals/${goalId}`);
      await remove(goalRef);

      commit('deleteGoal', goalId);

      // Refresh transactions to update the UI and balance
      await dispatch('transactions/fetchTransactions', null, { root: true });
    } catch (error) {
      console.error('Error deleting goal:', error);
      commit('setError', error.message);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async updateGoal({ commit }, { id, updates }) {
    commit('setLoading', true);
    commit('setError', null);

    try {
      const goalRef = ref(database, `goals/${id}`);
      await set(goalRef, updates);

      commit('updateGoal', { id, updates });
    } catch (error) {
      console.error('Error updating goal:', error);
      commit('setError', error.message);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async toggleStarGoal({ commit, state }, goalId) {
    commit('setLoading', true);
    commit('setError', null);

    try {
      // Update all goals to ensure only one is starred
      const goalsRef = ref(database, 'goals');
      const updates = {};

      state.goals.forEach(goal => {
        if (goal.id === goalId) {
          updates[`${goal.id}/starred`] = !goal.starred;
        } else {
          updates[`${goal.id}/starred`] = false;
        }
      });

      await update(goalsRef, updates);
      commit('toggleStarGoal', goalId);
    } catch (error) {
      console.error('Error toggling star:', error);
      commit('setError', error.message);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async contributeToGoal({ commit, dispatch }, { goalId, amount, description }) {
    commit('setLoading', true);
    commit('setError', null);

    try {
      // First, get the current goal
      const goalsRef = ref(database, `goals/${goalId}`);
      const snapshot = await get(goalsRef);

      if (!snapshot.exists()) {
        throw new Error('Goal not found');
      }

      const goal = snapshot.val();
      const newCurrentAmount = goal.currentAmount + amount;

      // Update the goal's current amount
      await set(goalsRef, {
        ...goal,
        currentAmount: newCurrentAmount,
        isCompleted: newCurrentAmount >= goal.targetAmount
      });

      // Create a transaction record for this contribution
      const transaction = {
        title: `Contribution to ${goal.name}`,
        amount: amount,
        type: 'goal',
        category: 'Savings',
        description: description || `Added $${amount} to ${goal.name}`,
        goalId: goalId,
        goalName: goal.name,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };

      // Add the transaction
      await dispatch('transactions/addTransaction', transaction, { root: true });

      // Update local goal state
      commit('updateGoal', {
        id: goalId,
        updates: {
          ...goal,
          currentAmount: newCurrentAmount,
          isCompleted: newCurrentAmount >= goal.targetAmount
        }
      });

    } catch (error) {
      console.error('Error contributing to goal:', error);
      commit('setError', error.message);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  }
};
