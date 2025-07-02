import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import store from './stores/index.js'
import BaseCard from './components/ui/BaseCard.vue'
import BaseButton from './components/ui/BaseButton.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(store)

app.component('base-card', BaseCard)
app.component('base-button', BaseButton)

// Fetch initial data from Firebase
store.dispatch('transactions/fetchTransactions')
store.dispatch('goals/fetchGoals')

app.mount('#app')
