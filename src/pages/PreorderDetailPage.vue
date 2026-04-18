<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import DataModeNotice from '../components/DataModeNotice.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import PaymentStatusPill from '../components/PaymentStatusPill.vue'
import PreorderSummaryCard from '../components/PreorderSummaryCard.vue'
import { getPreorderDetail } from '../services/preordersService'
import { useAuthStore } from '../stores/auth'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import { toServiceError } from '../utils/serviceError'

const route = useRoute()
const authStore = useAuthStore()
const loading = ref(true)
const error = ref('')
const preorder = ref(null)

async function loadPreorder() {
  loading.value = true
  error.value = ''

  try {
    preorder.value = await getPreorderDetail(`${route.params.id}`)
  } catch (requestError) {
    error.value = toServiceError(requestError, 'No fue posible cargar la preventa.')
  } finally {
    loading.value = false
  }
}

onMounted(loadPreorder)
</script>

<template>
  <section class="page-section">
    <AppHeader
      title="Detalle de preventa"
      subtitle="Pagos, saldo, articulos y disponibilidad."
      :avatar-name="authStore.customerName"
      :avatar-src="authStore.profilePhotoUrl"
    >
      <template #action>
        <RouterLink class="header-link-button" to="/preorders">Volver</RouterLink>
      </template>
    </AppHeader>

    <DataModeNotice :mode="authStore.authMode" />

    <LoadingState v-if="loading" title="Cargando preventa" message="Estamos reuniendo el estado mas reciente de tu apartado." />

    <EmptyState v-else-if="error" title="No fue posible cargar la preventa" :message="error" />

    <template v-else-if="preorder">
      <PreorderSummaryCard :preorder="preorder" />

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Estado y entrega</h2>
            <p class="section-card__text">Lo importante para que el cliente sepa si debe pagar o recoger.</p>
          </div>
        </div>
        <article class="surface-subcard">
          <div class="row-between">
            <div>
              <p class="preorder-label">Disponibilidad</p>
              <h3 class="preorder-name">{{ preorder.deliveryStatus }}</h3>
            </div>
            <PaymentStatusPill :status="preorder.status" :pending-amount="preorder.pending" />
          </div>
          <div class="data-grid">
            <div class="data-point">
              <span>Pendiente</span>
              <strong>{{ formatCurrency(preorder.pending) }}</strong>
            </div>
            <div class="data-point">
              <span>Entrega</span>
              <strong>{{ formatDateTime(preorder.deliveryDate) }}</strong>
            </div>
            <div class="data-point">
              <span>Pickup</span>
              <strong>{{ preorder.pickupLocation }}</strong>
            </div>
          </div>
          <p class="muted">{{ preorder.notes || 'Sin notas adicionales.' }}</p>
        </article>
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Articulos incluidos</h2>
            <p class="section-card__text">Resumen del apartado para validar cantidades y montos.</p>
          </div>
        </div>
        <div class="list compact-list">
          <article v-for="item in preorder.items" :key="item.id || item.name" class="surface-subcard">
            <div class="row-between">
              <strong>{{ item.name }}</strong>
              <span>{{ item.quantity }}x</span>
            </div>
            <p class="muted">{{ formatCurrency(item.total || item.unitPrice) }}</p>
          </article>
        </div>
      </section>

      <section v-if="preorder.alerts?.length" class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Alertas</h2>
            <p class="section-card__text">Mensajes operativos para evitar retrasos o confusiones.</p>
          </div>
        </div>
        <div class="list compact-list">
          <article v-for="alert in preorder.alerts" :key="alert" class="surface-subcard">
            <p class="muted">{{ alert }}</p>
          </article>
        </div>
      </section>
    </template>
  </section>
</template>
