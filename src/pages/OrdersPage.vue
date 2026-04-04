<script setup>
import { computed, onMounted, ref } from 'vue'
import DataModeNotice from '../components/DataModeNotice.vue'
import AppHeader from '../components/AppHeader.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import StatCard from '../components/StatCard.vue'
import { getCustomerOrders } from '../services/ordersService'
import { useAuthStore } from '../stores/auth'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import { toServiceError } from '../utils/serviceError'

const authStore = useAuthStore()
const loading = ref(true)
const error = ref('')
const orders = ref([])

const orderCount = computed(() => orders.value.length)
const lifetimeTotal = computed(() => orders.value.reduce((sum, order) => sum + order.total, 0))

function summaryItems(order) {
  if (!order.items.length) {
    return 'Sin desglose de productos'
  }

  return order.items
    .map((item) => `${item.quantity} x ${item.name}`)
    .join(', ')
}

async function loadOrders() {
  loading.value = true
  error.value = ''

  try {
    orders.value = await getCustomerOrders()
  } catch (requestError) {
    error.value = toServiceError(requestError, 'No fue posible cargar tus compras.')
  } finally {
    loading.value = false
  }
}

onMounted(loadOrders)
</script>

<template>
  <section class="page-section">
    <AppHeader
      title="Mis compras"
      subtitle="Tus pedidos asociados al storefront de Card Bastion."
      :avatar-name="authStore.customerName"
      :avatar-src="authStore.profilePhotoUrl"
    >
      <template #action>
        <button class="header-icon-button" type="button" @click="loadOrders" :disabled="loading">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5a7 7 0 1 1-6.18 3.71H3.5A.5.5 0 0 1 3.15 7.85l2.7-2.7a.5.5 0 0 1 .7 0l2.7 2.7a.5.5 0 0 1-.35.86H7.76A5.5 5.5 0 1 0 12 6.5a.75.75 0 0 1 0-1.5" />
          </svg>
        </button>
      </template>
    </AppHeader>

    <DataModeNotice :mode="authStore.authMode" />

    <section class="metric-grid">
      <StatCard label="Pedidos" :value="`${orderCount}`" />
      <StatCard label="Total historico" :value="formatCurrency(lifetimeTotal)" />
    </section>

    <LoadingState
      v-if="loading"
      title="Cargando compras"
      message="Estamos consultando tu historial de pedidos."
    />

    <EmptyState
      v-else-if="error"
      title="No fue posible mostrar tus compras"
      :message="error"
    >
      <div class="inline-actions state-card__actions">
        <button class="ghost-button" type="button" @click="loadOrders">Intentar de nuevo</button>
      </div>
    </EmptyState>

    <EmptyState
      v-else-if="!orders.length"
      title="Aun no tienes compras registradas"
      message="Cuando el backend exponga tus ventas del storefront, apareceran aqui con detalle."
    />

    <section v-else class="list">
      <article v-for="order in orders" :key="order.id" class="premium-card preorder-card">
        <div class="preorder-top">
          <div>
            <p class="preorder-label">Pedido #{{ order.id }}</p>
            <h2 class="preorder-name">{{ formatCurrency(order.total) }}</h2>
          </div>

          <span class="status-pill is-default">{{ order.status }}</span>
        </div>

        <div class="data-grid order-grid">
          <div class="data-point">
            <span>Fecha</span>
            <strong>{{ formatDateTime(order.soldAt) }}</strong>
          </div>
          <div class="data-point">
            <span>Canal</span>
            <strong>{{ order.channel }}</strong>
          </div>
          <div class="data-point">
            <span>Articulos</span>
            <strong>{{ order.items.length }}</strong>
          </div>
        </div>

        <p class="muted">{{ summaryItems(order) }}</p>
      </article>
    </section>
  </section>
</template>
