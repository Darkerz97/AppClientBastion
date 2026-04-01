import { createRouter, createWebHistory } from 'vue-router'
import ArticlesPage from '../pages/ArticlesPage.vue'
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import PreordersPage from '../pages/PreordersPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        requiresAuth: true,
        layout: 'app',
      },
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticlesPage,
      meta: {
        requiresAuth: true,
        layout: 'app',
      },
    },
    {
      path: '/preorders',
      name: 'preorders',
      component: PreordersPage,
      meta: {
        requiresAuth: true,
        layout: 'app',
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
      meta: {
        requiresAuth: true,
        layout: 'app',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.bootstrapped) {
    await authStore.bootstrap()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: to.fullPath !== '/' ? { redirect: to.fullPath } : {},
    }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'home' }
  }

  return true
})

export default router
