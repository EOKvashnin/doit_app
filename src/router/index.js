import { createRouter, createWebHistory } from 'vue-router'

import store from '../store'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('../views/HomePage.vue'),
    meta: {
      layout: 'main',
      auth: true,
    },
  },

  {
    path: '/help',
    name: 'HelpPage',
    component: () => import('../views/HelpPage.vue'),
    meta: {
      layout: 'main',
      auth: true,
    },
  },
  {
    path: '/analytics',
    name: 'AnalyticsPage',
    component: () => import('../views/AnalyticsPage.vue'),
    meta: {
      layout: 'main',
      auth: true,
    },
  },

  {
    path: '/analitics',
    redirect: '/analytics',
  },

  {
    path: '/auth',
    name: 'AuthPage',
    component: () => import('../views/AuthPage.vue'),
    meta: {
      layout: 'auth',
      auth: false,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
})

router.beforeEach((to, from, next) => {
  const requireAuth = to.meta.auth

  if (requireAuth && store.getters['auth/isAuthenticated']) {
    next() // Пропустить, если авторизация пройдена
  } else if (requireAuth && !store.getters['auth/isAuthenticated']) {
    next('/auth?message=auth') // Перенаправить на страницу авторизации
  } else {
    next() // Стандартный переход
  }
})

export default router
