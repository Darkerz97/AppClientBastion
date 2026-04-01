<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { getApiErrorMessage } from '../api/axios'
import { getCustomerPreorders } from '../api/preorders'
import AppHeader from '../components/AppHeader.vue'
import LoadingState from '../components/LoadingState.vue'
import StatCard from '../components/StatCard.vue'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const preorders = ref([])
const loadingSummary = ref(true)
const summaryError = ref('')

const activePreorders = computed(() =>
  preorders.value.filter((preorder) => {
    const status = `${preorder.status || preorder.payment_status || preorder.state || ''}`.toLowerCase()
    return !['cancelada', 'cancelled', 'entregada', 'delivered'].includes(status)
  }),
)

const pendingTotal = computed(() =>
  activePreorders.value.reduce((sum, preorder) => {
    const pending = Number(preorder.pending_amount ?? preorder.pending ?? preorder.restante ?? 0)
    return sum + (Number.isNaN(pending) ? 0 : pending)
  }, 0),
)

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
})

async function loadSummary() {
  loadingSummary.value = true
  summaryError.value = ''

  try {
    preorders.value = await getCustomerPreorders()
  } catch (error) {
    summaryError.value = getApiErrorMessage(error, 'No pudimos cargar tu resumen ahora.')
  } finally {
    loadingSummary.value = false
  }
}

async function handleLogout() {
  authStore.logout()
  router.replace('/login')
}

onMounted(loadSummary)
</script>

<template>
  <section class="page-section">
    <AppHeader
      :title="`Hola, ${authStore.customerFirstName}`"
      subtitle="Bienvenido a Card Bastion"
      :avatar-name="authStore.customerName"
      :avatar-src="authStore.profilePhotoUrl"
    >
      <template #action>
        <button class="header-link-button" type="button" @click="handleLogout">Salir</button>
      </template>
    </AppHeader>

    <section class="hero-card">
      <div class="hero-card__content">
        <span class="hero-card__tag">Mi cuenta</span>
        <h2 class="hero-card__title">Controla tus preventas con una experiencia simple y confiable.</h2>
        <p class="hero-card__text">
          Consulta tu saldo pendiente, revisa tus apartados activos y mantente al dia desde una sola app.
        </p>
      </div>
    </section>

    <LoadingState
      v-if="loadingSummary"
      title="Preparando tu resumen"
      message="Estamos cargando la informacion mas reciente de tu cuenta."
    />

    <template v-else>
      <section class="metric-grid">
        <StatCard label="Preventas activas" :value="`${activePreorders.length}`" />
        <StatCard label="Saldo pendiente" :value="currencyFormatter.format(pendingTotal)" />
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Accesos rapidos</h2>
            <p class="section-card__text">Navega rapido por lo que mas consultas.</p>
          </div>
        </div>

        <div class="quick-actions">
          <RouterLink class="quick-action" to="/preorders">
            <span class="quick-action__icon">▣</span>
            <strong>Mis preventas</strong>
            <span>Revisa estados, pagos y pendientes.</span>
          </RouterLink>

          <RouterLink class="quick-action" to="/profile">
            <span class="quick-action__icon">◔</span>
            <strong>Mi perfil</strong>
            <span>Consulta tu informacion y foto de cuenta.</span>
          </RouterLink>
        </div>
      </section>

      <section v-if="summaryError" class="surface-card section-card">
        <div class="error-banner">{{ summaryError }}</div>
      </section>
    </template>
  </section>
</template>
