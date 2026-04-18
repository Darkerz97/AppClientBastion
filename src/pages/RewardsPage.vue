<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import CreditBalanceCard from '../components/CreditBalanceCard.vue'
import DataModeNotice from '../components/DataModeNotice.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import PointsHistoryList from '../components/PointsHistoryList.vue'
import RewardSummaryCard from '../components/RewardSummaryCard.vue'
import TierProgressCard from '../components/TierProgressCard.vue'
import { getRewardsOverview } from '../services/rewardsService'
import { getTierProgress } from '../services/tiersService'
import { useAuthStore } from '../stores/auth'
import { toServiceError } from '../utils/serviceError'

const authStore = useAuthStore()
const loading = ref(true)
const error = ref('')
const rewards = ref({ summary: {}, movements: [] })
const tierProgress = ref({})

async function loadRewards() {
  loading.value = true
  error.value = ''

  try {
    const [rewardsData, tierData] = await Promise.all([getRewardsOverview(), getTierProgress()])
    rewards.value = rewardsData
    tierProgress.value = tierData
  } catch (requestError) {
    error.value = toServiceError(requestError, 'No fue posible cargar tus recompensas.')
  } finally {
    loading.value = false
  }
}

onMounted(loadRewards)
</script>

<template>
  <section class="page-section">
    <AppHeader
      title="Recompensas"
      subtitle="Puntos, credito y movimientos de fidelizacion."
      :avatar-name="authStore.customerName"
      :avatar-src="authStore.profilePhotoUrl"
    />

    <DataModeNotice :mode="authStore.authMode" />

    <LoadingState v-if="loading" title="Cargando recompensas" message="Estamos consultando tu saldo y movimientos." />

    <EmptyState v-else-if="error" title="No fue posible cargar recompensas" :message="error" />

    <template v-else>
      <RewardSummaryCard :summary="rewards.summary" />
      <CreditBalanceCard :summary="rewards.summary" />
      <TierProgressCard :progress="tierProgress" />

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Como ganas recompensas</h2>
            <p class="section-card__text">La app queda lista para compras, torneos, bonos y premios.</p>
          </div>
        </div>
        <div class="benefit-list">
          <span class="benefit-chip">Compras en tienda</span>
          <span class="benefit-chip">Participacion en torneos</span>
          <span class="benefit-chip">Premios por posicion</span>
          <span class="benefit-chip">Bonos y promociones</span>
        </div>
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Movimientos</h2>
            <p class="section-card__text">Cada abono indica origen, fecha, puntos y credito.</p>
          </div>
        </div>
        <PointsHistoryList :movements="rewards.movements" />
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Sigue acumulando</h2>
            <p class="section-card__text">Atajos utiles para continuar ganando valor.</p>
          </div>
        </div>
        <div class="quick-actions quick-actions--grid">
          <RouterLink class="quick-action" to="/tournaments">
            <strong>Torneos</strong>
            <span>Participa para sumar puntos y posibles premios.</span>
          </RouterLink>
          <RouterLink class="quick-action" to="/preorders">
            <strong>Preventas</strong>
            <span>Liquida apartados y mantente activo en tus lanzamientos.</span>
          </RouterLink>
        </div>
      </section>
    </template>
  </section>
</template>
