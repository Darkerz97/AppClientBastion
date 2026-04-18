<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import CreditBalanceCard from '../components/CreditBalanceCard.vue'
import DataModeNotice from '../components/DataModeNotice.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import OrderSummaryCard from '../components/OrderSummaryCard.vue'
import PaymentStatusPill from '../components/PaymentStatusPill.vue'
import PreorderSummaryCard from '../components/PreorderSummaryCard.vue'
import RewardSummaryCard from '../components/RewardSummaryCard.vue'
import StatCard from '../components/StatCard.vue'
import TierProgressCard from '../components/TierProgressCard.vue'
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
  registeredTournaments: [],
  preorders: [],
  rewards: {},
  tierProgress: {},
  notifications: [],
  stats: {
    attended: 0,
    wins: 0,
    wlRate: 0,
  },
})

const activePreorders = computed(() => dashboard.value.preorders.filter((preorder) => preorder.pending > 0))
const pendingBalance = computed(() => activePreorders.value.reduce((sum, preorder) => sum + preorder.pending, 0))
const unreadNotifications = computed(() => dashboard.value.notifications.filter((item) => !item.readAt))

const quickLinks = [
  { to: '/tournaments', title: 'Torneos', description: 'Registros, pagos y resultados.' },
  { to: '/preorders', title: 'Preventas', description: 'Apartados activos y saldos pendientes.' },
  { to: '/rewards', title: 'Recompensas', description: 'Puntos, credito y beneficios.' },
  { to: '/notifications', title: 'Avisos', description: 'Recordatorios y eventos importantes.' },
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
      subtitle="Tu resumen diario de Card Bastion."
      :avatar-name="authStore.customerName"
      :avatar-src="authStore.profilePhotoUrl"
    >
      <template #action>
        <RouterLink class="header-icon-button notification-button" to="/notifications" aria-label="Notificaciones">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3a5 5 0 0 0-5 5v2.28c0 .69-.22 1.36-.62 1.93L5.2 13.8A1 1 0 0 0 6 15.4h12a1 1 0 0 0 .8-1.6l-1.18-1.59a3.27 3.27 0 0 1-.62-1.93V8a5 5 0 0 0-5-5m0 18a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 21" />
          </svg>
          <span v-if="unreadNotifications.length" class="notification-dot">{{ unreadNotifications.length }}</span>
        </RouterLink>
        <button class="header-link-button" type="button" @click="handleLogout">Salir</button>
      </template>
    </AppHeader>

    <DataModeNotice :mode="authStore.authMode" />

    <section class="hero-card dashboard-hero">
      <div class="hero-card__content">
        <span class="hero-card__tag">MVP jugador</span>
        <h2 class="hero-card__title">Torneos, preventas y recompensas bien visibles.</h2>
        <p class="hero-card__text">
          Revisa lo urgente primero: pagos pendientes, eventos activos y el progreso de tu cuenta.
        </p>
      </div>
    </section>

    <LoadingState v-if="loading" title="Preparando tu dashboard" message="Estamos reuniendo tu resumen mas reciente." />

    <template v-else-if="!error">
      <section class="metric-grid">
        <StatCard label="Puntos actuales" :value="`${dashboard.rewards.pointsBalance || 0}`" />
        <StatCard label="Credito disponible" :value="formatCurrency(dashboard.rewards.creditBalance)" />
        <StatCard label="Pendiente preventas" :value="formatCurrency(pendingBalance)" />
        <StatCard label="Win rate" :value="formatPercent(dashboard.stats.wlRate)" />
      </section>

      <RewardSummaryCard :summary="dashboard.rewards" />
      <CreditBalanceCard :summary="dashboard.rewards" />
      <TierProgressCard :progress="dashboard.tierProgress" />

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Accesos rapidos</h2>
            <p class="section-card__text">Atajos a las acciones con mas valor para el cliente.</p>
          </div>
        </div>

        <div class="quick-actions quick-actions--grid">
          <RouterLink v-for="link in quickLinks" :key="link.to" class="quick-action" :to="link.to">
            <strong>{{ link.title }}</strong>
            <span>{{ link.description }}</span>
          </RouterLink>
        </div>
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Tus proximos torneos</h2>
            <p class="section-card__text">Eventos donde ya tienes algo que atender o puedes participar.</p>
          </div>
          <RouterLink class="header-link-button" to="/tournaments">Ver todo</RouterLink>
        </div>

        <div v-if="dashboard.recentTournaments.length" class="list compact-list">
          <article v-for="tournament in dashboard.recentTournaments" :key="tournament.id" class="surface-subcard">
            <div class="row-between">
              <div>
                <p class="preorder-label">{{ tournament.format }}</p>
                <h3 class="preorder-name">{{ tournament.name }}</h3>
              </div>
              <PaymentStatusPill
                :status="tournament.myRegistration?.status || tournament.status"
                :pending-amount="tournament.myRegistration?.paymentPending || 0"
              />
            </div>
            <p class="muted">{{ formatDateTime(tournament.startsAt) }}</p>
            <RouterLink class="header-link-button" :to="`/tournaments/${tournament.id}`">Ver detalle</RouterLink>
          </article>
        </div>

        <EmptyState v-else title="Sin torneos destacados" message="Cuando haya nuevos eventos publicados apareceran aqui." />
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Tus preventas activas</h2>
            <p class="section-card__text">Lo que necesita seguimiento de pago o entrega.</p>
          </div>
          <RouterLink class="header-link-button" to="/preorders">Ver preventas</RouterLink>
        </div>

        <div v-if="activePreorders.length" class="list compact-list">
          <PreorderSummaryCard v-for="preorder in activePreorders" :key="preorder.id" :preorder="preorder" />
        </div>

        <EmptyState v-else title="Sin pagos pendientes" message="Tus preventas activas apareceran aqui con alertas claras." />
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Avisos importantes</h2>
            <p class="section-card__text">Lo mas relevante para actuar desde la app.</p>
          </div>
          <RouterLink class="header-link-button" to="/notifications">Centro de avisos</RouterLink>
        </div>

        <div v-if="dashboard.notifications.length" class="list compact-list">
          <article v-for="notification in dashboard.notifications.slice(0, 3)" :key="notification.id" class="surface-subcard">
            <div class="row-between">
              <div>
                <p class="preorder-label">{{ notification.type }}</p>
                <h3 class="preorder-name">{{ notification.title }}</h3>
              </div>
              <span class="status-pill" :class="notification.readAt ? 'is-default' : 'is-pending'">
                {{ notification.readAt ? 'Leida' : 'Nueva' }}
              </span>
            </div>
            <p class="muted">{{ notification.message }}</p>
          </article>
        </div>

        <EmptyState v-else title="Sin avisos recientes" message="Tus recordatorios y promociones apareceran aqui." />
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Compras recientes</h2>
            <p class="section-card__text">Relaciona tu historial con recompensas y credito generado.</p>
          </div>
          <RouterLink class="header-link-button" to="/orders">Ver compras</RouterLink>
        </div>

        <div v-if="dashboard.recentOrders.length" class="list compact-list">
          <OrderSummaryCard v-for="order in dashboard.recentOrders" :key="order.id" :order="order" />
        </div>

        <EmptyState v-else title="Sin compras registradas" message="Tu historial se mostrara aqui cuando la API responda ventas del cliente." />
      </section>
    </template>

    <EmptyState v-else title="No fue posible cargar tu dashboard" :message="error">
      <div class="inline-actions state-card__actions">
        <button class="ghost-button" type="button" @click="loadDashboard">Intentar de nuevo</button>
      </div>
    </EmptyState>
  </section>
</template>
