import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import GoalsView from '@/views/GoalsView.vue'
import TransactionsView from '@/views/TransactionsView.vue'
import RegisterUser from '@/views/RegisterUser.vue'
import NotFound from '@/views/NotFound.vue'
import AddGoal from '@/views/addGoal.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardView,
    },
    {
      path: '/goals',
      name: 'goals',
      component: GoalsView,
    },
    {
      path: '/goals/add',
      name: 'add-goal',
      component: AddGoal,
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterUser,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
    },
  ],
})

export default router
