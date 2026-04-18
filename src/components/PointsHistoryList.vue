<script setup>
import { formatCurrency, formatShortDate } from '../utils/formatters'

defineProps({
  movements: {
    type: Array,
    default: () => [],
  },
})

function formatDelta(value, suffix) {
  const amount = Number(value || 0)
  const prefix = amount > 0 ? '+' : ''
  return `${prefix}${amount} ${suffix}`
}
</script>

<template>
  <div class="list compact-list">
    <article v-for="movement in movements" :key="movement.id" class="surface-subcard">
      <div class="row-between">
        <div>
          <p class="preorder-label">{{ movement.origin }}</p>
          <h3 class="preorder-name">{{ movement.label }}</h3>
        </div>
        <span class="status-pill" :class="movement.status === 'aplicado' ? 'is-settled' : 'is-default'">
          {{ movement.status }}
        </span>
      </div>

      <div class="data-grid">
        <div class="data-point">
          <span>Puntos</span>
          <strong>{{ formatDelta(movement.points, 'pts') }}</strong>
        </div>
        <div class="data-point">
          <span>Credito</span>
          <strong>{{ formatCurrency(movement.credit) }}</strong>
        </div>
        <div class="data-point">
          <span>Fecha</span>
          <strong>{{ formatShortDate(movement.occurredAt) }}</strong>
        </div>
      </div>

      <p class="muted">{{ movement.description }}</p>
    </article>
  </div>
</template>
