import { createApp } from 'vue'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { parseAuthCallbackUrl } from './utils/authCallback'

if (Capacitor.isNativePlatform()) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister().catch(() => {})
      })
    })
  }
} else {
  registerSW({ immediate: true })
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore()

let lastHandledAuthUrl = ''

async function handleAuthCallback(url) {
  if (!url || url === lastHandledAuthUrl) {
    return
  }

  const payload = parseAuthCallbackUrl(url)

  if (!payload) {
    return
  }

  lastHandledAuthUrl = url

  await Browser.close().catch(() => {})

  if (payload.error) {
    await router.replace({
      path: '/login',
      query: {
        error: payload.error,
      },
    })
    return
  }

  try {
    await authStore.completeExternalAuth(payload)
    await router.replace('/')
  } catch {
    await router.replace('/login')
  }
}

CapacitorApp.addListener('appUrlOpen', async ({ url }) => {
  await handleAuthCallback(url)
})

authStore.bootstrap().finally(() => {
  app.mount('#app')

  CapacitorApp.getLaunchUrl()
    .then(async ({ url }) => {
      await handleAuthCallback(url)
    })
    .catch(() => {})
})
