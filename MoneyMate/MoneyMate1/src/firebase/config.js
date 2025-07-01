import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, update, remove } from 'firebase/database'

const firebaseConfig = {
  databaseURL: 'https://ikfram-33ade-default-rtdb.europe-west1.firebasedatabase.app/'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

// Firebase API functions
export const saveTransaction = async (transaction) => {
  try {
    await set(ref(database, `transactions/${transaction.id}`), transaction)
  } catch (error) {
    console.error('Error saving transaction:', error)
    throw error
  }
}

export const getTransactions = async () => {
  try {
    const snapshot = await get(ref(database, 'transactions'))
    return snapshot.val() || {}
  } catch (error) {
    console.error('Error getting transactions:', error)
    throw error
  }
}

export const updateTransaction = async (id, transaction) => {
  try {
    await update(ref(database, `transactions/${id}`), transaction)
  } catch (error) {
    console.error('Error updating transaction:', error)
    throw error
  }
}

export const deleteTransaction = async (id) => {
  try {
    await remove(ref(database, `transactions/${id}`))
  } catch (error) {
    console.error('Error deleting transaction:', error)
    throw error
  }
}
