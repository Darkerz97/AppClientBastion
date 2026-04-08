<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import DataModeNotice from '../components/DataModeNotice.vue'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
})

const localError = ref('')

async function submitRegister() {
  localError.value = ''

  if (form.password !== form.password_confirmation) {
    localError.value = 'La confirmacion del password no coincide.'
    return
  }

  try {
    await authStore.register(form)
    router.replace('/')
  } catch (error) {
    localError.value = authStore.error || error?.message || 'No fue posible crear la cuenta.'
  }
}
</script>

<template>
  <main class="auth-shell">
    <section class="auth-card auth-card--premium">
      <div class="auth-brand">
        <span class="eyebrow">Registro</span>
        <h1 class="page-title">Crea tu cuenta de cliente para seguir tus compras y eventos.</h1>
        <p class="page-copy">
          Dejamos esta pantalla lista para el flujo mobile de Card Bastion y desacoplada del backend privado.
        </p>
      </div>

      <DataModeNotice :mode="authStore.authMode" />

      <form class="stack" @submit.prevent="submitRegister">
        <div class="field">
          <label for="name">Nombre</label>
          <input id="name" v-model.trim="form.name" placeholder="Tu nombre" type="text" required />
        </div>

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
          <label for="phone">Telefono</label>
          <input
            id="phone"
            v-model.trim="form.phone"
            autocomplete="tel"
            inputmode="tel"
            placeholder="555-010-2026"
            type="tel"
          />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            autocomplete="new-password"
            placeholder="Minimo 8 caracteres"
            type="password"
            required
          />
        </div>

        <div class="field">
          <label for="password_confirmation">Confirmar password</label>
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            autocomplete="new-password"
            placeholder="Confirma tu password"
            type="password"
            required
          />
        </div>

        <div v-if="localError || authStore.error" class="error-banner">
          {{ localError || authStore.error }}
        </div>

        <button class="button" type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? 'Creando cuenta...' : 'Crear cuenta' }}
        </button>
      </form>

      <p class="login-helper">
        <RouterLink class="text-link" to="/forgot-password">Olvide mi password</RouterLink>
      </p>

      <p class="login-helper">
        ¿Ya tienes cuenta?
        <RouterLink class="text-link" to="/login">Inicia sesion</RouterLink>
      </p>
    </section>
  </main>
</template>
