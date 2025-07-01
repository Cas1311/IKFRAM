<template>
  <div>
    <h2>Test Component</h2>
    <button @click="testFirebase">Test Firebase Connection</button>
    <div v-if="testResult">
      <h3>Test Result:</h3>
      <p>{{ testResult }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTransactionsStore } from '../stores/transactions'

const testResult = ref('')
const transactionsStore = useTransactionsStore()

const testFirebase = async () => {
  try {
    // Add a test transaction
    const testTransaction = {
      amount: 100,
      category: 'test',
      type: 'income',
      date: new Date().toISOString().split('T')[0],
      description: 'Test transaction'
    }
    
    await transactionsStore.addTransaction(testTransaction)
    testResult.value = 'Successfully added test transaction to Firebase!'
  } catch (error) {
    testResult.value = `Error: ${error.message}`
  }
}
</script>
