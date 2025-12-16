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
    // Пользователь авторизован — пропускаем
    next()
  } else if (requireAuth && !store.getters['auth/isAuthenticated']) {
    // Требуется авторизация, но пользователь не залогинен
    next('/auth?message=auth')
  } else {
    // Страница не требует авторизации — пропускаем
    next()
  }
})

export default router
