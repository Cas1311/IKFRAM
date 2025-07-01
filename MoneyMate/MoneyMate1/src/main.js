import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useTransactionsStore } from './stores/transactions'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Initialize Pinia
const pinia = createPinia()
app.use(pinia)

// Initialize transactions store and load data
const transactionsStore = useTransactionsStore()
await transactionsStore.initialize()

app.use(router)

app.mount('#app')
