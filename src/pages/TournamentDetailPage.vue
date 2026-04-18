<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import DataModeNotice from '../components/DataModeNotice.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import PaymentStatusPill from '../components/PaymentStatusPill.vue'
import TournamentDetailCard from '../components/TournamentDetailCard.vue'
import { getTournamentDetail, registerToTournament } from '../services/tournamentsService'
import { useAuthStore } from '../stores/auth'
import { formatDateTime, formatCurrency } from '../utils/formatters'
import { toServiceError } from '../utils/serviceError'

const route = useRoute()
const authStore = useAuthStore()
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')
const tournament = ref(null)

async function loadTournament() {
  loading.value = true
  error.value = ''

  try {
    tournament.value = await getTournamentDetail(`${route.params.id}`)
  } catch (requestError) {
    error.value = toServiceError(requestError, 'No fue posible cargar el detalle del torneo.')
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  saving.value = true
  error.value = ''
  success.value = ''

  try {
    await registerToTournament(`${route.params.id}`)
    await loadTournament()
    success.value = 'Tu registro fue creado. Si el pago queda pendiente, se refleja en esta misma vista.'
  } catch (requestError) {
    error.value = toServiceError(requestError, 'No fue posible registrar tu inscripcion.')
  } finally {
    saving.value = false
  }
}

onMounted(loadTournament)
</script>

<template>
  <section class="page-section">
    <AppHeader
      title="Detalle del torneo"
      subtitle="Informacion completa, estado de registro y siguientes pasos."
      :avatar-name="authStore.customerName"
      :avatar-src="authStore.profilePhotoUrl"
    >
      <template #action>
        <RouterLink class="header-link-button" to="/tournaments">Volver</RouterLink>
      </template>
    </AppHeader>

    <DataModeNotice :mode="authStore.authMode" />

    <LoadingState v-if="loading" title="Cargando torneo" message="Estamos consultando todos los detalles del evento." />

    <EmptyState v-else-if="error" title="No fue posible cargar el torneo" :message="error">
      <div class="inline-actions state-card__actions">
        <button class="ghost-button" type="button" @click="loadTournament">Intentar de nuevo</button>
      </div>
    </EmptyState>

    <template v-else-if="tournament">
      <TournamentDetailCard :tournament="tournament" />

      <div v-if="success" class="success-banner">{{ success }}</div>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Estado de tu registro</h2>
            <p class="section-card__text">Te dice si ya pagaste, si sigues pendiente o si ya hiciste check-in.</p>
          </div>
        </div>

        <div class="list compact-list">
          <article class="surface-subcard">
            <div class="row-between">
              <div>
                <p class="preorder-label">Registro del jugador</p>
                <h3 class="preorder-name">{{ tournament.myRegistration?.label || 'Aun no estas inscrito' }}</h3>
              </div>
              <PaymentStatusPill
                :status="tournament.myRegistration?.status || 'not_registered'"
                :pending-amount="tournament.myRegistration?.paymentPending || 0"
              />
            </div>
            <p class="muted">
              {{
                tournament.myRegistration?.notes ||
                'Inscribete desde esta vista y aqui mismo veras el estado de pago o confirmacion.'
              }}
            </p>
            <div class="data-grid">
              <div class="data-point">
                <span>Registro</span>
                <strong>{{ formatDateTime(tournament.myRegistration?.registeredAt) }}</strong>
              </div>
              <div class="data-point">
                <span>Saldo pendiente</span>
                <strong>{{ formatCurrency(tournament.myRegistration?.paymentPending || 0) }}</strong>
              </div>
              <div class="data-point">
                <span>Resultado</span>
                <strong>{{ tournament.myRegistration?.result || 'Pendiente' }}</strong>
              </div>
            </div>
          </article>
        </div>

        <button v-if="!tournament.myRegistration" class="button" type="button" :disabled="saving" @click="handleRegister">
          {{ saving ? 'Inscribiendo...' : 'Inscribirme al torneo' }}
        </button>
      </section>

      <section v-if="tournament.nextSteps?.length" class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Siguientes pasos</h2>
            <p class="section-card__text">Acciones claras para no perder tu lugar.</p>
          </div>
        </div>
        <div class="list compact-list">
          <article v-for="step in tournament.nextSteps" :key="step" class="surface-subcard">
            <p class="muted">{{ step }}</p>
          </article>
        </div>
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Beneficios y premios</h2>
            <p class="section-card__text">Lo que incluye y lo que puedes ganar.</p>
          </div>
        </div>
        <div class="benefit-list">
          <span v-for="item in [...(tournament.itemsIncluded || []), ...(tournament.prizes || [])]" :key="item" class="benefit-chip">
            {{ item }}
          </span>
        </div>
      </section>
    </template>
  </section>
</template>
