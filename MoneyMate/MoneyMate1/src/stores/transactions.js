import { defineStore } from 'pinia'
import { saveTransaction, getTransactions, updateTransaction, deleteTransaction } from '../firebase/config'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    categories: [
      { value: 'salary', label: 'Salary' },
      { value: 'freelance', label: 'Freelance' },
      { value: 'bonus', label: 'Bonus' },
      { value: 'food', label: 'Food' },
      { value: 'transport', label: 'Transport' },
      { value: 'bills', label: 'Bills' },
      { value: 'entertainment', label: 'Entertainment' },
      { value: 'shopping', label: 'Shopping' },
      { value: 'other', label: 'Other' }
    ]
  }),

  actions: {
    async initialize() {
      try {
        const data = await getTransactions()
        this.transactions = Object.values(data)
      } catch (error) {
        console.error('Error initializing transactions:', error)
      }
    },
    async addTransaction(transaction) {
      const newTransaction = {
        ...transaction,
        id: Date.now().toString()
      }
      await saveTransaction(newTransaction)
      this.transactions.push(newTransaction)
    },

    async editTransaction(id, updatedTransaction) {
      await updateTransaction(id, updatedTransaction)
      const index = this.transactions.findIndex(t => t.id === id)
      if (index !== -1) {
        this.transactions[index] = {
          ...this.transactions[index],
          ...updatedTransaction
        }
      }
    },

    async deleteTransaction(id) {
      await deleteTransaction(id)
      this.transactions = this.transactions.filter(t => t.id !== id)
    },

    async initialize() {
      try {
        const data = await getTransactions()
        this.transactions = Object.values(data)
      } catch (error) {
        console.error('Error initializing transactions:', error)
      }
    }
  },

  getters: {
    totalIncome: (state) => {
      return state.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
    },

    totalExpenses: (state) => {
      return state.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
    },

    balance: (state) => {
      return state.totalIncome - state.totalExpenses
    }
  }
})
