<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import DataModeNotice from '../components/DataModeNotice.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import PaymentStatusPill from '../components/PaymentStatusPill.vue'
import StatCard from '../components/StatCard.vue'
import { getCustomerTournaments, registerToTournament } from '../services/tournamentsService'
import { useAuthStore } from '../stores/auth'
import { formatCurrency, formatDateTime, formatPercent } from '../utils/formatters'
import { toServiceError } from '../utils/serviceError'

const authStore = useAuthStore()
const loading = ref(true)
const savingTournamentId = ref('')
const error = ref('')
const success = ref('')
const tournaments = ref({
  upcoming: [],
  mine: [],
  history: [],
  stats: {
    attended: 0,
    matchesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winStreak: 0,
    wlRate: 0,
  },
})

const myUpcoming = computed(() => tournaments.value.mine.length ? tournaments.value.mine : tournaments.value.upcoming.filter((item) => Boolean(item.myRegistration)))

async function loadTournaments() {
  loading.value = true
  error.value = ''

  try {
    tournaments.value = await getCustomerTournaments()
  } catch (requestError) {
    error.value = toServiceError(requestError, 'No fue posible cargar tus torneos.')
  } finally {
    loading.value = false
  }
}

async function handleRegister(tournamentId) {
  savingTournamentId.value = `${tournamentId}`
  error.value = ''
  success.value = ''

  try {
    await registerToTournament(`${tournamentId}`)
    await loadTournaments()
    success.value = 'Tu inscripcion se registro. Si sigue pendiente de pago, aqui mismo veras el siguiente paso.'
  } catch (requestError) {
    error.value = toServiceError(requestError, 'No fue posible registrarte al torneo.')
  } finally {
    savingTournamentId.value = ''
  }
}

onMounted(loadTournaments)
</script>

