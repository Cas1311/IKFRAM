import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/add',
    name: 'add-transaction',
    component: () => import('../views/AddTransactionView.vue')
  },
  // {
  //   path: '/graphs',
  //   name: 'graphs',
  //   component: () => import('../views/GraphsView.vue')
  // },
  {
    path: '/insights',
    name: 'insights',
    component: () => import('../views/InsightsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
