<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import DataModeNotice from '../components/DataModeNotice.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import OrderSummaryCard from '../components/OrderSummaryCard.vue'
import StatCard from '../components/StatCard.vue'
import { getCustomerOrders } from '../services/ordersService'
import { useAuthStore } from '../stores/auth'
import { formatCurrency } from '../utils/formatters'
import { toServiceError } from '../utils/serviceError'

const authStore = useAuthStore()
const loading = ref(true)
const error = ref('')
const orders = ref([])

const totalAmount = computed(() => orders.value.reduce((sum, order) => sum + order.total, 0))
const totalRewards = computed(() => orders.value.reduce((sum, order) => sum + order.rewardsGenerated, 0))

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
      title="Compras"
      subtitle="Historial de tickets, pagos y recompensas generadas."
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
      <StatCard label="Compras" :value="`${orders.length}`" />
      <StatCard label="Monto acumulado" :value="formatCurrency(totalAmount)" />
      <StatCard label="Puntos generados" :value="`${totalRewards}`" />
      <StatCard label="Credito actual" :value="formatCurrency(authStore.user?.availableCredit)" />
    </section>

    <LoadingState v-if="loading" title="Cargando compras" message="Estamos consultando tu historial mas reciente." />

    <EmptyState v-else-if="error" title="No fue posible mostrar las compras" :message="error" />

    <EmptyState v-else-if="!orders.length" title="Sin compras registradas" message="Tu historial de compras aparecera aqui con sus recompensas relacionadas." />

    <section v-else class="list">
      <div v-for="order in orders" :key="order.id">
        <OrderSummaryCard :order="order" />
        <div class="surface-card section-card section-card--tight">
          <div class="data-grid order-grid">
            <div class="data-point">
              <span>Metodo</span>
              <strong>{{ order.paymentMethod || 'Por confirmar' }}</strong>
            </div>
            <div class="data-point">
              <span>Canal</span>
              <strong>{{ order.channel }}</strong>
            </div>
            <div class="data-point">
              <span>Items</span>
              <strong>{{ order.items.length }}</strong>
            </div>
          </div>
          <RouterLink class="header-link-button" :to="`/orders/${order.id}`">Ver detalle</RouterLink>
        </div>
      </div>
    </section>
  </section>
</template>
