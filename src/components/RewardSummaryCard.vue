<script setup>
import { formatCurrency, formatShortDate } from '../utils/formatters'

defineProps({
  summary: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <article class="premium-card reward-summary-card">
    <div class="row-between">
      <div>
        <p class="preorder-label">Recompensas</p>
        <h3 class="preorder-name">{{ summary.pointsBalance || 0 }} puntos</h3>
      </div>
      <span class="status-pill is-settled">Activas</span>
    </div>

    <div class="data-grid">
      <div class="data-point">
        <span>Puntos actuales</span>
        <strong>{{ summary.pointsBalance || 0 }} pts</strong>
      </div>
      <div class="data-point">
        <span>Credito disponible</span>
        <strong>{{ formatCurrency(summary.creditBalance) }}</strong>
      </div>
      <div class="data-point">
        <span>Por vencer</span>
        <strong>{{ summary.expiringPoints ? `${summary.expiringPoints} pts · ${formatShortDate(summary.expiringAt)}` : 'Sin vencimientos' }}</strong>
      </div>
    </div>
  </article>
</template>
