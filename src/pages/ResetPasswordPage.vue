<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { openPasswordReset } from '../api/passwordRecovery'

const route = useRoute()
const isOpening = ref(false)
const localError = ref('')

const token = computed(() => `${route.params.token || route.query.token || ''}`.trim())
const email = computed(() => `${route.query.email || ''}`.trim())

async function continueReset() {
  localError.value = ''

  if (!token.value) {
    localError.value = 'El enlace no incluye un token valido.'
    return
  }

  isOpening.value = true

  try {
    await openPasswordReset(token.value, email.value)
  } catch (error) {
    localError.value = error?.message || 'No se pudo abrir el restablecimiento de password.'
  } finally {
    isOpening.value = false
  }
}
</script>

<template>
  <main class="auth-shell">
    <section class="auth-card auth-card--premium">
      <div class="auth-brand">
        <span class="eyebrow">Nuevo password</span>
        <h1 class="page-title">Termina el cambio de password en la pagina segura del servidor.</h1>
        <p class="page-copy">
          Este paso usa el token del correo para abrir la pantalla oficial de restablecimiento sin perder el contexto.
        </p>
      </div>

      <div class="stack">
        <div class="surface-subcard">
          <strong>{{ token ? 'Token detectado' : 'Falta el token de recuperacion' }}</strong>
          <p class="muted">
            {{
              token
                ? 'Abre la pagina segura para elegir tu nuevo password.'
                : 'Vuelve a solicitar el correo de recuperacion para recibir un enlace valido.'
            }}
          </p>
          <p v-if="email" class="muted">Email: {{ email }}</p>
        </div>

        <div v-if="localError" class="error-banner">
          {{ localError }}
        </div>

        <button class="button" type="button" :disabled="isOpening || !token" @click="continueReset">
          {{ isOpening ? 'Abriendo...' : 'Continuar con restablecimiento' }}
        </button>

        <RouterLink class="ghost-button" to="/forgot-password">Solicitar otro correo</RouterLink>
      </div>
    </section>
  </main>
</template>
