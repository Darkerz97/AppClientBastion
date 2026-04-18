<script setup>
import PaymentStatusPill from './PaymentStatusPill.vue'
import { formatCurrency, formatDateTime } from '../utils/formatters'

defineProps({
  tournament: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <article class="premium-card tournament-detail-card">
    <div class="preorder-top">
      <div>
        <p class="preorder-label">{{ tournament.type || tournament.format }}</p>
        <h2 class="preorder-name">{{ tournament.name }}</h2>
      </div>
      <PaymentStatusPill
        :status="tournament.myRegistration?.status || tournament.status"
        :pending-amount="tournament.myRegistration?.paymentPending || 0"
      />
    </div>

    <p class="muted">{{ tournament.description }}</p>

    <div class="data-grid">
      <div class="data-point">
        <span>Fecha</span>
        <strong>{{ formatDateTime(tournament.startsAt) }}</strong>
      </div>
      <div class="data-point">
        <span>Costo</span>
        <strong>{{ tournament.entryFee == null ? 'Por confirmar' : formatCurrency(tournament.entryFee) }}</strong>
      </div>
      <div class="data-point">
        <span>Premio</span>
        <strong>{{ tournament.prizePool ? formatCurrency(tournament.prizePool) : 'Por anunciar' }}</strong>
      </div>
    </div>

    <div class="data-grid">
      <div class="data-point">
        <span>Inscritos</span>
        <strong>{{ tournament.registrationsCount }}/{{ tournament.capacity || '-' }}</strong>
      </div>
      <div class="data-point">
        <span>Sede</span>
        <strong>{{ tournament.location }}</strong>
      </div>
      <div class="data-point">
        <span>Cierre registro</span>
        <strong>{{ formatDateTime(tournament.registrationClosesAt) }}</strong>
      </div>
    </div>
  </article>
</template>
