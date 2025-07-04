import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../pages/DashboardView.vue'
import GoalsView from '@/pages/goals/GoalsView.vue'
import TransactionsView from '@/pages/transactions/TransactionsView.vue'
// import RegisterUser from '@/pages/users/RegisterUser.vue'
import NotFound from '@/pages/NotFound.vue'
import AddGoal from '@/pages/goals/AddGoal.vue'

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
      path: '/goals/:id',
      name: 'goal-detail',
      component: () => import('@/pages/goals/GoalDetailView.vue'),
      props: true,
    },
    {
      path: '/goals/:id/edit',
      name: 'goal-edit',
      component: () => import('@/pages/goals/GoalEditView.vue'),
      props: true,
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsView,
    },
    {
      path: '/transactions/:id',
      name: 'transaction-detail',
      component: () => import('@/pages/transactions/TransactionDetailView.vue'),
      props: true,
    },
    {
      path: '/transactions/add',
      name: 'add-transaction',
      component: () => import('@/pages/transactions/AddTransaction.vue'),
    },
    {
      path: '/insights',
      name: 'insights',
      component: () => import('@/pages/insights/InsightsView.vue'),
    },
    {
      path: '/admin/populate',
      name: 'populate-database',
      component: () => import('@/components/admin/PopulateDatabase.vue'),
    },
    // {
    //   path: '/register',
    //   name: 'register',
    //   component: RegisterUser,
    // },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
    },
  ],
})

export default router
