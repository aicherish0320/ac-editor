import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/Index.vue'

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        component: () => import('@/views/content/Index.vue')
      }
    ]
  },
  {
    path: '/editor',
    component: () => import('@/views/editor/Index.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/login/Index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
