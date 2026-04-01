<script setup>
import { computed, onMounted, ref } from 'vue'
import { getApiErrorMessage } from '../api/axios'
import { getCustomerPreorders } from '../api/preorders'
import AppHeader from '../components/AppHeader.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import StatCard from '../components/StatCard.vue'
import { useAuthStore } from '../stores/auth'

const loading = ref(true)
const error = ref('')
const preorders = ref([])
const authStore = useAuthStore()

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
})

const totalCount = computed(() => preorders.value.length)
const pendingTotal = computed(() =>
  preorders.value.reduce((sum, preorder) => {
    const pending = Number(preorderPending(preorder))
    return sum + (Number.isNaN(pending) ? 0 : pending)
  }, 0),
)

function normalizeAmount(value) {
  const amount = Number(value || 0)
  return currencyFormatter.format(Number.isNaN(amount) ? 0 : amount)
}

function normalizeStatus(status) {
  const value = `${status || 'Sin estado'}`.trim()
  return value || 'Sin estado'
}

function statusClass(status) {
  const slug = normalizeStatus(status).toLowerCase().replace(/\s+/g, '-')

  if (['pagado', 'paid', 'completed', 'completado'].includes(slug)) {
    return 'is-settled'
  }

  if (['abonada', 'partial', 'partially-paid'].includes(slug)) {
    return 'is-partial'
  }

  if (['pendiente', 'pending', 'processing', 'en-proceso'].includes(slug)) {
    return 'is-pending'
  }

  if (['entregada', 'delivered'].includes(slug)) {
    return 'is-delivered'
  }

  if (['cancelado', 'cancelled'].includes(slug)) {
    return 'is-cancelled'
  }

  return 'is-default'
}

function preorderName(preorder) {
  return (
    preorder.product_name ||
    preorder.product?.name ||
    preorder.name ||
    preorder.title ||
    'Producto sin nombre'
  )
}

function preorderStatus(preorder) {
  return preorder.status || preorder.payment_status || preorder.state || 'Pendiente'
}

function preorderTotal(preorder) {
  return preorder.total ?? preorder.total_amount ?? preorder.amount ?? 0
}

function preorderPaid(preorder) {
  return preorder.paid ?? preorder.paid_amount ?? preorder.abonado ?? 0
}

function preorderPending(preorder) {
  return preorder.pending ?? preorder.pending_amount ?? preorder.restante ?? 0
}

async function loadPreorders() {
  loading.value = true
  error.value = ''

  try {
    preorders.value = await getCustomerPreorders()
  } catch (loadError) {
    error.value = getApiErrorMessage(loadError, 'No se pudieron cargar las preventas.')
  } finally {
    loading.value = false
  }
}

onMounted(loadPreorders)
</script>

<template>
  <section class="page-section">
    <AppHeader
      title="Tus preventas"
      subtitle="Sigue tus apartados, pagos y saldos pendientes."
      :avatar-name="authStore.customerName"
      :avatar-src="authStore.profilePhotoUrl"
    >
      <template #action>
        <button class="header-icon-button" type="button" @click="loadPreorders" :disabled="loading">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5a7 7 0 1 1-6.18 3.71H3.5A.5.5 0 0 1 3.15 7.85l2.7-2.7a.5.5 0 0 1 .7 0l2.7 2.7a.5.5 0 0 1-.35.86H7.76A5.5 5.5 0 1 0 12 6.5a.75.75 0 0 1 0-1.5" />
          </svg>
        </button>
      </template>
    </AppHeader>

    <section class="metric-grid">
      <StatCard label="Preventas activas" :value="`${totalCount}`" />
      <StatCard label="Pendiente acumulado" :value="normalizeAmount(pendingTotal)" />
    </section>

    <LoadingState
      v-if="loading"
      title="Cargando preventas"
      message="Estamos consultando tu informacion mas reciente."
    />

    <EmptyState
      v-else-if="error"
      title="No fue posible mostrar tus preventas"
      :message="error"
    >
      <div class="inline-actions state-card__actions">
        <button class="ghost-button" type="button" @click="loadPreorders">Intentar de nuevo</button>
      </div>
    </EmptyState>

    <EmptyState
      v-else-if="!preorders.length"
      title="Aun no tienes preventas"
      message="Cuando registres un apartado en Card Bastion, lo veras aqui con su saldo y estado."
    />

    <section v-else class="list">
      <article
        v-for="(preorder, index) in preorders"
        :key="preorder.id || preorder.uuid || `${preorderName(preorder)}-${index}`"
        class="preorder-card premium-card"
      >
        <div class="preorder-top">
          <div>
            <p class="preorder-label">Producto</p>
            <h2 class="preorder-name">{{ preorderName(preorder) }}</h2>
          </div>

          <span class="status-pill" :class="statusClass(preorderStatus(preorder))">
            {{ normalizeStatus(preorderStatus(preorder)) }}
          </span>
        </div>

        <div class="data-grid">
          <div class="data-point">
            <span>Total</span>
            <strong>{{ normalizeAmount(preorderTotal(preorder)) }}</strong>
          </div>

          <div class="data-point">
            <span>Pagado</span>
            <strong>{{ normalizeAmount(preorderPaid(preorder)) }}</strong>
          </div>

          <div class="data-point">
            <span>Pendiente</span>
            <strong>{{ normalizeAmount(preorderPending(preorder)) }}</strong>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>
