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
    <p class="muted">
      {{ summary.expiringPoints ? `${summary.expiringPoints} puntos vencen el ${formatShortDate(summary.expiringAt)}` : 'Sin vencimientos cercanos.' }}
    </p>
  </article>
</template>
