<script setup>
import { formatCurrency, formatShortDate } from '../utils/formatters'
import PaymentStatusPill from './PaymentStatusPill.vue'

defineProps({
  order: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <article class="premium-card preorder-card">
    <div class="preorder-top">
      <div>
        <p class="preorder-label">Compra #{{ order.id }}</p>
        <h2 class="preorder-name">{{ order.summary || 'Compra Card Bastion' }}</h2>
      </div>
      <PaymentStatusPill :status="order.status" />
    </div>

    <div class="data-grid">
      <div class="data-point">
        <span>Fecha</span>
        <strong>{{ formatShortDate(order.soldAt) }}</strong>
      </div>
      <div class="data-point">
        <span>Total</span>
        <strong>{{ formatCurrency(order.total) }}</strong>
      </div>
      <div class="data-point">
        <span>Puntos generados</span>
        <strong>{{ order.rewardsGenerated || 0 }}</strong>
      </div>
    </div>
  </article>
</template>
