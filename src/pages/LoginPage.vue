<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { openGoogleAuth } from '../api/socialAuth'
import DataModeNotice from '../components/DataModeNotice.vue'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const localError = ref('')

if (typeof route.query.error === 'string' && route.query.error.trim()) {
  localError.value = route.query.error
}

async function submitLogin() {
  localError.value = ''

  try {
    await authStore.login(form)
    router.push(`${route.query.redirect || '/'}`)
  } catch (error) {
    localError.value = authStore.error || error?.message || 'No fue posible iniciar sesion.'
  }
}

async function continueWithGoogle(mode) {
  localError.value = ''

  try {
    await openGoogleAuth(mode)
  } catch (error) {
    localError.value = error?.message || 'No se pudo abrir el flujo de Google.'
  }
}
</script>

<template>
  <main class="auth-shell">
    <section class="auth-card auth-card--premium">
      <div class="auth-brand">
        <span class="eyebrow">Card Bastion</span>
        <h1 class="page-title">Tu cuenta de jugador en una app limpia, premium y mobile-first.</h1>
        <p class="page-copy">
          Inicia sesion para entrar a compras, preventas, torneos y perfil sin mezclarte con la API privada del POS.
        </p>
      </div>

      <DataModeNotice :mode="authStore.authMode" />

      <form class="stack" @submit.prevent="submitLogin">
        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model.trim="form.email"
            autocomplete="email"
            inputmode="email"
            placeholder="cliente@cardbastion.com"
            type="email"
            required
          />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            autocomplete="current-password"
            placeholder="Tu password"
            type="password"
            required
          />
        </div>

        <p class="login-helper login-helper--left">
          <RouterLink class="text-link" to="/forgot-password">Olvide mi password</RouterLink>
        </p>

        <div v-if="localError || authStore.error" class="error-banner">
          {{ localError || authStore.error }}
        </div>

        <button class="button" type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? 'Entrando...' : 'Iniciar sesion' }}
        </button>
      </form>

      <div class="login-divider">
        <span>o continua con</span>
      </div>

      <div class="stack">
        <button class="social-button" type="button" @click="continueWithGoogle('login')">
          <span class="social-button__icon">G</span>
          <span>Iniciar sesion con Google</span>
        </button>

        <button
          class="ghost-button social-button social-button--secondary"
          type="button"
          @click="continueWithGoogle('register')"
        >
          <span class="social-button__icon">G</span>
          <span>Registrarme con Google</span>
        </button>
      </div>

      <p class="login-helper">
        ¿No tienes cuenta?
        <RouterLink class="text-link" to="/register">Registrate aqui</RouterLink>
      </p>
    </section>
  </main>
</template>
