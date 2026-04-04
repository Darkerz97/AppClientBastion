<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import DataModeNotice from '../components/DataModeNotice.vue'
import AppHeader from '../components/AppHeader.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import StatCard from '../components/StatCard.vue'
import { getCustomerDashboard } from '../services/dashboardService'
import { useAuthStore } from '../stores/auth'
import { formatCurrency, formatDateTime, formatPercent } from '../utils/formatters'
import { toServiceError } from '../utils/serviceError'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)
const error = ref('')
const dashboard = ref({
  recentOrders: [],
  recentTournaments: [],
  preorders: [],
  stats: {
    attended: 0,
    wins: 0,
    wlRate: 0,
  },
})

const activePreorders = computed(() =>
  dashboard.value.preorders.filter((preorder) => preorder.pending > 0),
)

const pendingBalance = computed(() =>
  activePreorders.value.reduce((sum, preorder) => sum + preorder.pending, 0),
)

const quickLinks = [
  {
    to: '/orders',
    title: 'Compras',
    description: 'Revisa pedidos, totales y articulos comprados.',
    icon: 'CP',
  },
  {
    to: '/preorders',
    title: 'Preventas',
    description: 'Consulta pagos, saldo pendiente y entrega.',
    icon: 'PR',
  },
  {
    to: '/tournaments',
    title: 'Torneos',
    description: 'Ve proximos eventos y tu historial de participacion.',
    icon: 'TR',
  },
  {
    to: '/profile',
    title: 'Perfil',
    description: 'Actualiza tus datos y tu foto de perfil.',
    icon: 'PF',
  },
]

async function loadDashboard() {
  loading.value = true
  error.value = ''

  try {
    dashboard.value = await getCustomerDashboard()
  } catch (requestError) {
    error.value = toServiceError(requestError, 'No pudimos cargar tu dashboard.')
  } finally {
    loading.value = false
  }
}

async function handleLogout() {
  await authStore.logout()
  router.replace('/login')
}

onMounted(loadDashboard)
</script>

<template>
  <section class="page-section">
    <AppHeader
      :title="`Hola, ${authStore.customerFirstName}`"
      subtitle="Tu dashboard de cliente Card Bastion."
      :avatar-name="authStore.customerName"
      :avatar-src="authStore.profilePhotoUrl"
    >
      <template #action>
        <button class="header-link-button" type="button" @click="handleLogout">Salir</button>
      </template>
    </AppHeader>

    <DataModeNotice :mode="authStore.authMode" />

    <section class="hero-card dashboard-hero">
      <div class="hero-card__content">
        <span class="hero-card__tag">Portal jugador</span>
        <h2 class="hero-card__title">Compras, preventas y torneos en una sola vista.</h2>
        <p class="hero-card__text">
          Sigue tu actividad reciente, tus proximos eventos y el estado general de tu cuenta.
        </p>
      </div>
    </section>

    <LoadingState
      v-if="loading"
      title="Preparando tu dashboard"
      message="Estamos reuniendo tu resumen mas reciente."
    />

    <template v-else-if="!error">
      <section class="metric-grid">
        <StatCard label="Compras recientes" :value="`${dashboard.recentOrders.length}`" />
        <StatCard label="Saldo en preventas" :value="formatCurrency(pendingBalance)" />
        <StatCard label="Torneos jugados" :value="`${dashboard.stats.attended}`" />
        <StatCard label="Win rate" :value="formatPercent(dashboard.stats.wlRate)" />
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Accesos rapidos</h2>
            <p class="section-card__text">Todo lo importante de tu cuenta a un toque.</p>
          </div>
        </div>

        <div class="quick-actions quick-actions--grid">
          <RouterLink
            v-for="link in quickLinks"
            :key="link.to"
            class="quick-action"
            :to="link.to"
          >
            <span class="quick-action__icon quick-action__icon--text">{{ link.icon }}</span>
            <strong>{{ link.title }}</strong>
            <span>{{ link.description }}</span>
          </RouterLink>
        </div>
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Proximos torneos</h2>
            <p class="section-card__text">Eventos destacados disponibles para registrarte.</p>
          </div>
          <RouterLink class="header-link-button" to="/tournaments">Ver todo</RouterLink>
        </div>

        <div v-if="dashboard.recentTournaments.length" class="list compact-list">
          <article
            v-for="tournament in dashboard.recentTournaments"
            :key="tournament.id"
            class="surface-subcard"
          >
            <div class="row-between">
              <div>
                <p class="preorder-label">{{ tournament.format }}</p>
                <h3 class="preorder-name">{{ tournament.name }}</h3>
              </div>
              <span class="status-pill" :class="tournament.myRegistration ? 'is-settled' : 'is-pending'">
                {{ tournament.myRegistration ? 'Registrado' : tournament.status }}
              </span>
            </div>
            <p class="muted">{{ formatDateTime(tournament.startsAt) }}</p>
          </article>
        </div>

        <EmptyState
          v-else
          title="Sin torneos destacados"
          message="Cuando haya nuevos eventos publicados apareceran aqui."
        />
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Actividad reciente</h2>
            <p class="section-card__text">Tus ultimos movimientos dentro de la tienda.</p>
          </div>
          <RouterLink class="header-link-button" to="/orders">Mis compras</RouterLink>
        </div>

        <div v-if="dashboard.recentOrders.length" class="list compact-list">
          <article
            v-for="order in dashboard.recentOrders"
            :key="order.id"
            class="surface-subcard"
          >
            <div class="row-between">
              <div>
                <p class="preorder-label">Pedido #{{ order.id }}</p>
                <h3 class="preorder-name">{{ formatCurrency(order.total) }}</h3>
              </div>
              <span class="status-pill is-default">{{ order.status }}</span>
            </div>
            <p class="muted">{{ formatDateTime(order.soldAt) }}</p>
          </article>
        </div>

        <EmptyState
          v-else
          title="Sin compras recientes"
          message="Tus compras del portal de jugador apareceran aqui."
        />
      </section>
    </template>

    <EmptyState
      v-else
      title="No fue posible cargar tu dashboard"
      :message="error"
    >
      <div class="inline-actions state-card__actions">
        <button class="ghost-button" type="button" @click="loadDashboard">Intentar de nuevo</button>
      </div>
    </EmptyState>
  </section>
</template>
