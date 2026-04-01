<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const localError = ref('')

async function submitLogin() {
  localError.value = ''

  try {
    await authStore.login(form)
    router.push(`${route.query.redirect || '/'}`)
  } catch (error) {
    localError.value = authStore.error || error?.message || 'No fue posible iniciar sesion.'
  }
}
</script>

<template>
  <main class="auth-shell">
    <section class="auth-card auth-card--premium">
      <div class="auth-brand">
        <span class="eyebrow">Card Bastion</span>
        <h1 class="page-title">Tu cuenta, tus preventas, en una app clara y moderna.</h1>
        <p class="page-copy">
          Inicia sesion para consultar tus apartados, pagos y perfil desde una experiencia mobile-first.
        </p>
      </div>

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

        <div v-if="localError || authStore.error" class="error-banner">
          {{ localError || authStore.error }}
        </div>

        <button class="button" type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? 'Entrando...' : 'Iniciar sesion' }}
        </button>
      </form>
    </section>
  </main>
</template>
