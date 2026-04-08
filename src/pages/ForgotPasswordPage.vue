<script setup>
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { openPasswordRecovery } from '../api/passwordRecovery'

const form = reactive({
  email: '',
})

const isOpening = ref(false)
const localError = ref('')

async function continueRecovery() {
  localError.value = ''
  isOpening.value = true

  try {
    await openPasswordRecovery(form.email)
  } catch (error) {
    localError.value = error?.message || 'No se pudo abrir la recuperacion de password.'
  } finally {
    isOpening.value = false
  }
}
</script>

<template>
  <main class="auth-shell">
    <section class="auth-card auth-card--premium">
      <div class="auth-brand">
        <span class="eyebrow">Recuperacion</span>
        <h1 class="page-title">Restablece tu password sin salirte del flujo seguro de Card Bastion.</h1>
        <p class="page-copy">
          Por seguridad, el correo y el cambio de password se completan en el sitio protegido del servidor.
        </p>
      </div>

      <form class="stack" @submit.prevent="continueRecovery">
        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model.trim="form.email"
            autocomplete="email"
            inputmode="email"
            placeholder="cliente@cardbastion.com"
            type="email"
          />
        </div>

        <div class="surface-subcard">
          <strong>Como funciona</strong>
          <p class="muted">
            Te llevamos a la pantalla oficial para enviar el correo de recuperacion. Desde ahi recibiras el enlace
            para elegir un nuevo password.
          </p>
        </div>

        <div v-if="localError" class="error-banner">
          {{ localError }}
        </div>

        <button class="button" type="submit" :disabled="isOpening">
          {{ isOpening ? 'Abriendo...' : 'Continuar con recuperacion' }}
        </button>
      </form>

      <p class="login-helper">
        ¿Recordaste tu password?
        <RouterLink class="text-link" to="/login">Volver a iniciar sesion</RouterLink>
      </p>
    </section>
  </main>
</template>
