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
  <article class="surface-subcard credit-balance-card">
    <div class="row-between">
      <div>
        <p class="preorder-label">Credito de tienda</p>
        <h3 class="preorder-name">{{ formatCurrency(summary.creditBalance) }}</h3>
      </div>
      <span class="status-pill is-default">Canje futuro</span>
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
        <span>Vencimiento</span>
        <strong>{{ summary.expiringPoints ? `${summary.expiringPoints} pts · ${formatShortDate(summary.expiringAt)}` : 'Sin vencimientos' }}</strong>
      </div>
    </div>
  </article>
</template>
