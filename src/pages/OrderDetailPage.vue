<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import DataModeNotice from '../components/DataModeNotice.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import OrderSummaryCard from '../components/OrderSummaryCard.vue'
import { getOrderDetail } from '../services/ordersService'
import { useAuthStore } from '../stores/auth'
import { formatCurrency } from '../utils/formatters'
import { toServiceError } from '../utils/serviceError'

const route = useRoute()
const authStore = useAuthStore()
const loading = ref(true)
const error = ref('')
const order = ref(null)

async function loadOrder() {
  loading.value = true
  error.value = ''

  try {
    order.value = await getOrderDetail(`${route.params.id}`)
  } catch (requestError) {
    error.value = toServiceError(requestError, 'No fue posible cargar el detalle de compra.')
  } finally {
    loading.value = false
  }
}

onMounted(loadOrder)
</script>

<template>
  <section class="page-section">
    <AppHeader
      title="Detalle de compra"
      subtitle="Resumen de productos, pago y recompensas generadas."
      :avatar-name="authStore.customerName"
      :avatar-src="authStore.profilePhotoUrl"
    >
      <template #action>
        <RouterLink class="header-link-button" to="/orders">Volver</RouterLink>
      </template>
    </AppHeader>

    <DataModeNotice :mode="authStore.authMode" />

    <LoadingState v-if="loading" title="Cargando compra" message="Estamos reuniendo el ticket y sus recompensas." />

    <EmptyState v-else-if="error" title="No fue posible cargar la compra" :message="error" />

    <template v-else-if="order">
      <OrderSummaryCard :order="order" />

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Productos</h2>
            <p class="section-card__text">Detalle compacto del ticket del cliente.</p>
          </div>
        </div>
        <div class="list compact-list">
          <article v-for="item in order.items" :key="item.name" class="surface-subcard">
            <div class="row-between">
              <strong>{{ item.name }}</strong>
              <span>{{ item.quantity }}x</span>
            </div>
            <p class="muted">{{ formatCurrency(item.total) }}</p>
          </article>
        </div>
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Pago y recompensas</h2>
            <p class="section-card__text">Relacion entre la compra, el metodo y lo acreditado.</p>
          </div>
        </div>
        <article class="surface-subcard">
          <div class="data-grid">
            <div class="data-point">
              <span>Metodo</span>
              <strong>{{ order.paymentMethod || 'Por confirmar' }}</strong>
            </div>
            <div class="data-point">
              <span>Puntos</span>
              <strong>{{ order.rewardsGenerated || 0 }}</strong>
            </div>
            <div class="data-point">
              <span>Credito</span>
              <strong>{{ formatCurrency(order.creditGenerated) }}</strong>
            </div>
          </div>
        </article>
      </section>
    </template>
  </section>
</template>
