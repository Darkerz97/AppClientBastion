<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import DataModeNotice from '../components/DataModeNotice.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import PaymentStatusPill from '../components/PaymentStatusPill.vue'
import PreorderSummaryCard from '../components/PreorderSummaryCard.vue'
import StatCard from '../components/StatCard.vue'
import { getCustomerPreorders } from '../services/preordersService'
import { useAuthStore } from '../stores/auth'
import { formatCurrency } from '../utils/formatters'
import { toServiceError } from '../utils/serviceError'

const loading = ref(true)
const error = ref('')
const preorders = ref([])
const authStore = useAuthStore()

const totalCount = computed(() => preorders.value.length)
const pendingTotal = computed(() => preorders.value.reduce((sum, preorder) => sum + preorder.pending, 0))
const activePreorders = computed(() => preorders.value.filter((preorder) => preorder.pending > 0 || preorder.deliveryStatus !== 'Entregada'))

async function loadPreorders() {
  loading.value = true
  error.value = ''

  try {
    preorders.value = await getCustomerPreorders()
  } catch (loadError) {
    error.value = toServiceError(loadError, 'No se pudieron cargar las preventas.')
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
      subtitle="Apartados activos, pagos, alertas y entregas."
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

    <DataModeNotice :mode="authStore.authMode" />

    <section class="metric-grid">
      <StatCard label="Preventas activas" :value="`${activePreorders.length}`" />
      <StatCard label="Pendiente acumulado" :value="formatCurrency(pendingTotal)" />
    </section>

    <LoadingState v-if="loading" title="Cargando preventas" message="Estamos consultando tu informacion mas reciente." />

    <EmptyState v-else-if="error" title="No fue posible mostrar tus preventas" :message="error">
      <div class="inline-actions state-card__actions">
        <button class="ghost-button" type="button" @click="loadPreorders">Intentar de nuevo</button>
      </div>
    </EmptyState>

    <EmptyState v-else-if="!preorders.length" title="Aun no tienes preventas" message="Cuando exista el endpoint publico para mis preventas, las veras aqui con pagos y entrega." />

    <template v-else>
      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Preventas que requieren accion</h2>
            <p class="section-card__text">Se destacan primero las que tienen saldo pendiente o entrega proxima.</p>
          </div>
        </div>
        <div v-if="activePreorders.length" class="list compact-list">
          <article v-for="preorder in activePreorders" :key="`active-${preorder.id}`" class="surface-subcard">
            <div class="row-between">
              <div>
                <p class="preorder-label">Preventa #{{ preorder.id }}</p>
                <h3 class="preorder-name">{{ preorder.title }}</h3>
              </div>
              <PaymentStatusPill :status="preorder.status" :pending-amount="preorder.pending" />
            </div>
            <p class="muted">
              {{ preorder.pending > 0 ? `Pago pendiente: ${formatCurrency(preorder.pending)}` : preorder.deliveryStatus }}
            </p>
            <RouterLink class="header-link-button" :to="`/preorders/${preorder.id}`">Ver detalle</RouterLink>
          </article>
        </div>
      </section>

      <section class="list">
        <div v-for="preorder in preorders" :key="preorder.id">
          <PreorderSummaryCard :preorder="preorder" />
          <div class="surface-card section-card section-card--tight">
            <div class="data-grid preorder-detail-grid">
              <div class="data-point">
                <span>Pendiente</span>
                <strong>{{ formatCurrency(preorder.pending) }}</strong>
              </div>
              <div class="data-point">
                <span>Entrega</span>
                <strong>{{ preorder.deliveryStatus }}</strong>
              </div>
              <div class="data-point">
                <span>Items</span>
                <strong>{{ preorder.items.length }}</strong>
              </div>
            </div>
            <RouterLink class="header-link-button" :to="`/preorders/${preorder.id}`">Abrir detalle</RouterLink>
          </div>
        </div>
      </section>
    </template>
  </section>
</template>
