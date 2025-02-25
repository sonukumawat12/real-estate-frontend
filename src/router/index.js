import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import UserCreate from '../views/Users/Create.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/users',
      name: 'users',

      component: () => import('../views/Users/Index.vue'),
    },
    {
      path: '/admins',
      name: 'admin',

      component: () => import('../views/Admins/Index.vue'),
    },
    {
      path: '/create/admin',
      name: 'admin.create',

      component: () => import('../views/Admins/Create.vue'),
    },
    {
      path: '/agents',
      name: 'agents',

      component: () => import('../views/Agents/Index.vue'),
    },
    {
      path: '/admin/create',
      name: 'user-create',
      component: UserCreate,
    },
    {
      path: '/roles',
      name: 'roles',
      component: () => import('../views/RolePermissions/Index.vue'),
    },
    {
      path: '/roles/create',
      name: 'role-create',
      component: () => import('../views/RolePermissions/Create.vue'),
    }
  ],
})

export default router
