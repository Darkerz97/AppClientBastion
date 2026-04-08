import { createApp } from 'vue'
import { App as CapacitorApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { parseAuthCallbackUrl } from './utils/authCallback'

registerSW({ immediate: true })

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore()

CapacitorApp.addListener('appUrlOpen', async ({ url }) => {
  const payload = parseAuthCallbackUrl(url)

  if (!payload) {
    return
  }

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
})

authStore.bootstrap().finally(() => {
  app.mount('#app')
})
