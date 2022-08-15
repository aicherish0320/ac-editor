import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/Index.vue'
import request from '@/utils/request'

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
    path: '/editor/:id',
    component: () => import('@/views/editor/Index.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/login/Index.vue')
  },
  {
    path: '/demo',
    component: () => import('@/views/demo/Index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('ac_editor_token')
  request.defaults.headers.common.Authorization = `Bearer ${token}`
  next()
})

export default router