<template>
  <section class="page-section">
    <AppHeader
      title="Torneos"
      subtitle="Eventos proximos, tus inscripciones activas y resultados."
      :avatar-name="authStore.customerName"
      :avatar-src="authStore.profilePhotoUrl"
    >
      <template #action>
        <button class="header-icon-button" type="button" @click="loadTournaments" :disabled="loading">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5a7 7 0 1 1-6.18 3.71H3.5A.5.5 0 0 1 3.15 7.85l2.7-2.7a.5.5 0 0 1 .7 0l2.7 2.7a.5.5 0 0 1-.35.86H7.76A5.5 5.5 0 1 0 12 6.5a.75.75 0 0 1 0-1.5" />
          </svg>
        </button>
      </template>
    </AppHeader>

    <DataModeNotice :mode="authStore.authMode" />

    <section class="metric-grid">
      <StatCard label="Jugados" :value="`${tournaments.stats.attended}`" />
      <StatCard label="Win rate" :value="formatPercent(tournaments.stats.wlRate)" />
      <StatCard label="Wins" :value="`${tournaments.stats.wins}`" />
      <StatCard label="Registros activos" :value="`${myUpcoming.length}`" />
    </section>

    <div v-if="success" class="success-banner">{{ success }}</div>

    <LoadingState v-if="loading" title="Cargando torneos" message="Estamos reuniendo tus proximos eventos y tu historial." />

    <EmptyState v-else-if="error" title="No fue posible mostrar los torneos" :message="error">
      <div class="inline-actions state-card__actions">
        <button class="ghost-button" type="button" @click="loadTournaments">Intentar de nuevo</button>
      </div>
    </EmptyState>

    <template v-else>
      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Proximos torneos</h2>
            <p class="section-card__text">Eventos con cupo, costo y CTA directo de inscripcion.</p>
          </div>
        </div>

        <div v-if="tournaments.upcoming.length" class="list">
          <article v-for="tournament in tournaments.upcoming" :key="tournament.id" class="premium-card tournament-card">
            <div class="preorder-top">
              <div>
                <p class="preorder-label">{{ tournament.format }} · {{ tournament.type }}</p>
                <h3 class="preorder-name">{{ tournament.name }}</h3>
              </div>
              <PaymentStatusPill
                :status="tournament.myRegistration?.status || tournament.status"
                :pending-amount="tournament.myRegistration?.paymentPending || 0"
              />
            </div>

            <div class="data-grid tournament-grid">
              <div class="data-point">
                <span>Fecha</span>
                <strong>{{ formatDateTime(tournament.startsAt) }}</strong>
              </div>
              <div class="data-point">
                <span>Costo</span>
                <strong>{{ tournament.entryFee == null ? 'Por confirmar' : formatCurrency(tournament.entryFee) }}</strong>
              </div>
              <div class="data-point">
                <span>Cupo</span>
                <strong>{{ tournament.registrationsCount }}/{{ tournament.capacity || '-' }}</strong>
              </div>
            </div>

            <p class="muted">{{ tournament.location }}</p>

            <div class="inline-actions card-actions">
              <RouterLink class="header-link-button" :to="`/tournaments/${tournament.id}`">Ver detalle</RouterLink>
              <button
                v-if="!tournament.myRegistration"
                class="button button--inline"
                type="button"
                :disabled="savingTournamentId === `${tournament.id}`"
                @click="handleRegister(tournament.id)"
              >
                {{ savingTournamentId === `${tournament.id}` ? 'Registrando...' : 'Inscribirme' }}
              </button>
              <span v-else class="success-copy">
                {{ tournament.myRegistration?.label || 'Ya tienes registro activo.' }}
              </span>
            </div>
          </article>
        </div>

        <EmptyState v-else title="Sin torneos proximos" message="Cuando el portal publique nuevos eventos apareceran aqui." />
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Mis registros activos</h2>
            <p class="section-card__text">Tus siguientes torneos con estado de pago y siguiente paso visible.</p>
          </div>
        </div>

        <div v-if="myUpcoming.length" class="list compact-list">
          <article v-for="tournament in myUpcoming" :key="`active-${tournament.id}`" class="surface-subcard">
            <div class="row-between">
              <div>
                <p class="preorder-label">{{ tournament.format }}</p>
                <h3 class="preorder-name">{{ tournament.name }}</h3>
              </div>
              <PaymentStatusPill
                :status="tournament.myRegistration?.status"
                :pending-amount="tournament.myRegistration?.paymentPending || 0"
              />
            </div>
            <p class="muted">{{ tournament.myRegistration?.notes || formatDateTime(tournament.startsAt) }}</p>
            <RouterLink class="header-link-button" :to="`/tournaments/${tournament.id}`">Ver seguimiento</RouterLink>
          </article>
        </div>

        <EmptyState v-else title="Sin registros activos" message="Cuando te inscribas a un torneo se mostrara aqui." />
      </section>

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Historial</h2>
            <p class="section-card__text">Posicion final, record y desempeno cuando el backend lo entregue.</p>
          </div>
        </div>

        <div v-if="tournaments.history.length" class="list">
          <article v-for="tournament in tournaments.history" :key="`history-${tournament.id}`" class="surface-subcard">
            <div class="row-between">
              <div>
                <p class="preorder-label">{{ tournament.format }}</p>
                <h3 class="preorder-name">{{ tournament.name }}</h3>
              </div>
              <span class="status-pill is-default">
                {{ tournament.myRegistration?.finalPosition ? `Top ${tournament.myRegistration.finalPosition}` : tournament.myRegistration?.result || tournament.status }}
              </span>
            </div>
            <p class="muted">{{ tournament.myRegistration?.result || formatDateTime(tournament.startsAt) }}</p>
            <RouterLink class="header-link-button" :to="`/tournaments/${tournament.id}`">Ver resultado</RouterLink>
          </article>
        </div>

        <EmptyState v-else title="Sin historial registrado" message="Tu participacion en torneos aparecera aqui cuando exista el endpoint publico." />
      </section>
    </template>
  </section>
</template>
