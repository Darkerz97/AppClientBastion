<script setup>
import PaymentStatusPill from './PaymentStatusPill.vue'
import { formatCurrency, formatShortDate } from '../utils/formatters'

defineProps({
  preorder: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <article class="premium-card preorder-card">
    <div class="preorder-top">
      <div>
        <p class="preorder-label">Preventa #{{ preorder.id }}</p>
        <h2 class="preorder-name">{{ preorder.title }}</h2>
      </div>
      <PaymentStatusPill :status="preorder.status" :pending-amount="preorder.pending" />
    </div>

    <div class="data-grid">
      <div class="data-point">
        <span>Total</span>
        <strong>{{ formatCurrency(preorder.total) }}</strong>
      </div>
      <div class="data-point">
        <span>Pagado</span>
        <strong>{{ formatCurrency(preorder.paid) }}</strong>
      </div>
      <div class="data-point">
        <span>Fecha</span>
        <strong>{{ formatShortDate(preorder.createdAt) }}</strong>
      </div>
    </div>
  </article>
</template>
