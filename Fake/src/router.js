import { createRouter, createWebHistory } from 'vue-router';

import DashboardView from './pages/dashboard/DashboardView.vue';
import TransactionsView from './pages/transactions/TransactionsView.vue';
import TransactionForm from './pages/transactions/TransactionForm.vue';
import GoalsView from './pages/goals/GoalsView.vue';
import NotFound from './pages/NotFound.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: DashboardView },
    { path: '/transactions', component: TransactionsView },
    {
      path: '/transactions/new',
      component: TransactionForm,
      props: { isNew: true }
    },
    {
      path: '/transactions/:id/edit',
      component: TransactionForm,
      props: true
    },
    { path: '/goals', component: GoalsView },
    { path: '/:notFound(.*)', component: NotFound }
  ]
});

export default router;
